const mongoose = require('mongoose');

const weatherObservationSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: [true, 'Zone mapping is required for meteorological data'],
      ref: 'Zone',
      index: true,
    },
    source: {
      type: String,
      enum: ['Open-Meteo', 'IMD', 'NASA GPM'],
      required: [true, 'Meteorological data provider must be explicitly declared'],
    },
    temperature_c: {
      type: Number,
      required: [true, 'Ambient temperature reading is required'],
    },
    humidity_pct: {
      type: Number,
      required: [true, 'Relative humidity reading is required'],
    },
    rain_mm: {
      type: Number,
      required: [true, 'Rainfall reading from weather station is required'],
    },
    wind_speed_kmh: {
      type: Number,
      required: [true, 'Wind speed measurement is required'],
    },
    wind_direction_deg: {
      type: Number,
      required: [true, 'Wind direction azimuth is required'],
    },
    provenance: {
      type: String,
      enum: ['[LIVE]', '[SIMULATED]', '[CACHED]', '[HISTORICAL]', '[OFFLINE]'],
      required: [true, 'Data provenance tag is required'],
    },
    observedAt: {
      type: Date,
      required: [true, 'Timestamp of observation is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

weatherObservationSchema.index({ zoneId: 1, observedAt: -1 });

module.exports = mongoose.model('WeatherObservation', weatherObservationSchema);