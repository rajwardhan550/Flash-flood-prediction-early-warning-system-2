import { apiClient } from './api';

export const weatherService = {
  getCurrentWeather: (lat, lon) => apiClient(`/weather/current?lat=${lat}&lon=${lon}`),
  
  getForecast: (lat, lon, days = 7) => apiClient(`/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`),
  
  getPrecipitationAccumulation: (zoneId) => apiClient(`/weather/precipitation/${zoneId}`)
};