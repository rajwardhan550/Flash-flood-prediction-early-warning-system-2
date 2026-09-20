const Zone = require('../models/Zone');
const RiskAssessment = require('../models/RiskAssessment');
const IoTReading = require('../models/IoTSensorReading');
const mlBridgeService = require('./mlBridgeService');
const openWeatherService = require('./openWeatherService');
const riskEngine = require('./riskEngine');
const alertService = require('./alertService');
const redisClient = require('../config/redis');
const logger = require('../utils/logger');

class DataIngestionService {
  async ingestReading(payload, io = null) {
    return this.processTelemetry(payload, io);
  }

  async processTelemetry(payload, io = null) {
    const {
      sensorId,
      zoneId,
      water_level_m,
      soil_moisture_pct,
      water_level_rate_of_rise_m_h,
      provenance,
      batteryPct
    } = payload;

    if (!zoneId) {
      throw new Error('Validation failed: zoneId is strictly required');
    }
    if (water_level_m === undefined || soil_moisture_pct === undefined || water_level_rate_of_rise_m_h === undefined) {
      throw new Error(`Validation failed for zone ${zoneId}: Required hydrological metrics missing`);
    }

    // 1. Zone lookup
    const zone = await Zone.findOne({ zoneId }).lean();
    if (!zone) {
      throw new Error(`Zone ${zoneId} does not exist in database`);
    }

    const lat = zone.location?.coordinates ? zone.location.coordinates[1] : zone.latitude;
    const lon = zone.location?.coordinates ? zone.location.coordinates[0] : zone.longitude;
    const slope_deg = zone.terrain?.slope_deg ?? zone.slope_deg ?? 15.0;
    const distance_to_river_m = zone.terrain?.distance_to_river_m ?? zone.distance_to_river_m ?? 80.0;
    const elevation_m = zone.terrain?.elevation_m ?? zone.elevation_m ?? 1200.0;

    // 2. OpenWeather live atmospheric fetch with graceful fallback
    let liveWeather = {
      rainfall_mm: payload.rainfall_mm ?? 0.0,
      temperature_c: payload.temperature_c ?? 20.0,
      humidity_pct: payload.humidity_pct ?? 50.0
    };

    try {
      if (lat && lon) {
        const weatherData = await openWeatherService.getLiveWeather(lat, lon);
        if (weatherData) {
          liveWeather = {
            rainfall_mm: weatherData.rainfall_mm ?? liveWeather.rainfall_mm,
            temperature_c: weatherData.temperature_c ?? liveWeather.temperature_c,
            humidity_pct: weatherData.humidity_pct ?? liveWeather.humidity_pct
          };
        }
      }
    } catch (weatherErr) {
      logger.warn(`[DATA_INGESTION] OpenWeather fetch bypassed: ${weatherErr.message}. Using localized telemetry.`);
    }

    // Priority: If incoming telemetry explicitly specifies surge/test rainfall (> 0), use it; else fallback to live atmospheric
    const finalRainfall = (payload.rainfall_mm !== undefined && payload.rainfall_mm > 0)
      ? payload.rainfall_mm
      : (liveWeather.rainfall_mm || 0);

    const mergedReading = {
      sensorId: sensorId || `SENSOR-${zoneId}`,
      zoneId,
      rainfall_mm: Number(finalRainfall),
      temperature_c: Number(liveWeather.temperature_c),
      humidity_pct: Number(liveWeather.humidity_pct),
      water_level_m: Number(water_level_m),
      soil_moisture_pct: Number(soil_moisture_pct),
      water_level_rate_of_rise_m_h: Number(water_level_rate_of_rise_m_h),
      provenance: provenance || '[SIMULATED]',
      batteryPct: batteryPct !== undefined ? batteryPct : 100
    };

    // 3. ML Inference execution
    let predictionDoc = null;
    try {
      predictionDoc = await mlBridgeService.runInferenceForZone(zone, mergedReading);
    } catch (mlErr) {
      logger.error(`[DATA_INGESTION] ML Inference error: ${mlErr.message}`);
      // Graceful fallback prediction if Python service is busy
      predictionDoc = {
        ensembleProbability: Math.min(Math.max(mergedReading.water_level_m / 6.0, 0.1), 0.95),
        biLstmProbability: 0.5,
        xgboostProbability: 0.5
      };
    }

    // 4. Authoritative Multi-Factor Risk Evaluation (Awaited)
    let evaluatedRisk = null;
    try {
      evaluatedRisk = await riskEngine.evaluateRisk(zone, mergedReading, predictionDoc);
    } catch (riskErr) {
      logger.error(`[DATA_INGESTION] RiskEngine evaluation error: ${riskErr.message}`);
    }

    const computedScore = evaluatedRisk?.riskScore ?? Math.round(Number(predictionDoc?.ensembleProbability ?? 0.4) * 100);
    const computedTier = evaluatedRisk?.riskTier ?? (computedScore >= 70 ? 'HIGH' : computedScore >= 40 ? 'MODERATE' : 'LOW');

    // 5. Persist IoT Reading to MongoDB
    const now = new Date();
    const readingDoc = new IoTReading({
      ...mergedReading,
      recordedAt: now
    });
    await readingDoc.save();

    return {
      success: true,
      readingId: readingDoc._id,
      predictionId: predictionDoc?._id,
      assessmentId: evaluatedRisk?._id,
      riskScore: computedScore,
      riskTier: computedTier,
      data: {
        zoneId,
        metrics: mergedReading,
        riskScore: computedScore,
        riskTier: computedTier,
        evaluatedAt: now
      }
    };
  }
}

module.exports = new DataIngestionService();