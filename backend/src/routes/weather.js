const express = require('express');
const router = express.Router();
const WeatherObservation = require('../models/WeatherObservation');
const Zone = require('../models/Zone');
const cache = require('../config/redis');
const { apiLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

// 1. Get latest weather observation for a specific zone
router.get('/zone/:zoneId', apiLimiter, async (req, res) => {
  try {
    const { zoneId } = req.params;
    const cacheKey = `weather:zone:${zoneId}`;

    let cached = await cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'REDIS', data: cached });
    }

    const observation = await WeatherObservation.findOne({ zoneId })
      .sort({ recordedAt: -1 })
      .lean();

    if (!observation) {
      const zone = await Zone.findOne({ zoneId }).lean();
      if (!zone) {
        return res.status(404).json({ success: false, error: `Zone ${zoneId} not found` });
      }

      // Safe fallback default baseline if external sync is pending
      const fallback = {
        zoneId,
        temperature_c: 18.0,
        humidity_pct: 65,
        rainfall_1h_mm: 0.0,
        rainfall_24h_mm: 0.0,
        wind_speed_kmh: 12.0,
        condition: 'Clear',
        recordedAt: new Date()
      };
      return res.json({ success: true, source: 'FALLBACK', data: fallback });
    }

    await cache.set(cacheKey, observation, 600);
    return res.json({ success: true, source: 'MONGODB', data: observation });
  } catch (err) {
    logger.error(`[WEATHER ROUTE] Error fetching zone weather: ${err.message}`);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Weather history for trends & analytics
router.get('/zone/:zoneId/history', apiLimiter, async (req, res) => {
  try {
    const { zoneId } = req.params;
    const { limit = 24 } = req.query;

    const history = await WeatherObservation.find({ zoneId })
      .sort({ recordedAt: -1 })
      .limit(Math.min(100, parseInt(limit, 10)))
      .lean();

    return res.json({
      success: true,
      zoneId,
      count: history.length,
      data: history.reverse()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;