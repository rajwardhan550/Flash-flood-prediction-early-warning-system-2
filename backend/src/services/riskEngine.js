const RiskAssessment = require('../models/RiskAssessment');
const cache = require('../config/redis');
const logger = require('../utils/logger');
const { RISK_TIERS, RISK_THRESHOLDS, REDIS_KEYS } = require('../utils/constants');

// Dynamic resolution to avoid circular dependencies
let alertService = null;
let socketHandler = null;

const getDependencies = () => {
  if (!alertService) {
    try {
      alertService = require('./alertService');
    } catch (err) {
      logger.warn('[RISK_ENGINE] alertService dependency deferred:', err.message);
    }
  }
  if (!socketHandler) {
    try {
      socketHandler = require('../websocket/socketHandler');
    } catch (err) {
      logger.warn('[RISK_ENGINE] socketHandler dependency deferred:', err.message);
    }
  }
};

class RiskEngine {
  /**
   * Resolves physical and administrative zone attributes whether at root or inside subdocuments
   */
  resolveZoneAttributes(zone) {
    const dangerWaterLevel = Number(
      zone.danger_water_level_m ??
      zone.thresholds?.danger_water_level_m ??
      zone.terrain?.danger_water_level_m ??
      zone.dangerWaterLevelM ??
      3.5
    );

    const warningWaterLevel = Number(
      zone.warning_water_level_m ??
      zone.thresholds?.warning_water_level_m ??
      zone.terrain?.warning_water_level_m ??
      zone.warningWaterLevelM ??
      2.5
    );

    const slopeDeg = Number(
      zone.slope_deg ??
      zone.terrain?.slope_deg ??
      zone.slopeDeg ??
      15.0
    );

    const distanceToRiver = Number(
      zone.distance_to_river_m ??
      zone.terrain?.distance_to_river_m ??
      zone.distanceToRiverM ??
      80.0
    );

    return {
      dangerWaterLevel,
      warningWaterLevel,
      slopeDeg,
      distanceToRiver
    };
  }

  /**
   * Identifies physical contributing factors behind elevated risk
   */
  evaluateDrivers(zone, telemetry, mlProb) {
    const drivers = [];
    const validMlProb = Number.isFinite(mlProb) ? Number(mlProb) : 0.0;
    const { dangerWaterLevel, warningWaterLevel, slopeDeg, distanceToRiver } = this.resolveZoneAttributes(zone);

    const rain = Number(telemetry.rainfall_mm ?? 0);
    const waterLevel = Number(telemetry.water_level_m ?? 0);
    const rateOfRise = Number(telemetry.water_level_rate_of_rise_m_h ?? 0);
    const soilMoisture = Number(telemetry.soil_moisture_pct ?? 0);

    if (validMlProb >= 0.70) {
      drivers.push('High predictive probability from Bi-LSTM/XGBoost ensemble');
    } else if (validMlProb >= 0.45) {
      drivers.push('Moderate predictive probability from ML model');
    }

    if (rain >= 65.0) {
      drivers.push(`Extreme localized rainfall (${rain} mm)`);
    } else if (rain >= 30.0) {
      drivers.push(`Heavy rainfall observed (${rain} mm)`);
    }

    if (waterLevel >= dangerWaterLevel) {
      drivers.push(`River water level exceeded danger mark (${waterLevel}m >= ${dangerWaterLevel}m)`);
    } else if (waterLevel >= warningWaterLevel) {
      drivers.push(`River water level exceeded warning threshold (${waterLevel}m)`);
    }

    if (rateOfRise >= 0.3) {
      drivers.push(`Rapid rate of water level rise (+${rateOfRise} m/h)`);
    }

    if (soilMoisture >= 80.0) {
      drivers.push(`Critical soil saturation (${soilMoisture}%) reducing infiltration`);
    }

    if (slopeDeg >= 25.0) {
      drivers.push(`Steep terrain slope (${slopeDeg}°) accelerating rapid runoff`);
    }

    if (distanceToRiver <= 100.0) {
      drivers.push(`High proximity to river channel (${distanceToRiver}m)`);
    }

    if (drivers.length === 0) {
      drivers.push('Baseline hydrological and meteorological conditions within safe margins');
    }

    return drivers;
  }

