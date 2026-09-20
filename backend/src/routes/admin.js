const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const IoTSensorReading = require('../models/IoTSensorReading');
const RiskAssessment = require('../models/RiskAssessment');
const Zone = require('../models/Zone');
const cache = require('../config/redis');
const { apiLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

// 1. Get database collection counts & telemetry stats
router.get('/stats', apiLimiter, async (req, res) => {
  try {
    const [totalZones, activeAlerts, totalReadings, totalAssessments] = await Promise.all([
      Zone.countDocuments(),
      Alert.countDocuments({ status: 'ACTIVE' }),
      IoTSensorReading.countDocuments(),
      RiskAssessment.countDocuments()
    ]);

    return res.json({
      success: true,
      data: {
        totalZones,
        activeAlerts,
        totalTelemetryReadings: totalReadings,
        totalRiskAssessments: totalAssessments,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Flush simulation readings and reset active test alerts
router.post('/reset-simulation', apiLimiter, async (req, res) => {
  try {
    const deletedReadings = await IoTSensorReading.deleteMany({
      provenance: '[SIMULATED]'
    });

    const resolvedAlerts = await Alert.updateMany(
      { status: 'ACTIVE', 'provenance.sensor': '[SIMULATED]' },
      { $set: { status: 'RESOLVED', resolvedAt: new Date() } }
    );

    // Clear active alert cache
    try {
      await cache.del('alerts:active');
    } catch (_) {}

    logger.warn('[ADMIN] Simulation data reset performed', { subsystem: 'ADMIN' });

    return res.json({
      success: true,
      message: 'Simulation telemetry purged and active test alerts marked resolved',
      details: {
        deletedReadingsCount: deletedReadings.deletedCount,
        resolvedAlertsCount: resolvedAlerts.modifiedCount
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;