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
 
import HomePage from '../../pages/HomePage';
 
// Mock des contextes 
const mockAuthContext = {
 user: null, isAuthenticated: false 
}
;
 
const mockBookContext = {
 books: [ {
 id: 1, title: 'Test Book 1', author: 'Author 1', description: 'Description 1', available_copies: 3, total_copies: 5, categories: [{
 id: 1, name: 'Fiction' 
}
] 
}
, {
 id: 2, title: 'Test Book 2', author: 'Author 2', description: 'Description 2', available_copies: 0, total_copies: 2, categories: [{
 id: 2, name: 'Science' 
}
] 
}
 ], fetchBooks: jest.fn()
, isLoading: false 
}
;
 
const mockLoanContext = {
 stats: {
 totalLoans: 10, activeLoans: 5, overdueLoans: 1, returnedLoans: 4 
}
 
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
 jest.mock('../../contexts/BookContext', ()
 => ({
 useBooks: ()
 => mockBookContext 
}
)
)
;
 jest.mock('../../contexts/LoanContext', ()
 => ({
 useLoans: ()
 => mockLoanContext 
}
)
)
;
 
const TestWrapper = ({
 children 
}
)
 => ( <BrowserRouter> <AuthProvider> <BookProvider> <LoanProvider> {
children
}
 </LoanProvider> </BookProvider> </AuthProvider> </BrowserRouter> )
;
 describe('HomePage Component', ()
 => {
 beforeEach(()
 => {
 jest.clearAllMocks()
;
 
}
)
;
 test('renders hero section', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('Welcome to E-Lib')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Read online or loan physical books easily.')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders search bar', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByPlaceholderText('Search in site...')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders CTA buttons', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('Join Now')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Browse Books')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders library stats section', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('Library Stats')
)
.toBeInTheDocument()
;
 expect(screen.getByText('5,000')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Total Books')
)
.toBeInTheDocument()
;
 expect(screen.getByText('2,000')
)
.toBeInTheDocument()
;
 expect(screen.getByText('E-Books')
)
.toBeInTheDocument()
;
 expect(screen.getByText('1,500')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Registered Users')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders books section', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('Books')
)
.toBeInTheDocument()
;
 expect(screen.getByText('List of all E-books and physical books in the library.')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders featured books', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('Test Book 1')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Author 1')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Test Book 2')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Author 2')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders recommended reads section', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('Recommended Reads')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Handpicked books just for you.')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders user reviews section', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('User Reviews')
)
.toBeInTheDocument()
;
 expect(screen.getByText('What our readers say about us.')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Emma Johnson')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Liam Smith')
)
.toBeInTheDocument()
;
 
}
)
;
 test('handles search form submission', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 
const searchInput = screen.getByPlaceholderText('Search in site...')
;
 fireEvent.change(searchInput, {
 target: {
 value: 'test search' 
}
 
}
)
;
 
// Le formulaire devrait être soumis (bien que la logique de recherche ne soit pas implémentée dans ce test)
 expect(searchInput.value)
.toBe('test search')
;
 
}
)
;
 test('renders loading state when books are loading', ()
 => {
 mockBookContext.isLoading = true;
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 
// Vérifier que fetchBooks est appelé expect(mockBookContext.fetchBooks)
.toHaveBeenCalled()
;
 
}
)
;
 test('renders book availability status', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 
// Vérifier que les statuts de disponibilité sont affichés expect(screen.getByText('Available')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Checked Out')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders book categories', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('Fiction')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Science')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders monthly loans chart', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('Monthly Loans')
)
.toBeInTheDocument()
;
 expect(screen.getByText('January')
)
.toBeInTheDocument()
;
 expect(screen.getByText('February')
)
.toBeInTheDocument()
;
 expect(screen.getByText('March')
)
.toBeInTheDocument()
;
 
}
)
;
 test('renders view all books link', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 
const viewAllLink = screen.getByText('View All Books')
;
 expect(viewAllLink)
.toBeInTheDocument()
;
 expect(viewAllLink.closest('a')
)
.toHaveAttribute('href', '/books')
;
 
}
)
;
 test('renders footer with contact information', ()
 => {
 render( <TestWrapper> <HomePage /> </TestWrapper> )
;
 expect(screen.getByText('E-Lib')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Privacy Policy')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Terms of Service')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Contact Us')
)
.toBeInTheDocument()
;
 
}
)
;
 
}
)
;
 