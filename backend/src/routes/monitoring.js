const express = require('express');
const router = express.Router();
const IoTSensorReading = require('../models/IoTSensorReading');
const RiskAssessment = require('../models/RiskAssessment');
const Zone = require('../models/Zone');
const cache = require('../config/redis');
const { apiLimiter } = require('../middleware/rateLimiter');

// 1. Get recent time-series telemetry for charts (Water Level, Rainfall, Moisture)
router.get('/zone/:zoneId/timeseries', apiLimiter, async (req, res) => {
  try {
    const { zoneId } = req.params;
    const { limit = 50, hours = 24 } = req.query;

    const since = new Date(Date.now() - parseInt(hours, 10) * 60 * 60 * 1000);

    const readings = await IoTSensorReading.find({
      zoneId,
      recordedAt: { $gte: since }
    })
      .sort({ recordedAt: -1 })
      .limit(Math.min(200, parseInt(limit, 10)))
      .lean();

    // Chronological order for frontend line charts
    const timeSeries = readings.reverse().map((r) => ({
      timestamp: r.recordedAt,
      water_level_m: r.water_level_m,
      rainfall_mm: r.rainfall_mm,
      soil_moisture_pct: r.soil_moisture_pct,
      water_level_rate_of_rise_m_h: r.water_level_rate_of_rise_m_h || 0,
      provenance: r.provenance
    }));

    return res.json({
      success: true,
      zoneId,
      count: timeSeries.length,
      data: timeSeries
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Zone latest operational summary
router.get('/zone/:zoneId/summary', apiLimiter, async (req, res) => {
  try {
    const { zoneId } = req.params;

    const [zone, latestReading, latestRisk] = await Promise.all([
      Zone.findOne({ zoneId }).lean(),
      IoTSensorReading.findOne({ zoneId }).sort({ recordedAt: -1 }).lean(),
      RiskAssessment.findOne({ zoneId }).sort({ evaluatedAt: -1 }).lean()
    ]);

    if (!zone) {
      return res.status(404).json({ success: false, error: `Zone ${zoneId} not found` });
    }

    return res.json({
      success: true,
      data: {
        zoneId: zone.zoneId,
        name: zone.name,
        category: zone.category,
        danger_water_level_m: zone.danger_water_level_m ?? zone.terrain?.danger_water_level_m ?? 3.5,
        elevation_m: zone.terrain?.elevation_m ?? zone.elevation_m ?? 1200,
        latestReading: latestReading || null,
        latestRisk: latestRisk || null
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. System-wide infrastructure health overview
router.get('/system-health', apiLimiter, async (req, res) => {
  try {
    const isRedisOnline = typeof cache.status === 'function'
      ? cache.status()
      : (typeof cache.isHealthy === 'function' ? cache.isHealthy() : false);

    const [zoneCount, recentReadingsCount] = await Promise.all([
      Zone.countDocuments(),
      IoTSensorReading.countDocuments({ recordedAt: { $gte: new Date(Date.now() - 3600 * 1000) } })
    ]);

    return res.json({
      success: true,
      data: {
        status: 'OPERATIONAL',
        redis: isRedisOnline ? 'HEALTHY' : 'DEGRADED',
        totalZones: zoneCount,
        readingsLastHour: recentReadingsCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;