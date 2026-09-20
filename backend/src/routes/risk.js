const express = require('express');
const router = express.Router();
const cache = require('../config/redis');
const RiskAssessment = require('../models/RiskAssessment');
const Zone = require('../models/Zone');
const { REDIS_KEYS } = require('../utils/constants');
const { apiLimiter } = require('../middleware/rateLimiter');

// 1. Single Zone Latest Risk Assessment
router.get('/zones/:zoneId/latest', apiLimiter, async (req, res) => {
  const { zoneId } = req.params;

  try {
    // 1. Try Redis cache
    const cachedRisk = await cache.get(REDIS_KEYS.ZONE_RISK(zoneId));
    if (cachedRisk) {
      return res.json({ success: true, source: 'REDIS', data: cachedRisk });
    }

    // 2. Fallback to MongoDB
    const latestAssessment = await RiskAssessment.findOne({ zoneId })
      .sort({ evaluatedAt: -1 })
      .populate('predictionId');

    if (!latestAssessment) {
      return res.status(404).json({
        success: false,
        error: `No risk assessment record available for zone: ${zoneId}`
      });
    }

    const zone = await Zone.findOne({ zoneId });

    const payload = {
      assessmentId: latestAssessment._id,
      zoneId: latestAssessment.zoneId,
      name: zone ? zone.name : zoneId,
      riskScore: latestAssessment.riskScore,
      riskTier: latestAssessment.riskTier,
      drivers: latestAssessment.drivers,
      metrics: latestAssessment.metricsSnapshot,
      prediction: latestAssessment.predictionId,
      evaluatedAt: latestAssessment.evaluatedAt
    };

    // Repopulate cache
    await cache.set(REDIS_KEYS.ZONE_RISK(zoneId), payload, 300);

    return res.json({ success: true, source: 'MONGODB', data: payload });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Helper for bulk zones risk payload
const getAllZonesRiskHandler = async (req, res) => {
  try {
    // Query all zones gracefully without strict isActive filter
    const zones = await Zone.find({
      $or: [{ isActive: true }, { isActive: {$exists: false } }]
    }).lean();

    const results = await Promise.all(
      zones.map(async (zone) => {
        let risk = null;
        try {
          risk = await cache.get(REDIS_KEYS.ZONE_RISK(zone.zoneId));
        } catch (_) {}

        if (!risk) {
          risk = await RiskAssessment.findOne({ zoneId: zone.zoneId })
            .sort({ evaluatedAt: -1 })
            .lean();
        }

        const coords = zone.location?.coordinates || [zone.longitude || 0, zone.latitude || 0];

        return {
          zoneId: zone.zoneId,
          name: zone.name,
          category: zone.category || 'Panchayat',
          coordinates: coords,
          elevation_m: zone.terrain?.elevation_m ?? zone.elevation_m ?? 1200,
          slope_deg: zone.terrain?.slope_deg ?? zone.slope_deg ?? 15,
          danger_water_level_m: zone.danger_water_level_m ?? zone.terrain?.danger_water_level_m ?? 3.5,
          risk: risk || null
        };
      })
    );

    return res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Bulk endpoints (Both routes mapped for frontend flexibility)
router.get('/zones/latest', apiLimiter, getAllZonesRiskHandler);
router.get('/current-all', apiLimiter, getAllZonesRiskHandler);

module.exports = router;