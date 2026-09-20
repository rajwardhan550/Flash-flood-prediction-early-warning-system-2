// Geographic center of Uttarakhand for map initializations
export const APP_CONFIG = {
  DEFAULT_COORDINATES: [30.4852, 79.6974], 
  DEFAULT_ZOOM: 9,
  REFRESH_INTERVAL_MS: 300000, // 5 minutes for polling fallback
};

export const ROLES = {
  ADMIN: 'admin',
  AUTHORITY: 'authority',
  CITIZEN: 'citizen',
};

export const RISK_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  SEVERE: 'Severe',
};

export const SENSOR_TYPES = {
  WATER_LEVEL: 'water_level',
  RAINFALL: 'rainfall',
  SOIL_MOISTURE: 'soil_moisture',
};