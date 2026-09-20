/**
 * FloodAtlas Hydrological & Temporal Mathematical Utilities
 * Chamoli Flash Flood Early Warning System
 */

/**
 * Calculates cyclical temporal features for ML ensemble inference
 * Transforms calendar time into trigonometric waves (sin/cos) to capture daily and seasonal seasonality.
 * @param {Date|string|number} date
 * @returns {Object} Extracted cyclic features matching training feature matrix
 */
const getCyclicTimeFeatures = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1; // 1-12
  const day = d.getUTCDate();
  const hour = d.getUTCHours();

  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
  const isMonsoon = month >= 6 && month <= 9 ? 1 : 0;

  // 24-hour daily cycle
  const hourSin = Math.sin((2 * Math.PI * hour) / 24);
  const hourCos = Math.cos((2 * Math.PI * hour) / 24);

  // 12-month annual cycle
  const monthSin = Math.sin((2 * Math.PI * (month - 1)) / 12);
  const monthCos = Math.cos((2 * Math.PI * (month - 1)) / 12);

  return {
    year,
    month,
    day,
    hour,
    day_of_year: dayOfYear,
    is_monsoon: isMonsoon,
    hour_sin: Number(hourSin.toFixed(4)),
    hour_cos: Number(hourCos.toFixed(4)),
    month_sin: Number(monthSin.toFixed(4)),
    month_cos: Number(monthCos.toFixed(4)),
  };
};

/**
 * Computes rolling cumulative sum over a specific hour window from telemetry array
 * @param {Array} readings Array of IoT telemetry readings
 * @param {number} hours Time window in hours
 * @param {string} field Metric field name (e.g. 'rainfall_mm')
 * @returns {number}
 */
const computeRollingSum = (readings = [], hours = 1, field = 'rainfall_mm') => {
  if (!Array.isArray(readings) || readings.length === 0) return 0.0;
  const cutoff = Date.now() - hours * 3600 * 1000;
  const sum = readings
    .filter((r) => new Date(r.recordedAt).getTime() >= cutoff)
    .reduce((acc, r) => acc + (Number(r[field]) || 0), 0);
  return Number(sum.toFixed(2));
};

/**
 * Computes difference / rate of change against historical readings over delta hours
 * @param {number} currentVal Current sensor reading value
 * @param {Array} readings Historical telemetry records sorted descending by time
 * @param {number} hours Backward comparison window
 * @param {string} field Metric field name (e.g. 'water_level_m')
 * @returns {number}
 */
const computeRateOfChange = (currentVal = 0, readings = [], hours = 1, field = 'water_level_m') => {
  if (!Array.isArray(readings) || readings.length === 0) return 0.0;
  const targetTime = Date.now() - hours * 3600 * 1000;
  
  // Find reading nearest to the target timestamp window
  const pastReading = readings.find((r) => new Date(r.recordedAt).getTime() <= targetTime);
  if (!pastReading || pastReading[field] === undefined || pastReading[field] === null) {
    return 0.0;
  }
  return Number((Number(currentVal) - Number(pastReading[field])).toFixed(3));
};

/**
 * Haversine formula for calculating spherical distance between coordinates in kilometers
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in km
 */
const calculateHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (angle * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(3));
};

module.exports = {
  getCyclicTimeFeatures,
  computeCyclicTimeFeatures: getCyclicTimeFeatures,
  computeRollingSum,
  computeRateOfChange,
  calculateHaversineDistanceKm,
};