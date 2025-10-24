import React from 'react';
 
import {
 render, screen, waitFor 
}
 from '@testing-library/react';
 
import {
 BrowserRouter 
}
 from 'react-router-dom';
 
import {
 AuthProvider 
}
 from '../contexts/AuthContext';
 
import {
 BookProvider 
}
 from '../contexts/BookContext';
 
import {
 LoanProvider 
}
 from '../contexts/LoanContext';
 
import {
 AdminProvider 
}
 from '../contexts/AdminContext';
 
import {
 ToastProvider 
}
 from '../contexts/ToastContext';
 
import App from '../App';
 
// Mock des modules jest.mock('axios')
;
 jest.mock('../contexts/AuthContext')
;
 jest.mock('../contexts/BookContext')
;
 jest.mock('../contexts/LoanContext')
;
 jest.mock('../contexts/AdminContext')
;
 jest.mock('../contexts/ToastContext')
;
 
// Wrapper pour les tests 
const TestWrapper = ({
 children 
}
)
 => ( <BrowserRouter> <ToastProvider> <AuthProvider> <BookProvider> <LoanProvider> <AdminProvider> {
children
}
 </AdminProvider> </LoanProvider> </BookProvider> </AuthProvider> </ToastProvider> </BrowserRouter> )
;
 describe('App Component', ()
 => {
 beforeEach(()
 => {
 
// Reset des mocks jest.clearAllMocks()
;
 
}
)
;
 test('renders without crashing', ()
 => {
 render( <TestWrapper> <App /> </TestWrapper> )
;
 
}
)
;
 test('renders home page by default', ()
 => {
 render( <TestWrapper> <App /> </TestWrapper> )
;
 
// Vérifier que la page d'accueil est rendue expect(screen.getByText(/Welcome to E-Lib/i)
)
.toBeInTheDocument()
;
 
}
)
;
 test('has proper routing structure', ()
 => {
 render( <TestWrapper> <App /> </TestWrapper> )
;
 
// Vérifier la présence des éléments de navigation expect(screen.getByText('E-Lib')
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
 
}
)
;
 