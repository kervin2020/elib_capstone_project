import React from 'react';
 
import {
 renderHook, act 
}
 from '@testing-library/react';
 
import {
 AuthProvider, useAuth 
}
 from '../../contexts/AuthContext';
 
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
 describe('AuthContext', ()
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
 
const wrapper = ({
 children 
}
)
 => ( <AuthProvider>{
children
}
</AuthProvider> )
;
 test('provides initial state', ()
 => {
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 expect(result.current.user)
.toBeNull()
;
 expect(result.current.isAuthenticated)
.toBe(false)
;
 expect(result.current.isLoading)
.toBe(true)
;
 expect(result.current.error)
.toBeNull()
;
 
}
)
;
 test('handles successful login', async ()
 => {
 
const mockUser = {
 id: 1, username: 'testuser', email: 'test@example.com' 
}
;
 
const mockToken = 'mock-token';
 mockedAxios.post.mockResolvedValueOnce({
 data: {
 access_token: mockToken 
}
 
}
)
;
 mockedAxios.get.mockResolvedValueOnce({
 data: mockUser 
}
)
;
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 await act(async ()
 => {
 
const response = await result.current.login('test@example.com', 'password')
;
 expect(response.success)
.toBe(true)
;
 
}
)
;
 expect(localStorageMock.setItem)
.toHaveBeenCalledWith('token', mockToken)
;
 expect(result.current.isAuthenticated)
.toBe(true)
;
 expect(result.current.user)
.toEqual(mockUser)
;
 
}
)
;
 test('handles login failure', async ()
 => {
 mockedAxios.post.mockRejectedValueOnce({
 response: {
 data: {
 msg: 'Invalid credentials' 
}
 
}
 
}
)
;
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 await act(async ()
 => {
 
const response = await result.current.login('test@example.com', 'wrongpassword')
;
 expect(response.success)
.toBe(false)
;
 expect(response.error)
.toBe('Invalid credentials')
;
 
}
)
;
 expect(result.current.isAuthenticated)
.toBe(false)
;
 expect(result.current.error)
.toBe('Invalid credentials')
;
 
}
)
;
 test('handles successful registration', async ()
 => {
 
const mockUser = {
 id: 1, username: 'newuser', email: 'new@example.com' 
}
;
 
const mockToken = 'mock-token';
 mockedAxios.post .mockResolvedValueOnce({
 data: {
 user: mockUser 
}
 
}
)
 .mockResolvedValueOnce({
 data: {
 access_token: mockToken 
}
 
}
)
;
 mockedAxios.get.mockResolvedValueOnce({
 data: mockUser 
}
)
;
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 await act(async ()
 => {
 
const response = await result.current.register({
 username: 'newuser', email: 'new@example.com', password: 'password' 
}
)
;
 expect(response.success)
.toBe(true)
;
 
}
)
;
 expect(result.current.isAuthenticated)
.toBe(true)
;
 expect(result.current.user)
.toEqual(mockUser)
;
 
}
)
;
 test('handles registration failure', async ()
 => {
 mockedAxios.post.mockRejectedValueOnce({
 response: {
 data: {
 msg: 'Email already exists' 
}
 
}
 
}
)
;
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 await act(async ()
 => {
 
const response = await result.current.register({
 username: 'newuser', email: 'existing@example.com', password: 'password' 
}
)
;
 expect(response.success)
.toBe(false)
;
 expect(response.error)
.toBe('Email already exists')
;
 
}
)
;
 expect(result.current.isAuthenticated)
.toBe(false)
;
 expect(result.current.error)
.toBe('Email already exists')
;
 
}
)
;
 test('handles logout', ()
 => {
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 act(()
 => {
 result.current.logout()
;
 
}
)
;
 expect(localStorageMock.removeItem)
.toHaveBeenCalledWith('token')
;
 expect(result.current.isAuthenticated)
.toBe(false)
;
 expect(result.current.user)
.toBeNull()
;
 
}
)
;
 test('clears error', ()
 => {
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 
// Set an error first act(()
 => {
 result.current.error = 'Some error';
 
}
)
;
 act(()
 => {
 result.current.clearError()
;
 
}
)
;
 expect(result.current.error)
.toBeNull()
;
 
}
)
;
 test('checks admin status correctly', ()
 => {
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 
// Test with non-admin user act(()
 => {
 result.current.user = {
 is_admin: false 
}
;
 
}
)
;
 expect(result.current.isAdmin()
)
.toBe(false)
;
 
// Test with admin user act(()
 => {
 result.current.user = {
 is_admin: true 
}
;
 
}
)
;
 expect(result.current.isAdmin()
)
.toBe(true)
;
 
}
)
;
 test('handles token validation on mount', async ()
 => {
 
const mockToken = 'valid-token';
 
const mockUser = {
 id: 1, username: 'testuser' 
}
;
 localStorageMock.getItem.mockReturnValue(mockToken)
;
 mockedAxios.get.mockResolvedValueOnce({
 data: mockUser 
}
)
;
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 await act(async ()
 => {
 
// Wait for the useEffect to complete await new Promise(resolve => setTimeout(resolve, 0)
)
;
 
}
)
;
 expect(result.current.isAuthenticated)
.toBe(true)
;
 expect(result.current.user)
.toEqual(mockUser)
;
 
}
)
;
 test('handles invalid token on mount', async ()
 => {
 
const mockToken = 'invalid-token';
 localStorageMock.getItem.mockReturnValue(mockToken)
;
 mockedAxios.get.mockRejectedValueOnce(new Error('Invalid token')
)
;
 
const {
 result 
}
 = renderHook(()
 => useAuth()
, {
 wrapper 
}
)
;
 await act(async ()
 => {
 
// Wait for the useEffect to complete await new Promise(resolve => setTimeout(resolve, 0)
)
;
 
}
)
;
 expect(localStorageMock.removeItem)
.toHaveBeenCalledWith('token')
;
 expect(result.current.isAuthenticated)
.toBe(false)
;
 
}
)
;
 
}
)
;
 