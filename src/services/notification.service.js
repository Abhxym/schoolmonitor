import api from './axios';

export const getNotifications = () => api.get('/notifications').then(r => r.data);
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`).then(r => r.data);
