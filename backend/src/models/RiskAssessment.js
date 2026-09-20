const mongoose = require('mongoose');

const riskAssessmentSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: [true, 'Risk assessment requires an authoritative zoneId'],
      ref: 'Zone',
      index: true,
    },
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediction',
      required: [true, 'Risk assessment must link directly to the underlying Prediction document'],
    },
    riskScore: {
      type: Number,
      min: 0.0,
      max: 100.0,
      required: [true, 'Consolidated risk score (0-100) must be computed by the Risk Engine'],
    },
    riskTier: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'EXTREME'],
      required: [true, 'Risk tier classification is required'],
      index: true,
    },
    drivers: {
      type: [String],
      required: [true, 'Identified risk drivers (e.g., rainfall rate, steep slope) must be listed by the engine'],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        'At least one explanatory driver must be identified by the Risk Engine',
      ],
    },
    metricsSnapshot: {
      rainfall_mm: { type: Number, required: true },
      water_level_m: { type: Number, required: true },
      soil_moisture_pct: { type: Number, required: true },
      rate_of_rise_m_h: { type: Number, required: true },
    },
    provenance: {
      rainfall: {
        type: String,
        enum: ['[LIVE]', '[SIMULATED]', '[CACHED]', '[HISTORICAL]', '[OFFLINE]'],
        required: true,
      },
      sensor: {
        type: String,
        enum: ['[LIVE]', '[SIMULATED]', '[CACHED]', '[HISTORICAL]', '[OFFLINE]'],
        required: true,
      },
    },
    evaluatedAt: {
      type: Date,
      required: [true, 'Evaluation timestamp is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

riskAssessmentSchema.index({ zoneId: 1, evaluatedAt: -1 });

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);