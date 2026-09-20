const express = require('express');
const router = express.Router();
const simulatorService = require('../services/simulatorControlService');
const alertService = require('../services/alertService');
const Zone = require('../models/Zone');
const { apiLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

// 1. Get Simulator Status
router.get('/simulator/status', apiLimiter, (req, res) => {
  try {
    const status = simulatorService.getStatus();
    return res.json({ success: true, data: status });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Start IoT Telemetry Simulator Loop
router.post('/simulator/start', apiLimiter, (req, res) => {
  try {
    const { intervalMs = 15000 } = req.body;
    simulatorService.start(intervalMs);
    logger.info('[AUTHORITY] Simulator loop started via API', { subsystem: 'AUTHORITY' });
    return res.json({
      success: true,
      message: `IoT Simulation loop started with interval ${intervalMs}ms`,
      data: simulatorService.getStatus()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Stop IoT Telemetry Simulator Loop
router.post('/simulator/stop', apiLimiter, (req, res) => {
  try {
    simulatorService.stop();
    logger.info('[AUTHORITY] Simulator loop stopped via API', { subsystem: 'AUTHORITY' });
    return res.json({
      success: true,
      message: 'IoT Simulation loop stopped',
      data: simulatorService.getStatus()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Trigger Instant High-Water Surge on a Specific Zone
router.post('/simulator/surge', apiLimiter, (req, res) => {
  try {
    const { zoneId } = req.body;
    if (!zoneId) {
      return res.status(400).json({ success: false, error: 'zoneId is required' });
    }

    const activated = simulatorService.triggerSurge(zoneId);
    if (!activated) {
      return res.status(404).json({ success: false, error: `Zone ${zoneId} not found in tracked simulation states` });
    }

    logger.warn(`[AUTHORITY] Manual flood surge triggered for zone: ${zoneId}`, { subsystem: 'AUTHORITY' });
    return res.json({
      success: true,
      message: `Surge progression activated for zone ${zoneId}`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Manual Emergency Siren Broadcast Trigger
router.post('/siren/trigger', apiLimiter, async (req, res) => {
  try {
    const { zoneId } = req.body;
    if (!zoneId) {
      return res.status(400).json({ success: false, error: 'zoneId is required' });
    }

    const zone = await Zone.findOne({ zoneId });
    if (!zone) {
      return res.status(404).json({ success: false, error: `Zone ${zoneId} not found` });
    }

    const manualAssessment = {
      _id: null,
      riskScore: 95,
      riskTier: 'EXTREME',
      drivers: ['Manual emergency siren protocol engaged by District Authority'],
      provenance: { sensor: '[LIVE]', rainfall: '[LIVE]' }
    };

    const alert = await alertService.triggerAlert(zone, manualAssessment);
    return res.json({
      success: true,
      message: `Emergency sirens and broadcast dispatched for ${zone.name}`,
      data: alert
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;