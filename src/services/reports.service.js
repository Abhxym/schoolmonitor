import api from './axios';

export const getReports = (params) => api.get('/reports', { params }).then(r => r.data);
export const submitReport = (data) => api.post('/reports', data).then(r => r.data);
export const updateReportStatus = (id, status) => api.patch(`/reports/${id}/status`, { status }).then(r => r.data);
