const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const cache = require('../config/redis');
const { REDIS_KEYS } = require('../utils/constants');
const { apiLimiter } = require('../middleware/rateLimiter');
const socketHandler = require('../websocket/socketHandler');
const logger = require('../utils/logger');

// 1. Get all currently active alerts (Cached)
router.get('/active', apiLimiter, async (req, res) => {
  try {
    const redisKey = REDIS_KEYS?.ACTIVE_ALERTS || 'alerts:active';
    let cachedAlerts = null;

    try {
      cachedAlerts = await cache.get(redisKey);
    } catch (_) {}

    if (cachedAlerts) {
      return res.json({
        success: true,
        source: 'REDIS',
        count: cachedAlerts.length,
        data: cachedAlerts
      });
    }

    const activeAlerts = await Alert.find({ status: 'ACTIVE' })
      .sort({ triggeredAt: -1 })
      .lean();

    try {
      await cache.set(redisKey, activeAlerts, 300);
    } catch (_) {}

    return res.json({
      success: true,
      source: 'MONGODB',
      count: activeAlerts.length,
      data: activeAlerts
    });
  } catch (err) {
    logger.error(`[ALERT_ROUTES] Failed to fetch active alerts: ${err.message}`);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get alert history with filtering and pagination
router.get('/history', apiLimiter, async (req, res) => {
  try {
    const { zoneId, severity, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (zoneId) query.zoneId = zoneId;
    if (severity) query.severity = severity;
    if (status) query.status = status;

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const take = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [alerts, total] = await Promise.all([
      Alert.find(query)
        .sort({ triggeredAt: -1 })
        .skip(skip)
        .limit(take)
        .lean(),
      Alert.countDocuments(query)
    ]);

    return res.json({
      success: true,
      data: alerts,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / take),
        limit: take
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get alerts for a specific zone
router.get('/zone/:zoneId', apiLimiter, async (req, res) => {
  try {
    const { zoneId } = req.params;
    const alerts = await Alert.find({ zoneId })
      .sort({ triggeredAt: -1 })
      .limit(50)
      .lean();

    return res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Acknowledge an alert (Authority Action)
router.patch('/:id/acknowledge', apiLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    alert.status = 'ACKNOWLEDGED';
    await alert.save();

    // Invalidate/refresh active alerts cache
    try {
      const activeAlerts = await Alert.find({ status: 'ACTIVE' }).sort({ triggeredAt: -1 });
      const redisKey = REDIS_KEYS?.ACTIVE_ALERTS || 'alerts:active';
      await cache.set(redisKey, activeAlerts, 300);
    } catch (_) {}

    // Broadcast socket update
    try {
      if (socketHandler && typeof socketHandler.broadcastAlertAcknowledged === 'function') {
        socketHandler.broadcastAlertAcknowledged(alert);
      }
    } catch (_) {}

    return res.json({ success: true, message: 'Alert acknowledged successfully', data: alert });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;