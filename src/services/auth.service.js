import api from './axios';

export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
};

export const register = async (name, email, password, schoolId, accessCode) => {
    const { data } = await api.post('/auth/register', { name, email, password, schoolId, accessCode });
    return data.user;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getMe = async () => {
    const { data } = await api.get('/auth/me');
    return data;
};

export const getStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
};
