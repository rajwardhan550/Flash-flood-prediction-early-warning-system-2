const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: [true, 'Alert requires an authoritative zoneId'],
      ref: 'Zone',
      index: true,
    },
    riskAssessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskAssessment',
      required: [true, 'Alert must link to the generating RiskAssessment'],
    },
    severity: {
      type: String,
      enum: ['WATCH', 'WARNING', 'CRITICAL_EVACUATION'],
      required: [true, 'Alert severity level is required'],
      index: true,
    },
    riskScore: {
      type: Number,
      required: [true, 'Authoritative risk score at alert issuance is required'],
    },
    title: {
      type: String,
      required: [true, 'Alert headline is required'],
    },
    message: {
      type: String,
      required: [true, 'Alert advisory content is required'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'CANCELLED'],
      required: [true, 'Operational alert state is required'],
      default: 'ACTIVE',
      index: true,
    },
    channels: [
      {
        channel: {
          type: String,
          enum: ['WEB_SOCKET', 'SMS', 'SIREN'],
          required: true,
        },
        provenance: {
          type: String,
          enum: ['[LIVE]', '[SIMULATED]'],
          required: true,
        },
        dispatchedAt: {
          type: Date,
          required: true,
        },
      },
    ],
    triggeredAt: {
      type: Date,
      required: [true, 'Timestamp of trigger is required'],
      index: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ zoneId: 1, status: 1 });
alertSchema.index({ triggeredAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);