  /**
   * Computes authoritative multi-factor risk score (0-100) and risk tier
   */
  computeRiskScore(zone, telemetry, ensembleProb) {
    const { dangerWaterLevel, slopeDeg, distanceToRiver } = this.resolveZoneAttributes(zone);

    // 1. Model Contribution (50% weight)
    const prob = Number.isFinite(ensembleProb) ? Number(ensembleProb) : 0.0;
    const mlScore = Math.max(0, Math.min(prob * 100, 100));

    // 2. Hydrological Gauge Component (25% weight)
    const waterLevel = Number(telemetry.water_level_m ?? 0);
    const rateOfRise = Math.max(0, Number(telemetry.water_level_rate_of_rise_m_h ?? 0));
    const gaugeRatio = dangerWaterLevel > 0 ? (waterLevel / dangerWaterLevel) : 0.5;
    const hydroBase = Math.min(gaugeRatio * 100, 100);
    const riseBonus = Math.min(rateOfRise * 10, 20);
    const hydroScore = Math.min(hydroBase + riseBonus, 100);

    // 3. Precipitation & Saturation Component (15% weight)
    const rain = Number(telemetry.rainfall_mm ?? 0);
    const soil = Number(telemetry.soil_moisture_pct ?? 0);
    const rainScore = Math.min((rain / 65.0) * 100, 100);
    const soilScore = Math.min(soil, 100);
    const meteoScore = rainScore * 0.6 + soilScore * 0.4;

    // 4. Terrain Vulnerability Component (10% weight)
    const slopeScore = Math.min((slopeDeg / 35.0) * 100, 100);
    const proximityScore = Math.max(0, 100 - (distanceToRiver / 300.0) * 100);
    const terrainScore = slopeScore * 0.5 + proximityScore * 0.5;

    // Weighted aggregation
    let rawScore = (mlScore * 0.5) + (hydroScore * 0.25) + (meteoScore * 0.15) + (terrainScore * 0.1);

    // Ground Truth Priority: Sensor confirmation overrules ML delay
    if (waterLevel >= dangerWaterLevel && rain >= 65.0) {
      rawScore = Math.max(rawScore, 82.0);
    } else if (waterLevel >= dangerWaterLevel || rain >= 80.0) {
      rawScore = Math.max(rawScore, 72.0);
    }

    const finalScore = Number.isFinite(rawScore) ? Number(rawScore.toFixed(1)) : 25.0;

    // Classification mapped to system constants
    let riskTier = RISK_TIERS?.LOW || 'LOW';
    const extremeThreshold = RISK_THRESHOLDS?.EXTREME ?? 85;
    const highThreshold = RISK_THRESHOLDS?.HIGH ?? 70;
    const moderateThreshold = RISK_THRESHOLDS?.MODERATE ?? 40;

    if (finalScore >= extremeThreshold) {
      riskTier = RISK_TIERS?.EXTREME || 'EXTREME';
    } else if (finalScore >= highThreshold) {
      riskTier = RISK_TIERS?.HIGH || 'HIGH';
    } else if (finalScore >= moderateThreshold) {
      riskTier = RISK_TIERS?.MODERATE || 'MODERATE';
    }

    return { finalScore, riskTier };
  }

  /**
   * Evaluates and dispatches authoritative risk for a zone
   */
  async evaluateRisk(zone, latestReading, predictionDoc) {
    getDependencies();

    const ensProb = predictionDoc?.ensembleProbability ?? 0.0;
    const { finalScore, riskTier } = this.computeRiskScore(zone, latestReading, ensProb);
    const drivers = this.evaluateDrivers(zone, latestReading, ensProb);
    const safeProvenance = latestReading?.provenance || '[SIMULATED]';

    // 1. Persist authoritative Risk Assessment to MongoDB
    const assessment = await RiskAssessment.create({
      zoneId: zone.zoneId,
      name: zone.name,
      predictionId: predictionDoc?._id,
      riskScore: finalScore,
      riskTier,
      drivers,
      metricsSnapshot: {
        rainfall_mm: Number(latestReading.rainfall_mm ?? 0),
        water_level_m: Number(latestReading.water_level_m ?? 0),
        soil_moisture_pct: Number(latestReading.soil_moisture_pct ?? 0),
        rate_of_rise_m_h: Number(latestReading.water_level_rate_of_rise_m_h ?? 0),
        temperature_c: Number(latestReading.temperature_c ?? 20),
        humidity_pct: Number(latestReading.humidity_pct ?? 50)
      },
      provenance: {
        rainfall: safeProvenance,
        sensor: safeProvenance
      },
      evaluatedAt: new Date()
    });

    // 2. Cache latest zone risk in Redis (TTL: 10 minutes)
    const cachePayload = {
      assessmentId: assessment._id,
      zoneId: zone.zoneId,
      name: zone.name,
      riskScore: finalScore,
      riskTier,
      drivers,
      metrics: assessment.metricsSnapshot,
      prediction: {
        ensembleProbability: predictionDoc?.ensembleProbability,
        biLstmProbability: predictionDoc?.biLstmProbability,
        xgboostProbability: predictionDoc?.xgboostProbability
      },
      evaluatedAt: assessment.evaluatedAt
    };

    try {
      const redisKey = REDIS_KEYS?.ZONE_RISK ? REDIS_KEYS.ZONE_RISK(zone.zoneId) : `zone:risk:${zone.zoneId}`;
      if (cache && typeof cache.set === 'function') {
        if (typeof cache.status === 'undefined' || cache.status === 'ready') {
          await cache.set(redisKey, JSON.stringify(cachePayload), 'EX', 600);
        }
      }
    } catch (cacheErr) {
      logger.warn(`[RISK_ENGINE] Redis caching bypassed for ${zone.zoneId}: ${cacheErr.message}`);
    }

    logger.info(`Risk evaluated for ${zone.zoneId}: Score=${finalScore}, Tier=${riskTier}`, {
      subsystem: 'RISK_ENGINE',
      assessmentId: assessment._id
    });

    // 3. Broadcast to Real-Time WebSockets
    if (socketHandler && typeof socketHandler.broadcastRiskUpdate === 'function') {
      try {
        socketHandler.broadcastRiskUpdate(zone.zoneId, cachePayload);
      } catch (wsErr) {
        logger.warn(`[RISK_ENGINE] Socket emission failed for ${zone.zoneId}: ${wsErr.message}`);
      }
    }

    // 4. Trigger Alerts (HIGH or EXTREME) or Auto-Resolve on Safe normalization
    if (alertService) {
      try {
        if (riskTier === (RISK_TIERS?.HIGH || 'HIGH') || riskTier === (RISK_TIERS?.EXTREME || 'EXTREME')) {
          if (typeof alertService.triggerAlert === 'function') {
            await alertService.triggerAlert(zone, assessment);
          }
        } else if (riskTier === (RISK_TIERS?.LOW || 'LOW')) {
          if (typeof alertService.autoResolveAlerts === 'function') {
            await alertService.autoResolveAlerts(zone.zoneId);
          }
        }
      } catch (alertErr) {
        logger.warn(`[RISK_ENGINE] Alert dispatch failed for ${zone.zoneId}: ${alertErr.message}`);
      }
    }

    return assessment;
  }
}

module.exports = new RiskEngine();