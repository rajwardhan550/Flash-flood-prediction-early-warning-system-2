import { apiClient } from './api';

export const telemetryService = {
  getHistoricalData: (locationId, timeframe = '24h') => apiClient(`/telemetry/${locationId}?timeframe=${timeframe}`),
  
  getRiverHydrographs: (zoneId) => apiClient(`/telemetry/river/${zoneId}`),
  
  getSoilMoistureData: (zoneId) => apiClient(`/telemetry/soil/${zoneId}`)
};