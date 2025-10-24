import React from 'react';
 
import {
 render, screen, fireEvent, waitFor 
}
 from '@testing-library/react';
 
import {
 BrowserRouter 
}
 from 'react-router-dom';
 
import {
 AuthProvider 
}
 from '../../contexts/AuthContext';
 
import {
 BookProvider 
}
 from '../../contexts/BookContext';
 
import {
 LoanProvider 
}
 from '../../contexts/LoanContext';
 
import {
 AdminProvider 
}
 from '../../contexts/AdminContext';
 
import {
 ToastProvider 
}
 from '../../contexts/ToastContext';
 
import App from '../../App';
 
import axios from 'axios';
 
// Mock axios jest.mock('axios')
;
 
const mockedAxios = axios;
 
// Mock localStorage 
const localStorageMock = {
 getItem: jest.fn()
, setItem: jest.fn()
, removeItem: jest.fn()
, clear: jest.fn()
, 
}
;
 Object.defineProperty(window, 'localStorage', {
 value: localStorageMock 
}
)
;
 
const TestWrapper = ({
 children 
}
)
 => ( <BrowserRouter> <ToastProvider> <AuthProvider> <BookProvider> <LoanProvider> <AdminProvider> {
children
}
 </AdminProvider> </LoanProvider> </BookProvider> </AuthProvider> </ToastProvider> </BrowserRouter> )
;
 describe('User Flow Integration Tests', ()
 => {
 beforeEach(()
 => {
 jest.clearAllMocks()
;
 localStorageMock.getItem.mockReturnValue(null)
;
 
}
)
;
 test('complete user registration and login flow', async ()
 => {
 
// Mock successful registration mockedAxios.post .mockResolvedValueOnce({
 data: {
 user: {
 id: 1, username: 'newuser', email: 'new@example.com' 
}
 
}
 
}
)
 .mockResolvedValueOnce({
 data: {
 access_token: 'mock-token' 
}
 
}
)
;
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 id: 1, username: 'newuser', email: 'new@example.com' 
}
 
}
)
;
 render( <TestWrapper> <App /> </TestWrapper> )
;
 
// Navigate to register page fireEvent.click(screen.getByText('Join Now')
)
;
 await waitFor(()
 => {
 expect(screen.getByText('Create your account')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Fill registration form fireEvent.change(screen.getByPlaceholderText('Choose a username')
, {
 target: {
 value: 'newuser' 
}
 
}
)
;
 fireEvent.change(screen.getByPlaceholderText('Enter your email')
, {
 target: {
 value: 'new@example.com' 
}
 
}
)
;
 fireEvent.change(screen.getByPlaceholderText('Create a password')
, {
 target: {
 value: 'password123' 
}
 
}
)
;
 fireEvent.change(screen.getByPlaceholderText('Confirm your password')
, {
 target: {
 value: 'password123' 
}
 
}
)
;
 
// Submit form fireEvent.click(screen.getByText('Create account')
)
;
 await waitFor(()
 => {
 expect(mockedAxios.post)
.toHaveBeenCalledWith('/api/users', {
 username: 'newuser', email: 'new@example.com', password: 'password123' 
}
)
;
 
}
)
;
 
}
)
;
 test('user can browse books and view details', async ()
 => {
 
// Mock books data 
const mockBooks = [ {
 id: 1, title: 'Test Book', author: 'Test Author', description: 'Test description', available_copies: 3, total_copies: 5, categories: [{
 id: 1, name: 'Fiction' 
}
] 
}
 ];
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 ebooks: mockBooks 
}
 
}
)
;
 render( <TestWrapper> <App /> </TestWrapper> )
;
 
// Navigate to books page fireEvent.click(screen.getByText('Books')
)
;
 await waitFor(()
 => {
 expect(screen.getByText('Test Book')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Click on book to view details fireEvent.click(screen.getByText('View Details')
)
;
 await waitFor(()
 => {
 expect(screen.getByText('Test Book')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Test Author')
)
.toBeInTheDocument()
;
 
}
)
;
 
}
)
;
 test('user can search for books', async ()
 => {
 
const mockBooks = [ {
 id: 1, title: 'Search Result Book', author: 'Search Author', description: 'Search description', available_copies: 1, total_copies: 1, categories: [] 
}
 ];
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 ebooks: mockBooks 
}
 
}
)
;
 render( <TestWrapper> <App /> </TestWrapper> )
;
 
// Navigate to books page fireEvent.click(screen.getByText('Books')
)
;
 await waitFor(()
 => {
 expect(screen.getByText('Books')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Perform search 
const searchInput = screen.getByPlaceholderText('Search books by title, author, or description...')
;
 fireEvent.change(searchInput, {
 target: {
 value: 'search query' 
}
 
}
)
;
 fireEvent.submit(searchInput)
;
 await waitFor(()
 => {
 expect(screen.getByText('Search Result Book')
)
.toBeInTheDocument()
;
 
}
)
;
 
}
)
;
 test('user can borrow a book when authenticated', async ()
 => {
 
// Mock authentication localStorageMock.getItem.mockReturnValue('mock-token')
;
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 id: 1, username: 'testuser', is_admin: false 
}
 
}
)
;
 
