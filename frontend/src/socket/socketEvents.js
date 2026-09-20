export const SOCKET_EVENTS = {
  // Connection Lifecycle
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Real-time Telemetry & Risk Updates
  TELEMETRY_UPDATE: 'telemetry:update',
  RISK_TIER_CHANGED: 'risk:tier_changed',
  RIVER_LEVEL_WARNING: 'telemetry:river_warning',
  SOIL_SATURATION_ALERT: 'telemetry:soil_alert',

  // Alerts & Emergency Broadcasts
  NEW_ALERT: 'alert:new',
  BROADCAST_RECEIVED: 'alert:broadcast',
  ALERT_ACKNOWLEDGED: 'alert:acknowledged',

  // Sensor Hardware Status
  SENSOR_STATUS_CHANGED: 'sensor:status_changed',
  SENSOR_DIAGNOSTICS_RESULT: 'sensor:diagnostics_result',

  // Subscription Management (Joining/Leaving specific district rooms)
  SUBSCRIBE_ZONE: 'subscribe:zone',
  UNSUBSCRIBE_ZONE: 'unsubscribe:zone'
};