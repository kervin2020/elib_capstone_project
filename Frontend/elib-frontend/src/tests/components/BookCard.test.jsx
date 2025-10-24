import React from 'react';
 
import {
 render, screen, fireEvent 
}
 from '@testing-library/react';
 
import {
 BrowserRouter 
}
 from 'react-router-dom';
 
import BookCard from '../../components/common/BookCard';
 
const mockBook = {
 id: 1, title: 'Test Book', author: 'Test Author', description: 'A test book description', file_path: '/path/to/book.pdf', total_copies: 5, available_copies: 3, uploaded_at: '2024-01-01T00:00:00Z', categories: [ {
 id: 1, name: 'Fiction' 
}
, {
 id: 2, name: 'Science' 
}
 ] 
}
;
 
const TestWrapper = ({
 children 
}
)
 => ( <BrowserRouter> {
children
}
 </BrowserRouter> )
;
 describe('BookCard Component', ()
 => {
 
const mockOnLoan = jest.fn()
;
 
const mockOnView = jest.fn()
;
 beforeEach(()
 => {
 jest.clearAllMocks()
;
 
}
)
;
 test('renders book information correctly', ()
 => {
 render( <TestWrapper> <BookCard book={
mockBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 /> </TestWrapper> )
;
 expect(screen.getByText('Test Book')
)
.toBeInTheDocument()
;
 expect(screen.getByText('Test Author')
)
.toBeInTheDocument()
;
 expect(screen.getByText('A test book description')
)
.toBeInTheDocument()
;
 
}
)
;
 test('shows availability status', ()
 => {
 render( <TestWrapper> <BookCard book={
mockBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 /> </TestWrapper> )
;
 expect(screen.getByText('Available')
)
.toBeInTheDocument()
;
 expect(screen.getByText('3 of 5 available')
)
.toBeInTheDocument()
;
 
}
)
;
 test('shows unavailable status when no copies available', ()
 => {
 
const unavailableBook = {
 ...mockBook, available_copies: 0 
}
;
 render( <TestWrapper> <BookCard book={
unavailableBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 /> </TestWrapper> )
;
 expect(screen.getByText('Checked Out')
)
.toBeInTheDocument()
;
 
}
)
;
 test('displays categories', ()
 => {
 render( <TestWrapper> <BookCard book={
mockBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 /> </TestWrapper> )
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
 test('handles loan button click', ()
 => {
 render( <TestWrapper> <BookCard book={
mockBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 /> </TestWrapper> )
;
 
const borrowButton = screen.getByText('Borrow')
;
 fireEvent.click(borrowButton)
;
 expect(mockOnLoan)
.toHaveBeenCalledWith(1)
;
 
}
)
;
 test('shows already borrowed state', ()
 => {
 render( <TestWrapper> <BookCard book={
mockBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
true
}
 showLoanButton={
true
}
 /> </TestWrapper> )
;
 expect(screen.getByText('Already Borrowed')
)
.toBeInTheDocument()
;
 
}
)
;
 test('hides loan button when showLoanButton is false', ()
 => {
 render( <TestWrapper> <BookCard book={
mockBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
false
}
 /> </TestWrapper> )
;
 expect(screen.queryByText('Borrow')
)
.not.toBeInTheDocument()
;
 
}
)
;
 test('handles view details button', ()
 => {
 render( <TestWrapper> <BookCard book={
mockBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 onView={
mockOnView
}
 /> </TestWrapper> )
;
 
const viewButton = screen.getByText('View Details')
;
 fireEvent.click(viewButton)
;
 expect(mockOnView)
.toHaveBeenCalled()
;
 
}
)
;
 test('formats date correctly', ()
 => {
 render( <TestWrapper> <BookCard book={
mockBook
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 /> </TestWrapper> )
;
 expect(screen.getByText(/Added/)
)
.toBeInTheDocument()
;
 
}
)
;
 test('handles book without description', ()
 => {
 
const bookWithoutDescription = {
 ...mockBook, description: null 
}
;
 render( <TestWrapper> <BookCard book={
bookWithoutDescription
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 /> </TestWrapper> )
;
 expect(screen.getByText('Test Book')
)
.toBeInTheDocument()
;
 expect(screen.queryByText('A test book description')
)
.not.toBeInTheDocument()
;
 
}
)
;
 test('handles book without categories', ()
 => {
 
const bookWithoutCategories = {
 ...mockBook, categories: [] 
}
;
 render( <TestWrapper> <BookCard book={
bookWithoutCategories
}
 onLoan={
mockOnLoan
}
 isLoaned={
false
}
 showLoanButton={
true
}
 /> </TestWrapper> )
;
 expect(screen.getByText('Test Book')
)
.toBeInTheDocument()
;
 expect(screen.queryByText('Fiction')
)
.not.toBeInTheDocument()
;
 
}
)
;
 
}
)
;
 