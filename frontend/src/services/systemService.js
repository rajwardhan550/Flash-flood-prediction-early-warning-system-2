import { apiClient } from './api';

export const systemService = {
  getHealthStatus: () => apiClient('/system/health'),
  
  getGlobalSettings: () => apiClient('/system/settings'),
  
  updateGlobalSettings: (settings) => apiClient('/system/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  }),
  
  getDataSources: () => apiClient('/system/data-sources')
};