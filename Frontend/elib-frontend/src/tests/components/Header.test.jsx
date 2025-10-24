import React from 'react';
 
import {
 render, screen, fireEvent 
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
 
import Header from '../../components/common/Header';
 
// Mock du contexte d'authentification 
const mockAuthContext = {
 user: null, isAuthenticated: false, logout: jest.fn()
 
}
;
 jest.mock('../../contexts/AuthContext', ()
 => ({
 useAuth: ()
 => mockAuthContext 
}
)
)
;
 
const TestWrapper = ({
 children 
}
)
 => ( <BrowserRouter> <AuthProvider> {
children
}
 </AuthProvider> </BrowserRouter> )
;
 describe('Header Component', ()
 => {
 beforeEach(()
 => {
 jest.clearAllMocks()
;
 
}
)
;
 test('renders logo and navigation', ()
 => {
 render( <TestWrapper> <Header /> </TestWrapper> )
;
 expect(screen.getByText('E-Lib')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Home')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Books')
)
.toBeInTheDocument()
;
 
}
)
;
 test('shows login and register buttons when not authenticated', ()
 => {
 render( <TestWrapper> <Header /> </TestWrapper> )
;
 expect(screen.getByText('Login')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Join Now')
)
.toBeInTheDocument()
;
 
}
)
;
 test('shows user menu when authenticated', ()
 => {
 mockAuthContext.user = {
 username: 'testuser', is_admin: false 
}
;
 mockAuthContext.isAuthenticated = true;
 render( <TestWrapper> <Header /> </TestWrapper> )
;
 expect(screen.getByText('testuser')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Logout')
)
.toBeInTheDocument()
;
 
}
)
;
 test('shows admin link for admin users', ()
 => {
 mockAuthContext.user = {
 username: 'admin', is_admin: true 
}
;
 mockAuthContext.isAuthenticated = true;
 render( <TestWrapper> <Header /> </TestWrapper> )
;
 expect(screen.getByText('Admin')
)
.toBeInTheDocument()
;
 
}
)
;
 test('handles search input', ()
 => {
 render( <TestWrapper> <Header /> </TestWrapper> )
;
 
const searchInput = screen.getByPlaceholderText('Search books...')
;
 expect(searchInput)
.toBeInTheDocument()
;
 fireEvent.change(searchInput, {
 target: {
 value: 'test search' 
}
 
}
)
;
 expect(searchInput.value)
.toBe('test search')
;
 
}
)
;
 test('handles logout', ()
 => {
 mockAuthContext.user = {
 username: 'testuser' 
}
;
 mockAuthContext.isAuthenticated = true;
 render( <TestWrapper> <Header /> </TestWrapper> )
;
 
const logoutButton = screen.getByText('Logout')
;
 fireEvent.click(logoutButton)
;
 expect(mockAuthContext.logout)
.toHaveBeenCalled()
;
 
}
)
;
 test('toggles mobile menu', ()
 => {
 render( <TestWrapper> <Header /> </TestWrapper> )
;
 
const menuButton = screen.getByRole('button', {
 name: /menu/i 
}
)
;
 fireEvent.click(menuButton)
;
 
// Vérifier que le menu mobile s'ouvre expect(screen.getByText('Home')
)
.toBeInTheDocument()
;
 
}
)
;
 
}
)
;
 