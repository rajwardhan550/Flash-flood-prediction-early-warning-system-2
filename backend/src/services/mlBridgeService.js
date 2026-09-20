const axios = require('axios');
const IoTSensorReading = require('../models/IoTSensorReading');
const Prediction = require('../models/Prediction');
const { mlServiceUrl } = require('../config/env');
const { getCyclicTimeFeatures, computeRollingSum, computeRateOfChange } = require('../utils/helpers');
const logger = require('../utils/logger');

class MLBridgeService {
  constructor() {
    this.client = axios.create({
      baseURL: mlServiceUrl,
      timeout: 6000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Reconciles raw inputs and historical windows into the model feature array
   */
  async buildFeaturePayload(zone, latestReading) {
    const cutoff72h = new Date(Date.now() - 72 * 60 * 60 * 1000);
    
    // Fetch historical readings for window aggregations
    const history = await IoTSensorReading.find({
      zoneId: zone.zoneId,
      recordedAt: { $gte: cutoff72h }
    }).sort({ recordedAt: -1 }).lean();

    const cyclicTime = getCyclicTimeFeatures(new Date(latestReading.recordedAt));

    // Rolling rainfall windows (3h, 6h, 12h, 24h, 48h, 72h)
    const rainfall_3h_mm = computeRollingSum(history, 3, 'rainfall_mm');
    const rainfall_6h_mm = computeRollingSum(history, 6, 'rainfall_mm');
    const rainfall_12h_mm = computeRollingSum(history, 12, 'rainfall_mm');
    const rainfall_24h_mm = computeRollingSum(history, 24, 'rainfall_mm');
    const rainfall_48h_mm = computeRollingSum(history, 48, 'rainfall_mm');
    const rainfall_72h_mm = computeRollingSum(history, 72, 'rainfall_mm');

    // Water level rate of change deltas
    const curWaterLevel = latestReading.water_level_m;
    const water_level_change_1h_m = computeRateOfChange(curWaterLevel, history, 1, 'water_level_m');
    const water_level_change_3h_m = computeRateOfChange(curWaterLevel, history, 3, 'water_level_m');
    const water_level_change_6h_m = computeRateOfChange(curWaterLevel, history, 6, 'water_level_m');
    const water_level_change_12h_m = computeRateOfChange(curWaterLevel, history, 12, 'water_level_m');
    const water_level_change_24h_m = computeRateOfChange(curWaterLevel, history, 24, 'water_level_m');

    const [longitude, latitude] = zone.location.coordinates;

    // Feature dictionary mapping directly to model expectations
    return {
      rain_mm: latestReading.rainfall_mm,
      water_level_m: latestReading.water_level_m,
      soil_moisture_mean: latestReading.soil_moisture_pct,
      slope_deg: zone.slope_deg,
      latitude: latitude,
      longitude: longitude,
      gauge_zero_elevation_m: zone.elevation_m,
      gauge_height_m: zone.danger_water_level_m,
      soil_moisture_0_7cm: latestReading.soil_moisture_pct,
      soil_moisture_7_28cm: latestReading.soil_moisture_pct * 0.95,
      soil_moisture_28_100cm: latestReading.soil_moisture_pct * 0.90,
      soil_moisture_100_255cm: latestReading.soil_moisture_pct * 0.85,
      slope_latitude: latitude,
      slope_longitude: longitude,
      slope_elevation_m: zone.elevation_m,
      slope_slope_deg: zone.slope_deg,
      slope_distance_to_river_m: zone.distance_to_river_m,
      slope_distance_to_gauge_km: Number((zone.distance_to_river_m / 1000).toFixed(2)),
      landslide_record_count_year: 1,
      soil_moisture_surface_deep_diff: Number((latestReading.soil_moisture_pct * 0.15).toFixed(2)),
      rainfall_3h_mm,
      rainfall_6h_mm,
      rainfall_12h_mm,
      rainfall_24h_mm,
      rainfall_48h_mm,
      rainfall_72h_mm,
      water_level_change_1h_m,
      water_level_change_3h_m,
      water_level_change_6h_m,
      water_level_change_12h_m,
      water_level_change_24h_m,
      year: cyclicTime.year,
      month: cyclicTime.month,
      day: cyclicTime.day,
      hour: cyclicTime.hour,
      day_of_year: cyclicTime.day_of_year,
      is_monsoon: cyclicTime.is_monsoon,
      hour_sin: cyclicTime.hour_sin,
      hour_cos: cyclicTime.hour_cos,
      month_sin: cyclicTime.month_sin,
      month_cos: cyclicTime.month_cos,
      slope_grid_distance_km: 0.5,
      temperature_c: latestReading.temperature_c || 18.0,
      humidity_pct: latestReading.humidity_pct || 70.0,
      wind_speed_10m_kmh: 12.0,
      wind_speed_100m_kmh: 22.0,
      wind_direction_10m_deg: 180.0,
      wind_direction_100m_deg: 185.0
    };
  }

  /**
   * Calls the Python ML microservice and records prediction state
   */
  async runInferenceForZone(zone, latestReading) {
    const startTime = Date.now();
    const features = await this.buildFeaturePayload(zone, latestReading);

    try {
      const response = await this.client.post('/predict', {
        zoneId: zone.zoneId,
        features: features
      });

      const { biLstmProbability, xgboostProbability, ensembleProbability, modelVersion } = response.data;
      const latencyMs = Date.now() - startTime;

      const predictionDoc = await Prediction.create({
        zoneId: zone.zoneId,
        biLstmProbability,
        xgboostProbability,
        ensembleProbability,
        featureSnapshot: features,
        inferenceLatencyMs: latencyMs,
        modelVersion: modelVersion || 'bilstm-xgboost-v1',
        generatedAt: new Date()
      });

      logger.info(`Inference completed for zone: ${zone.zoneId}`, {
        subsystem: 'ML_BRIDGE',
        ensembleProbability,
        latencyMs
      });

      return predictionDoc;
    } catch (err) {
      logger.error(`ML inference failed for zone: ${zone.zoneId}`, {
        subsystem: 'ML_BRIDGE',
        error: err.message
      });
      throw new Error(`ML Microservice Inference Failed: ${err.message}`);
    }
  }
}

module.exports = new MLBridgeService();