const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: [true, 'Prediction must be mapped to a specific zoneId'],
      ref: 'Zone',
      index: true,
    },
    biLstmProbability: {
      type: Number,
      min: 0.0,
      max: 1.0,
      required: [true, 'Bi-LSTM probability output is required from ML microservice'],
    },
    xgboostProbability: {
      type: Number,
      min: 0.0,
      max: 1.0,
      required: [true, 'XGBoost probability output is required from ML microservice'],
    },
    ensembleProbability: {
      type: Number,
      min: 0.0,
      max: 1.0,
      required: [true, 'Ensemble probability score is required'],
    },
    featureSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Snapshot of exact inference feature array or dictionary is required for reproducibility'],
    },
    inferenceLatencyMs: {
      type: Number,
      required: [true, 'Inference duration in milliseconds is required for telemetry profiling'],
    },
    modelVersion: {
      type: String,
      required: [true, 'Active model artifact identifier is required'],
    },
    generatedAt: {
      type: Date,
      required: [true, 'Timestamp of inference execution is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

predictionSchema.index({ zoneId: 1, generatedAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);