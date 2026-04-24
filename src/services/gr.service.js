import api from './axios';

export const getGRDocuments = () => api.get('/gr').then(r => r.data);

export const uploadGRDocument = (formData) =>
    api.post('/gr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);

export const deleteGRDocument = (id) => api.delete(`/gr/${id}`).then(r => r.data);
