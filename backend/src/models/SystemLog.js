const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['INFO', 'WARN', 'ERROR', 'FATAL'],
      required: [true, 'Log severity level is required'],
      index: true,
    },
    subsystem: {
      type: String,
      enum: ['INGESTION', 'ML_BRIDGE', 'RISK_ENGINE', 'REDIS_SYNC', 'WEBSOCKET', 'AUTH', 'API'],
      required: [true, 'Target subsystem identifier is required'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Log event description is required'],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    timestamp: {
      type: Date,
      required: [true, 'Accurate event timestamp is required'],
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

systemLogSchema.index({ subsystem: 1, timestamp: -1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);