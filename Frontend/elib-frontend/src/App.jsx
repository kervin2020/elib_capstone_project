import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BookProvider } from "./contexts/BookContext";
import { LoanProvider } from "./contexts/LoanContext";
import { AdminProvider } from "./contexts/AdminContext";
import { ToastProvider, useToast } from "./contexts/ToastContext";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ToastContainer from "./components/common/ToastContainer";

import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import LoansPage from "./pages/LoansPage";
import AdminPage from "./pages/AdminPage";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import BookDetailPage from "./pages/BookDetailPage";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
    }
    if (requireAdmin && !user?.is_admin) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const Layout = ({ children }) => {
    const location = window.location.pathname;
    const isHome = location === "/";

    const { toasts, removeToast } = useToast();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            {/* If on home page, remove container constraints */}
            <main className={`flex-1 ${isHome ? "p-0" : "container mx-auto p-6"}`}>
                {children}
            </main>
            <Footer />
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
};


const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/books" element={<Layout><BooksPage /></Layout>} />
            <Route path="/books/:id" element={<Layout><BookDetailPage /></Layout>} />
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/" replace />
                        : <AuthLayout><LoginForm /></AuthLayout>
                }
            />
            <Route
                path="/register"
                element={
                    isAuthenticated
                        ? <Navigate to="/" replace />
                        : <AuthLayout><RegisterForm /></AuthLayout>
                }
            />
            <Route
                path="/loans"
                element={
                    <ProtectedRoute>
                        <Layout><LoansPage /></Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminLayout>
                            <AdminPage />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
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
                                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
                            </AdminProvider>
                        </LoanProvider>
                    </BookProvider>
                </AuthProvider>
            </ToastProvider>
        </Router>
    );
}

export default App;
