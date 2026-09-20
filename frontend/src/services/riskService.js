import { apiClient } from './api';

export const riskService = {
  getRiskProfile: (locationId) => apiClient(`/risk/profile/${locationId}`),
  
  getPriorityZones: () => apiClient('/risk/priority-zones'),
  
  updateRiskThresholds: (zoneId, thresholds) => apiClient(`/risk/thresholds/${zoneId}`, {
    method: 'PUT',
    body: JSON.stringify(thresholds)
  })
};