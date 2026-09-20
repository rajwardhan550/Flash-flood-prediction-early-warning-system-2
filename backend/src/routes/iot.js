const express = require('express');
const router = express.Router();
const Joi = require('joi');
const dataIngestionService = require('../services/dataIngestionService');
const simulatorControlService = require('../services/simulatorControlService');
const { validate } = require('../middleware/validation');
const { ingestionLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const telemetrySchema = Joi.object({
  sensorId: Joi.string().required(),
  zoneId: Joi.string().required(),
  rainfall_mm: Joi.number().min(0).max(500).required(),
  water_level_m: Joi.number().min(0).max(30).required(),
  soil_moisture_pct: Joi.number().min(0).max(100).required(),
  temperature_c: Joi.number().optional().allow(null),
  humidity_pct: Joi.number().optional().allow(null),
  water_level_rate_of_rise_m_h: Joi.number().required(),
  provenance: Joi.string().valid('[LIVE]', '[SIMULATED]').default('[SIMULATED]'),
  batteryPct: Joi.number().min(0).max(100).default(100),
  recordedAt: Joi.date().iso().optional()
});

// Telemetry Ingestion endpoint
router.post('/telemetry', ingestionLimiter, validate(telemetrySchema), async (req, res) => {
  try {
    const result = await dataIngestionService.ingestReading(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Authority Control: Toggle IoT Simulator loop
router.post('/simulator/start', authenticate, authorize('authority', 'admin'), (req, res) => {
  simulatorControlService.start(req.body.intervalMs || 15000);
  res.json({ success: true, message: 'IoT Simulator loop initiated.' });
});

router.post('/simulator/stop', authenticate, authorize('authority', 'admin'), (req, res) => {
  simulatorControlService.stop();
  res.json({ success: true, message: 'IoT Simulator loop halted.' });
});

router.post('/simulator/surge', authenticate, authorize('authority', 'admin'), (req, res) => {
  const { zoneId } = req.body;
  const triggered = simulatorControlService.triggerSurge(zoneId);
  if (!triggered) {
    return res.status(404).json({ success: false, error: `Zone ${zoneId} not found in simulator registry.` });
  }
  res.json({ success: true, message: `Surge phase triggered for zone ${zoneId}.` });
});

router.get('/simulator/status', (req, res) => {
  res.json({ success: true, status: simulatorControlService.getStatus() });
});

module.exports = router;