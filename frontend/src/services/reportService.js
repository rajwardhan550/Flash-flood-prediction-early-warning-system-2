import { apiClient } from './api';

export const reportService = {
  generateSitrep: (zoneId, dateRange) => apiClient('/reports/sitrep', {
    method: 'POST',
    body: JSON.stringify({ zoneId, dateRange })
  }),

  getSystemAuditLogs: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/reports/audit?${query}`);
  },

  downloadReportPdf: async (reportId) => {
    // Standard fetch is used here because downloading files requires handling Blob data
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/reports/download/${reportId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  }
};