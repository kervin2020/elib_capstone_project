// src/api/userApi.js
import apiClient from './apiClient';

export const getUsers = () => apiClient.get('/users');
export const getUserById = (id) => apiClient.get(`/users/${id}`);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);
export const createUser = (data) => apiClient.post('/users', data);
