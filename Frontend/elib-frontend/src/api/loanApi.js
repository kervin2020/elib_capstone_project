import apiClient from './apiClient';

export const getLoans = () => apiClient.get('/loans');
export const getLoanById = (id) => apiClient.get(`/loans/${id}`);
export const createLoan = (bookId) => apiClient.post('/loans', { ebook_id: bookId });
export const returnLoan = (loanId) => apiClient.put(`/loans/${loanId}`);
export const deleteLoan = (loanId) => apiClient.delete(`/loans/${loanId}`);
