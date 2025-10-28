// src/api/bookApi.js
import apiClient from './apiClient';

// EBOOKS endpoints
export const getBooks = () => apiClient.get('/ebooks');
export const getBookById = (id) => apiClient.get(`/ebooks/${id}`);
export const createBook = (data) => apiClient.post('/ebooks', data);
export const updateBook = (id, data) => apiClient.put(`/ebooks/${id}`, data);
export const deleteBook = (id) => apiClient.delete(`/ebooks/${id}`);

// CATEGORIES (optional)
export const getCategories = () => apiClient.get('/categories');
