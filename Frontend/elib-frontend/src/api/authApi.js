import apiClient from './apiClient';

export const login = (email, password) =>
    apiClient.post('/login', { email, password });

export const register = (userData) =>
    apiClient.post('/users', userData);

export const getCurrentUser = () =>
    apiClient.get('/users/me');
