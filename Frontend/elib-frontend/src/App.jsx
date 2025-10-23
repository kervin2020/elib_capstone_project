import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookProvider } from './contexts/BookContext';
import { LoanProvider } from './contexts/LoanContext';
import { AdminProvider } from './contexts/AdminContext';
import { ToastProvider } from './contexts/ToastContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ToastContainer from './components/common/ToastContainer';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import LoansPage from './pages/LoansPage';
import AdminPage from './pages/AdminPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !user?.is_admin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const { toasts, removeToast } = useToast();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      
      <Route path="/books" element={
        <Layout>
          <BooksPage />
        </Layout>
      } />
      
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      
      {/* Protected Routes */}
      <Route path="/loans" element={
        <ProtectedRoute>
          <Layout>
            <LoansPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout>
            <AdminPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <BookProvider>
            <LoanProvider>
              <AdminProvider>
                <AppRoutes />
              </AdminProvider>
            </LoanProvider>
          </BookProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
