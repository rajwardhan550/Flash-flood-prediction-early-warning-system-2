import { apiClient } from './api';

export const zoneService = {
  getAllZones: () => apiClient('/zones'),
  
  getZoneDetails: (id) => apiClient(`/zones/${id}`),
  
  createZone: (zoneData) => apiClient('/zones', {
    method: 'POST',
    body: JSON.stringify(zoneData)
  }),

  updateZone: (id, zoneData) => apiClient(`/zones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(zoneData)
  }),

  deleteZone: (id) => apiClient(`/zones/${id}`, {
    method: 'DELETE'
  })
};