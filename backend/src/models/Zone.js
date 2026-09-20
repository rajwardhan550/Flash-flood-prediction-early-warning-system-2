const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: [true, 'zoneId is required from GIS/monitored station dataset'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Settlement or station name is required'],
      trim: true,
    },
    district: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['village', 'ward', 'gram_panchayat', 'hydrological_station'],
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
        required: [true, 'Exact geographic coordinates [lng, lat] are required'],
      },
    },
    elevation_m: {
      type: Number,
      required: [true, 'Real DEM elevation (m) is required'],
    },
    slope_deg: {
      type: Number,
      required: [true, 'Calculated slope (deg) is required from terrain raster'],
    },
    distance_to_river_m: {
      type: Number,
      required: [true, 'Calculated distance to river (m) is required from GIS'],
    },
    danger_water_level_m: {
      type: Number,
      required: [true, 'Authoritative CWC/local danger gauge mark is required'],
    },
    warning_water_level_m: {
      type: Number,
      required: [true, 'Authoritative CWC/local warning gauge mark is required'],
    },
    population: {
      type: Number,
      required: [true, 'Census or settlement population count is required'],
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

zoneSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Zone', zoneSchema);