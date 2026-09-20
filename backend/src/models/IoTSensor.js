const mongoose = require('mongoose');

const ioTSensorSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: [true, 'Physical or simulator hardware sensor identifier is required'],
      unique: true,
      trim: true,
      index: true,
    },
    zoneId: {
      type: String,
      required: [true, 'Sensor must map to an authoritative zoneId'],
      ref: 'Zone',
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    sensorType: {
      type: String,
      enum: ['water_level', 'rain_gauge', 'soil_moisture', 'multisensor'],
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Sensor installation coordinates are required'],
      },
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'degraded', 'maintenance'],
      required: true,
    },
    batteryPct: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    isSimulated: {
      type: Boolean,
      required: true,
    },
    lastReadingAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ioTSensorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('IoTSensor', ioTSensorSchema);