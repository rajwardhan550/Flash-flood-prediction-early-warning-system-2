module.exports = {
  PROVENANCE: {
    LIVE: '[LIVE]',
    SIMULATED: '[SIMULATED]',
    CACHED: '[CACHED]',
    HISTORICAL: '[HISTORICAL]',
    OFFLINE: '[OFFLINE]'
  },

  RISK_TIERS: {
    LOW: 'LOW',
    MODERATE: 'MODERATE',
    HIGH: 'HIGH',
    EXTREME: 'EXTREME'
  },

  RISK_THRESHOLDS: {
    MODERATE: 40.0,
    HIGH: 70.0,
    EXTREME: 85.0
  },

  ALERT_SEVERITIES: {
    WATCH: 'WATCH',
    WARNING: 'WARNING',
    CRITICAL_EVACUATION: 'CRITICAL_EVACUATION'
  },

  REDIS_KEYS: {
    ZONE_LATEST: (zoneId) => `zone:${zoneId}:latest`,
    ZONE_RISK: (zoneId) => `risk:${zoneId}:latest`,
    DASHBOARD_SUMMARY: 'dashboard:summary',
    ACTIVE_ALERTS: 'alerts:active'
  },

  SOCKET_EVENTS: {
    TELEMETRY_UPDATE: 'telemetry:update',
    RISK_UPDATE: 'risk:update',
    ALERT_TRIGGERED: 'alert:triggered',
    ALERT_RESOLVED: 'alert:resolved',
    SYSTEM_HEALTH: 'system:health'
  }
};