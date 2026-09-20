const mongoose = require('mongoose');

const ioTSensorReadingSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: [true, 'Telemetry payload must include originating sensorId'],
      index: true,
    },
    zoneId: {
      type: String,
      required: [true, 'Telemetry payload must specify target zoneId'],
      index: true,
    },
    rainfall_mm: {
      type: Number,
      required: [true, 'Observed rainfall measurement (mm) is required from ingestion stream'],
    },
    water_level_m: {
      type: Number,
      required: [true, 'Observed river/channel water level (m) is required from gauge stream'],
    },
    soil_moisture_pct: {
      type: Number,
      required: [true, 'Observed soil moisture reading (%) is required from sensor/SMAP stream'],
    },
    temperature_c: {
      type: Number,
      default: null,
    },
    humidity_pct: {
      type: Number,
      default: null,
    },
    water_level_rate_of_rise_m_h: {
      type: Number,
      required: [true, 'Calculated or transmitted rate of rise (m/h) is required'],
    },
    provenance: {
      type: String,
      enum: ['[LIVE]', '[SIMULATED]', '[CACHED]', '[HISTORICAL]', '[OFFLINE]'],
      required: [true, 'Telemetry packet must tag explicit provenance ([LIVE] or [SIMULATED])'],
    },
    batteryPct: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      required: [true, 'Packet observation timestamp is required from the ingestion feed'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ioTSensorReadingSchema.index({ zoneId: 1, recordedAt: -1 });
ioTSensorReadingSchema.index({ sensorId: 1, recordedAt: -1 });

module.exports = mongoose.model('IoTSensorReading', ioTSensorReadingSchema);