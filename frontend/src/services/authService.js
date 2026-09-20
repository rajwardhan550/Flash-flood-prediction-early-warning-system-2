import { apiClient } from './api';

export const authService = {
  login: (credentials) => apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  logout: () => apiClient('/auth/logout', {
    method: 'POST'
  }),

  verifySession: () => apiClient('/auth/verify')
};