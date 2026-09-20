import { apiClient } from './api';

export const sensorService = {
  getAllSensors: (zoneId) => apiClient(zoneId ? `/sensors?zoneId=${zoneId}` : '/sensors'),
  
  getSensorById: (id) => apiClient(`/sensors/${id}`),
  
  registerSensor: (sensorData) => apiClient('/sensors', {
    method: 'POST',
    body: JSON.stringify(sensorData)
  }),

  updateSensorStatus: (id, status) => apiClient(`/sensors/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  runDiagnostics: (id) => apiClient(`/sensors/${id}/diagnostics`, {
    method: 'POST'
  })
};