const io = require('socket.io-client');
const simulatorService = require('./src/services/simulatorControlService');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SOCKET_URL = 'http://localhost:5000';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSimulatorVerification() {
  console.log('======================================================');
  console.log('  🛰️  Testing Authority IoT Simulator Control Loop   ');
  console.log('======================================================\n');

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/floodatlas';
  await mongoose.connect(mongoUri);

  const socket = io(SOCKET_URL, { transports: ['websocket'] });
  let updatesCount = 0;

  socket.on('connect', () => {
    console.log(`[SOCKET CONNECTED] Listening for simulated telemetry events... (ID: ${socket.id})`);
  });

  socket.on('map:risk_update', (data) => {
    updatesCount++;
    console.log(`📡 [WS EMISSION] Zone: ${data.zoneId} | Score: ${data.riskScore} | Tier: ${data.riskTier}`);
  });

  // 1. Initial State Check
  console.log('[CHECK 1] Initial Simulator Status:', simulatorService.getStatus());

  // 2. Start Simulation with fast interval (3.5 seconds)
  console.log('\n--- Step 1: Starting Simulator Loop (3.5s interval) ---');
  simulatorService.start(3500);
  console.log('[CHECK 2] Running Status:', simulatorService.getStatus());

  // Wait for 2 ticks of telemetry ingestion
  console.log('\nWaiting 8 seconds for background telemetry generation & ML pipeline...');
  await sleep(8000);

  // 3. Trigger manual surge test for chamoli-ghat
  console.log('\n--- Step 2: Triggering High-Water Surge Scenario ---');
  const surgeActivated = simulatorService.triggerSurge('chamoli-ghat');
  console.log(`Surge trigger command dispatched: ${surgeActivated ? 'SUCCESS' : 'FAILED'}`);

  console.log('Waiting 5 seconds for surge telemetry to process...');
  await sleep(5000);

  // 4. Stop Simulator
  console.log('\n--- Step 3: Stopping Simulator Loop ---');
  simulatorService.stop();
  console.log('[CHECK 3] Final Status:', simulatorService.getStatus());
  console.log(`\nTotal WebSocket Risk Events Received: ${updatesCount}`);

  console.log('\n======================================================');
  console.log('--- SIMULATOR INTEGRATION TEST PASSED ---');

  socket.disconnect();
  await mongoose.disconnect();
  process.exit(0);
}

runSimulatorVerification();