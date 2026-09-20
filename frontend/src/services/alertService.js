import { apiClient } from './api';

export const alertService = {
  getActiveAlerts: (locationId) => apiClient(`/alerts/location/${locationId}/active`),
  
  getAllAlerts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/alerts?${query}`);
  },

  acknowledgeAlert: (alertId, authorityId) => apiClient(`/alerts/${alertId}/acknowledge`, {
    method: 'POST',
    body: JSON.stringify({ authorityId, timestamp: new Date().toISOString() })
  }),

  issueBroadcast: (payload) => apiClient('/alerts/broadcast', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};