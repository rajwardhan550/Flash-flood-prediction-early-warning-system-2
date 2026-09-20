const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function runE2ETest() {
  console.log('\n--- 1. Testing Backend Health ---');
  try {
    const health = await axios.get(`${API_BASE}/health`);
    console.log('[PASS] Backend Health:', health.data);
  } catch (err) {
    console.error('[FAIL] Backend Health Check failed:', err.message);
    return;
  }

  console.log('\n--- 2. Ingesting Severe Hydrological Telemetry Packet ---');
  const testPayload = {
    sensorId: 'SIM-CHAMOLI-JOSHIMATH',
    zoneId: 'chamoli-joshimath',
    rainfall_mm: 58.4,
    water_level_m: 4.8,
    soil_moisture_pct: 82.5,
    temperature_c: 16.2,
    humidity_pct: 88.0,
    water_level_rate_of_rise_m_h: 0.42,
    provenance: '[SIMULATED]',
    batteryPct: 94,
    recordedAt: new Date().toISOString(),
  };

  try {
    const ingestRes = await axios.post(`${API_BASE}/iot/telemetry`, testPayload);
    const body = ingestRes.data;
    
    console.log('[PASS] Raw Response Received:');
    console.log(JSON.stringify(body, null, 2));

    const payload = body.data || body;
    const reading = payload.reading || payload;
    const prediction = payload.prediction || payload.inference || {};
    const risk = payload.riskAssessment || payload.assessment || {};

    console.log('\n--- Extracted Telemetry Insights ---');
    console.log('  - Reading ID:', reading._id || reading.id || 'N/A');
    console.log('  - Ensemble Prob:', prediction.ensembleProbability ?? prediction.probability ?? 'N/A');
    console.log('  - BiLSTM Prob:', prediction.biLstmProbability ?? prediction.bilstm ?? 'N/A');
    console.log('  - XGBoost Prob:', prediction.xgboostProbability ?? prediction.xgboost ?? 'N/A');
    console.log('  - Risk Score:', risk.riskScore ?? 'N/A');
    console.log('  - Risk Tier:', risk.riskTier ?? 'N/A');
    console.log('  - Identified Drivers:', risk.drivers ?? []);

  } catch (err) {
    console.error('[FAIL] Telemetry Ingestion Failed:', err.response?.data || err.message);
    return;
  }

  console.log('\n--- 3. Verifying Redis / MongoDB Authoritative Risk Route ---');
  try {
    const riskRes = await axios.get(`${API_BASE}/risk/zones/chamoli-joshimath/latest`);
    console.log(`[PASS] Risk Route (Served via ${riskRes.data.source || 'CACHE/DB'}):`);
    console.log(JSON.stringify(riskRes.data, null, 2));
  } catch (err) {
    console.error('[FAIL] Risk route retrieval failed:', err.response?.data || err.message);
    return;
  }

  console.log('\n=== END-TO-END PIPELINE VALIDATION SUCCESSFUL ===\n');
}

runE2ETest();