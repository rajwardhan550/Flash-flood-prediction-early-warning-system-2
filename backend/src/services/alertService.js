const Alert = require('../models/Alert');
const cache = require('../config/redis');
const logger = require('../utils/logger');
const { ALERT_SEVERITIES, PROVENANCE, REDIS_KEYS } = require('../utils/constants');

let socketHandler = null;
const getSocketHandler = () => {
  if (!socketHandler) {
    try {
      socketHandler = require('../websocket/socketHandler');
    } catch (err) {
      logger.warn('[ALERT_SERVICE] socketHandler dependency deferred:', err.message);
    }
  }
};

class AlertService {
  /**
   * Issues warning or evacuation alert based on risk tier
   */
  async triggerAlert(zone, riskAssessment) {
    getSocketHandler();

    const isExtreme = riskAssessment.riskTier === 'EXTREME';
    const severity = isExtreme
      ? (ALERT_SEVERITIES?.CRITICAL_EVACUATION || 'CRITICAL_EVACUATION')
      : (ALERT_SEVERITIES?.WARNING || 'WARNING');

    const title = isExtreme
      ? `CRITICAL FLASH FLOOD WARNING: ${zone.name.toUpperCase()}`
      : `FLOOD ADVISORY WARNING: ${zone.name}`;

    const driversList = Array.isArray(riskAssessment.drivers) ? riskAssessment.drivers.join(', ') : 'Elevated hydrological markers';
    const message = isExtreme
      ? `Dangerous flood conditions imminent for ${zone.name}. Risk Score: ${riskAssessment.riskScore}/100. Primary triggers: ${driversList}. Evacuate riverbeds and low-lying zones immediately.`
      : `High flash flood risk detected for ${zone.name}. Risk Score: ${riskAssessment.riskScore}/100. Key drivers: ${driversList}. Stay alert and monitor instructions.`;

    // Check for an existing unacknowledged active alert to prevent spamming
    const existingAlert = await Alert.findOne({
      zoneId: zone.zoneId,
      status: 'ACTIVE',
      severity
    }).sort({ triggeredAt: -1 });

    if (existingAlert) {
      // Refresh score and drivers on existing alert
      existingAlert.riskScore = riskAssessment.riskScore;
      existingAlert.message = message;
      existingAlert.riskAssessmentId = riskAssessment._id;
      await existingAlert.save();
      return existingAlert;
    }

    const safeProvenance = (riskAssessment.provenance?.sensor === '[LIVE]' || riskAssessment.provenance?.rainfall === '[LIVE]')
      ? '[LIVE]'
      : '[SIMULATED]';

    const alertDoc = await Alert.create({
      zoneId: zone.zoneId,
      riskAssessmentId: riskAssessment._id,
      severity,
      riskScore: riskAssessment.riskScore,
      title,
      message,
      status: 'ACTIVE',
      channels: [
        {
          channel: 'WEB_SOCKET',
          provenance: safeProvenance,
          dispatchedAt: new Date()
        },
        {
          channel: 'SIREN',
          provenance: safeProvenance,
          dispatchedAt: new Date()
        }
      ],
      triggeredAt: new Date()
    });

    logger.warn(`ALERT ISSUED: ${title} | Severity: ${severity}`, {
      subsystem: 'RISK_ENGINE',
      zoneId: zone.zoneId,
      alertId: alertDoc._id
    });

    // Invalidate/refresh active alerts cache in Redis
    try {
      const activeAlerts = await Alert.find({ status: 'ACTIVE' }).sort({ triggeredAt: -1 }).limit(20);
      const redisKey = REDIS_KEYS?.ACTIVE_ALERTS || 'alerts:active';
      if (cache && typeof cache.set === 'function') {
        if (typeof cache.status === 'undefined' || cache.status === 'ready') {
          await cache.set(redisKey, JSON.stringify(activeAlerts), 'EX', 300);
        }
      }
    } catch (cacheErr) {
      logger.warn(`[ALERT_SERVICE] Redis cache sync failed: ${cacheErr.message}`);
    }

    // Broadcast over WebSocket
    if (socketHandler && typeof socketHandler.broadcastAlert === 'function') {
      try {
        socketHandler.broadcastAlert(alertDoc);
      } catch (wsErr) {
        logger.warn(`[ALERT_SERVICE] WebSocket broadcast failed: ${wsErr.message}`);
      }
    }

    return alertDoc;
  }

  /**
   * Resolves active alerts automatically when conditions normalize
   */
  async autoResolveAlerts(zoneId) {
    getSocketHandler();

    const activeAlerts = await Alert.find({ zoneId, status: 'ACTIVE' });
    if (activeAlerts.length === 0) return;

    for (const alert of activeAlerts) {
      alert.status = 'RESOLVED';
      alert.resolvedAt = new Date();
      await alert.save();

      logger.info(`ALERT AUTO-RESOLVED: ${alert.title}`, {
        subsystem: 'ALERT_SERVICE',
        zoneId,
        alertId: alert._id
      });

      if (socketHandler && typeof socketHandler.broadcastAlertResolved === 'function') {
        try {
          socketHandler.broadcastAlertResolved(alert);
        } catch (wsErr) {
          logger.warn(`[ALERT_SERVICE] WebSocket alert resolution failed: ${wsErr.message}`);
        }
      }
    }

    // Refresh active alerts cache in Redis
    try {
      const activeAlerts = await Alert.find({ status: 'ACTIVE' }).sort({ triggeredAt: -1 }).limit(20);
      const redisKey = REDIS_KEYS?.ACTIVE_ALERTS || 'alerts:active';
      if (cache && typeof cache.set === 'function') {
        if (typeof cache.status === 'undefined' || cache.status === 'ready') {
          await cache.set(redisKey, JSON.stringify(activeAlerts), 'EX', 300);
        }
      }
    } catch (cacheErr) {
      logger.warn(`[ALERT_SERVICE] Redis cache update failed: ${cacheErr.message}`);
    }
  }
}

module.exports = new AlertService();