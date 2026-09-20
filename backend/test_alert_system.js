const axios = require('axios');
const mongoose = require('mongoose');
const io = require('socket.io-client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testAlertLifecycle() {
  console.log('======================================================');
  console.log('  🚨 Testing Flash Flood Alert Dispatch & Auto-Resolve ');
  console.log('======================================================\n');

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/floodatlas';
  await mongoose.connect(mongoUri);
  const Alert = mongoose.connection.db.collection('alerts');

  // Clear previous test records
  await Alert.deleteMany({ zoneId: 'chamoli-ghat' });

  const socket = io(SOCKET_URL, { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log(`[SOCKET CONNECTED] Socket ID: ${socket.id}`);
  });

  socket.on('alert:triggered', (alertDoc) => {
    console.log(`⚡ [WEBSOCKET ALERT BROADCAST]: ${alertDoc.title} | Severity: ${alertDoc.severity}`);
  });

  socket.on('alert:resolved', (resolvedDoc) => {
    console.log(`✅ [WEBSOCKET ALERT RESOLVED]: Zone ${resolvedDoc.zoneId}`);
  });

  // 1. Trigger Flash Flood Surge
  console.log('\n--- Step 1: Triggering Severe Flash Flood Surge (chamoli-ghat) ---');
  const severeSurgePayload = {
    sensorId: 'IOT-GHAT-CRITICAL-TEST',
    zoneId: 'chamoli-ghat',
    rainfall_mm: 120.0,
    water_level_m: 7.2,
    soil_moisture_pct: 98.0,
    temperature_c: 16.0,
    humidity_pct: 99,
    water_level_rate_of_rise_m_h: 2.4,
    provenance: '[SIMULATED]',
    batteryPct: 88
  };

  const surgeRes = await axios.post(`${BASE_URL}/iot/telemetry`, severeSurgePayload);
  console.log(`[INGESTION STATUS]: ${surgeRes.status}`);

  // Allow async ML inference and DB persistence to finish
  console.log('Waiting 3.5s for ML inference and Risk Assessment...');
  await sleep(3500);

  const riskCheck = await axios.get(`${BASE_URL}/risk/zones/chamoli-ghat/latest`);
  console.log(`[RISK EVALUATION]: Score=${riskCheck.data.data.riskScore} | Tier=${riskCheck.data.data.riskTier}`);

  const activeAlert = await Alert.findOne({ zoneId: 'chamoli-ghat', status: 'ACTIVE' });
  if (activeAlert) {
    console.log(`\n✅ [DB VERIFIED] Active Alert Created:`);
    console.log(`  ID: ${activeAlert._id}`);
    console.log(`  Severity: ${activeAlert.severity}`);
    console.log(`  Title: ${activeAlert.title}`);
    console.log(`  Score: ${activeAlert.riskScore}`);
  } else {
    console.error(`\n❌ [FAIL] No active alert found in DB for chamoli-ghat!`);
  }

  // 2. Test Deduplication
  console.log('\n--- Step 2: Testing Deduplication (Sending Duplicate Surge) ---');
  await axios.post(`${BASE_URL}/iot/telemetry`, severeSurgePayload);
  await sleep(2500);

  const activeCount = await Alert.countDocuments({ zoneId: 'chamoli-ghat', status: 'ACTIVE' });
  console.log(`[DEDUPLICATION CHECK] Active alert count in DB: ${activeCount} (Expected: 1)`);

  // 3. Auto-Resolve with Safe Baseline
  console.log('\n--- Step 3: Sending Safe Normal Telemetry to Auto-Resolve ---');
  const safePayload = {
    sensorId: 'IOT-GHAT-SAFE-TEST',
    zoneId: 'chamoli-ghat',
    rainfall_mm: 0.0,
    water_level_m: 0.5,
    soil_moisture_pct: 20.0,
    temperature_c: 24.0,
    humidity_pct: 40,
    water_level_rate_of_rise_m_h: -0.2,
    provenance: '[SIMULATED]',
    batteryPct: 88
  };

  await axios.post(`${BASE_URL}/iot/telemetry`, safePayload);
  console.log('Waiting 3.5s for normalisation & auto-resolve cycle...');
  await sleep(3500);

  const remainingActive = await Alert.countDocuments({ zoneId: 'chamoli-ghat', status: 'ACTIVE' });
  const resolvedAlert = await Alert.findOne({ zoneId: 'chamoli-ghat', status: 'RESOLVED' });

  console.log(`[RESOLVE CHECK] Active alerts remaining: ${remainingActive} (Expected: 0)`);
  console.log(`[RESOLVE CHECK] Alert marked RESOLVED in DB: ${resolvedAlert ? 'YES' : 'NO'}`);

  console.log('\n======================================================');
  console.log('--- ALERT SYSTEM VERIFICATION COMPLETED ---');

  socket.disconnect();
  await mongoose.disconnect();
  process.exit(0);
}

testAlertLifecycle();