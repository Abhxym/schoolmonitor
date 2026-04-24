import api from './axios';

export const getAttendance = (params) => api.get('/attendance', { params }).then(r => r.data);
export const submitAttendance = (data) => api.post('/attendance', data).then(r => r.data);
