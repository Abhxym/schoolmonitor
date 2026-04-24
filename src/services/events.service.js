import api from './axios';

export const getEvents = (params) => api.get('/events', { params }).then(r => r.data);
export const createEvent = (data) => api.post('/events', data).then(r => r.data);
export const updateEventStatus = (id, status) => api.patch(`/events/${id}/status`, { status }).then(r => r.data);
