const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const BASE_URL = 'http://localhost:5000/api';

async function testLiveFusionPipeline() {
  console.log('--- Testing Live OpenWeather + IoT + ML Fusion Pipeline ---');
  
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/floodatlas';
  await mongoose.connect(mongoUri);
  
  // Pick 3 authentic Chamoli Panchayats
  const samplePanchayats = await mongoose.connection.db.collection('zones')
    .find({ zoneId: { $ne: 'chamoli-joshimath' } })
    .limit(3)
    .toArray();
    
  await mongoose.disconnect();

  if (!samplePanchayats.length) {
    console.error('[FAIL] No Panchayat zones found in database.');
    return;
  }

  for (const p of samplePanchayats) {
    console.log(`\n======================================================`);
    console.log(`Panchayat: ${p.name} (${p.zoneId})`);
    console.log(`Location: [${p.location?.coordinates ? p.location.coordinates.join(', ') : `${p.longitude},${p.latitude}`}]`);
    console.log(`Terrain: Slope=${p.slope_deg ?? p.terrain?.slope_deg}°, RiverDist=${p.distance_to_river_m ?? p.terrain?.distance_to_river_m}m`);
    
    // Strict schema-compliant telemetry payload
    const telemetryPayload = {
      sensorId: `IOT-${p.zoneId.toUpperCase()}`,
      zoneId: p.zoneId,
      rainfall_mm: 0.0,
      water_level_m: 4.8,
      soil_moisture_pct: 88.0,
      temperature_c: 20.0,
      humidity_pct: 45,
      water_level_rate_of_rise_m_h: 0.65,
      provenance: '[SIMULATED]',
      batteryPct: 98
    };

    try {
      const res = await axios.post(`${BASE_URL}/iot/telemetry`, telemetryPayload);
      console.log(`[INGESTION] Status: ${res.status}`);

      const riskRes = await axios.get(`${BASE_URL}/risk/zones/${p.zoneId}/latest`);
      const rData = riskRes.data.data;
      
      const metrics = rData.metrics || rData.metricsSnapshot || {};
      const pred = rData.prediction || {};

      console.log(`[LIVE EVALUATION]:`);
      console.log(`  Source: ${riskRes.data.source}`);
      console.log(`  Risk Tier: ${rData.riskTier} (Score: ${rData.riskScore})`);
      console.log(`  Hydrological Metrics: Water Level=${metrics.water_level_m ?? 'N/A'}m | Soil Moisture=${metrics.soil_moisture_pct ?? 'N/A'}% | Rate of Rise=${metrics.rate_of_rise_m_h ?? metrics.water_level_rate_of_rise_m_h ?? 'N/A'}m/h | Rain=${metrics.rainfall_mm ?? 0}mm`);
      console.log(`  ML Probabilities: BiLSTM=${pred.biLstmProbability ?? pred.bilstmProbability ?? 'N/A'} | XGBoost=${pred.xgboostProbability ?? 'N/A'} | Ensemble=${pred.ensembleProbability ?? 'N/A'}`);
      console.log(`  Drivers: ${Array.isArray(rData.drivers) && rData.drivers.length ? rData.drivers.join(' | ') : 'None'}`);
    } catch (err) {
      console.error(`[ERROR]:`, err.response ? err.response.data : err.message);
    }
  }

  console.log('\n======================================================');
  console.log('--- LIVE PIPELINE VALIDATION FINISHED ---');
}

testLiveFusionPipeline();