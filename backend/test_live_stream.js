const io = require('socket.io-client');
const axios = require('axios');

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true
});

let eventCount = 0;

socket.on('connect', () => {
  console.log(`\n======================================================`);
  console.log(`[SOCKET CONNECTED] Socket ID: ${socket.id}`);
  
  // Join specific rooms defined in socketHandler
  socket.emit('join:zone', 'chamoli-ghat');
  socket.emit('join:authority');
  console.log(`Subscribed to: room 'zone:chamoli-ghat' & 'authority:operations'`);
  console.log(`Listening for real-time WebSocket events...`);
  console.log(`======================================================\n`);

  setTimeout(triggerSurgeTelemetry, 500);
});

// 1. Global map sync broadcast event
socket.on('map:risk_update', (payload) => {
  eventCount++;
  console.log(`⚡ [MAP SYNC EVENT #${eventCount}] Received on 'map:risk_update'!`);
  console.log(`   Zone: ${payload.name} (${payload.zoneId})`);
  console.log(`   Risk Score: ${payload.riskScore} | Tier: ${payload.riskTier}`);
  console.log(`   Water Level: ${payload.metrics?.water_level_m}m | Rain: ${payload.metrics?.rainfall_mm}mm`);
  console.log(`   Drivers: ${Array.isArray(payload.drivers) ? payload.drivers.join(' | ') : 'N/A'}`);
  console.log(`   Ensemble Prob: ${payload.prediction?.ensembleProbability}`);
  console.log(`------------------------------------------------------`);
});

// 2. Room-based updates (authority or zone channel)
socket.onAny((eventName, ...args) => {
  if (eventName !== 'map:risk_update') {
    eventCount++;
    console.log(`📡 [ROOM EVENT: ${eventName}] Payload:`, JSON.stringify(args[0]));
  }
});

socket.on('connect_error', (err) => {
  console.error(`[SOCKET ERROR]:`, err.message);
});

async function triggerSurgeTelemetry() {
  console.log('--- Triggering Ingestion Spike for chamoli-ghat ---');

  const surgePayload = {
    sensorId: 'IOT-CHAMOLI-GHAT-WS-TEST',
    zoneId: 'chamoli-ghat',
    rainfall_mm: 82.0,
    water_level_m: 5.8,
    soil_moisture_pct: 94.0,
    temperature_c: 19.0,
    humidity_pct: 95,
    water_level_rate_of_rise_m_h: 1.25,
    provenance: '[SIMULATED]',
    batteryPct: 91
  };

  try {
    const res = await axios.post(`${API_URL}/iot/telemetry`, surgePayload);
    console.log(`[INGESTION POST] Status: ${res.status} (Accepted by backend)`);
  } catch (err) {
    console.error(`[INGESTION ERROR]:`, err.response ? err.response.data : err.message);
  }

  setTimeout(() => {
    console.log(`\n======================================================`);
    console.log(`Verification Complete. Total live events received: ${eventCount}`);
    socket.disconnect();
    process.exit(0);
  }, 3500);
}