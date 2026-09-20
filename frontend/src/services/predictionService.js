import { apiClient } from './api';

export const predictionService = {
  getLatestPredictions: (zoneId) => apiClient(`/predictions/zone/${zoneId}`),
  
  getModelMetrics: () => apiClient('/predictions/models/metrics'),

  triggerRetraining: (modelType) => apiClient(`/predictions/models/${modelType}/retrain`, {
    method: 'POST'
  })
};