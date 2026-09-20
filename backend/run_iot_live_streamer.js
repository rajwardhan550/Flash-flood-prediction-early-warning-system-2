const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const BASE_URL = 'http://localhost:5000/api';
const REFRESH_INTERVAL_MS = 30000;
const DELAY_BETWEEN_ZONES_MS = 300; // Pacing buffer to avoid rate limits

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function addJitter(val, minDelta, maxDelta, precision = 2) {
  const delta = Math.random() * (maxDelta - minDelta) + minDelta;
  return Number((val + delta).toFixed(precision));
}

async function startRealisticIoTStreamer() {
  console.log('================================================================');
  console.log('  🌊 FloodAtlas Dynamic Multi-Zone IoT Streamer (Paced Stream)  ');
  console.log('================================================================\n');

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/floodatlas';
  await mongoose.connect(mongoUri);

  const panchayats = await mongoose.connection.db.collection('zones').find({}).toArray();
  await mongoose.disconnect();

  if (!panchayats.length) {
    console.error('[FAIL] No Panchayats found in database.');
    return;
  }

  // Initialize baseline hydrological state per zone
  const zoneStates = {};
  for (const p of panchayats) {
    const slope = p.slope_deg ?? p.terrain?.slope_deg ?? 18.5;
    const riverDist = p.distance_to_river_m ?? p.terrain?.distance_to_river_m ?? 85;

    // Distinct baselines based on proximity and slope
    const baseWater = riverDist < 50 ? 3.2 : slope > 25 ? 2.4 : 1.6;
    const baseMoisture = riverDist < 50 ? 74.0 : 58.0;

    zoneStates[p.zoneId] = {
      water_level_m: baseWater,
      soil_moisture_pct: baseMoisture,
      rate_of_rise_m_h: 0.15,
      batteryPct: Math.floor(Math.random() * 15) + 85
    };
  }

  async function emitTelemetryBatch(cycleCount) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n--- [CYCLE #${cycleCount}] Live Telemetry Broadcast at ${timestamp} ---`);

    for (const p of panchayats) {
      const state = zoneStates[p.zoneId];

      // Subtle dynamic fluctuation per cycle
      state.water_level_m = Math.max(0.5, Math.min(7.5, addJitter(state.water_level_m, -0.06, 0.09, 2)));
      state.soil_moisture_pct = Math.max(30.0, Math.min(98.0, addJitter(state.soil_moisture_pct, -0.3, 0.5, 1)));
      state.rate_of_rise_m_h = Number((state.water_level_m * 0.08 + addJitter(0, -0.04, 0.04, 2)).toFixed(2));
      state.batteryPct = Math.max(12, +(state.batteryPct - 0.01).toFixed(1));

      const payload = {
        sensorId: `IOT-${p.zoneId.toUpperCase()}`,
        zoneId: p.zoneId,
        rainfall_mm: 0.0,
        water_level_m: state.water_level_m,
        soil_moisture_pct: state.soil_moisture_pct,
        water_level_rate_of_rise_m_h: state.rate_of_rise_m_h,
        provenance: '[SIMULATED]',
        batteryPct: state.batteryPct
      };

      try {
        await axios.post(`${BASE_URL}/iot/telemetry`, payload, { timeout: 8000 });
        const riskRes = await axios.get(`${BASE_URL}/risk/zones/${p.zoneId}/latest`, { timeout: 5000 });
        const rData = riskRes.data.data;
        const metrics = rData.metrics || rData.metricsSnapshot || {};

        console.log(`  📍 ${p.name.padEnd(14)} | Water: ${metrics.water_level_m ?? state.water_level_m}m | Soil: ${metrics.soil_moisture_pct ?? state.soil_moisture_pct}% | Rise: ${metrics.rate_of_rise_m_h ?? state.rate_of_rise_m_h}m/h | Risk: ${rData.riskScore} (${rData.riskTier}) [${riskRes.data.source}]`);
      } catch (err) {
        console.error(`  ❌ Failed for ${p.name}:`, err.response?.data?.error || err.message);
      }

      // Small pacing buffer between calls
      await sleep(DELAY_BETWEEN_ZONES_MS);
    }
  }

  let cycle = 1;
  await emitTelemetryBatch(cycle++);

  setInterval(async () => {
    await emitTelemetryBatch(cycle++);
  }, REFRESH_INTERVAL_MS);
}

startRealisticIoTStreamer();