const mockBooks = [ {
 id: 1, title: 'Borrowable Book', author: 'Borrow Author', description: 'Borrow description', available_copies: 1, total_copies: 1, categories: [] 
}
 ];
 mockedAxios.get .mockResolvedValueOnce({
 data: {
 ebooks: mockBooks 
}
 
}
)
 .mockResolvedValueOnce({
 data: {
 loans: [] 
}
 
}
)
;
 mockedAxios.post.mockResolvedValueOnce({
 data: {
 loan: {
 id: 1, ebook_id: 1, user_id: 1 
}
 
}
 
}
)
;
 render( <TestWrapper> <App /> </TestWrapper> )
;
 await waitFor(()
 => {
 expect(screen.getByText('testuser')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Navigate to books page fireEvent.click(screen.getByText('Books')
)
;
 await waitFor(()
 => {
 expect(screen.getByText('Borrowable Book')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Click borrow button fireEvent.click(screen.getByText('Borrow')
)
;
 await waitFor(()
 => {
 expect(mockedAxios.post)
.toHaveBeenCalledWith('/api/loans', {
 ebook_id: 1 
}
)
;
 
}
)
;
 
}
)
;
 test('user can view their loans', async ()
 => {
 
// Mock authentication localStorageMock.getItem.mockReturnValue('mock-token')
;
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 id: 1, username: 'testuser', is_admin: false 
}
 
}
)
;
 
const mockLoans = [ {
 id: 1, user_id: 1, ebook_id: 1, loan_date: '2024-01-01T00:00:00Z', due_date: '2024-01-15T00:00:00Z', is_returned: false, ebook: {
 title: 'Borrowed Book', author: 'Borrowed Author' 
}
 
}
 ];
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 loans: mockLoans 
}
 
}
)
;
 render( <TestWrapper> <App /> </TestWrapper> )
;
 await waitFor(()
 => {
 expect(screen.getByText('testuser')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Navigate to loans page fireEvent.click(screen.getByText('My Loans')
)
;
 await waitFor(()
 => {
 expect(screen.getByText('My Loans')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Borrowed Book')
)
.toBeInTheDocument()
;
 
}
)
;
 
}
)
;
 test('admin can access admin dashboard', async ()
 => {
 
// Mock admin authentication localStorageMock.getItem.mockReturnValue('mock-token')
;
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 id: 1, username: 'admin', is_admin: true 
}
 
}
)
;
 mockedAxios.get .mockResolvedValueOnce({
 data: {
 users: [] 
}
 
}
)
 .mockResolvedValueOnce({
 data: {
 categories: [] 
}
 
}
)
;
 render( <TestWrapper> <App /> </TestWrapper> )
;
 await waitFor(()
 => {
 expect(screen.getByText('admin')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Navigate to admin page fireEvent.click(screen.getByText('Admin')
)
;
 await waitFor(()
 => {
 expect(screen.getByText('Admin Dashboard')
)
.toBeInTheDocument()
;
 
}
)
;
 
}
)
;
 test('non-admin user cannot access admin dashboard', async ()
 => {
 
// Mock non-admin authentication localStorageMock.getItem.mockReturnValue('mock-token')
;
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 id: 1, username: 'user', is_admin: false 
}
 
}
)
;
 render( <TestWrapper> <App /> </TestWrapper> )
;
 await waitFor(()
 => {
 expect(screen.getByText('user')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Admin link should not be visible for non-admin users expect(screen.queryByText('Admin')
)
.not.toBeInTheDocument()
;
 
}
)
;
 test('user can return a book', async ()
 => {
 
// Mock authentication localStorageMock.getItem.mockReturnValue('mock-token')
;
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 id: 1, username: 'testuser', is_admin: false 
}
 
}
)
;
 
const mockLoans = [ {
 id: 1, user_id: 1, ebook_id: 1, loan_date: '2024-01-01T00:00:00Z', due_date: '2024-01-15T00:00:00Z', is_returned: false, ebook: {
 title: 'Borrowed Book', author: 'Borrowed Author' 
}
 
}
 ];
 mockedAxios.get.mockResolvedValueOnce({
 data: {
 loans: mockLoans 
}
 
}
)
;
 mockedAxios.put.mockResolvedValueOnce({
 data: {
 loan: {
 id: 1, is_returned: true 
}
 
}
 
}
)
;
 render( <TestWrapper> <App /> </TestWrapper> )
;
 await waitFor(()
 => {
 expect(screen.getByText('testuser')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Navigate to loans page fireEvent.click(screen.getByText('My Loans')
)
;
 await waitFor(()
 => {
 expect(screen.getByText('Borrowed Book')
)
.toBeInTheDocument()
;
 
}
)
;
 
// Click return button fireEvent.click(screen.getByText('Return')
)
;
 await waitFor(()
 => {
 expect(mockedAxios.put)
.toHaveBeenCalledWith('/api/loans/1')
;
 
}
)
;
 
}
)
;
 
}
)
;
 