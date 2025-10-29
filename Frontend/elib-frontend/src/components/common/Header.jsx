import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, LogOut, Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">E-Lib</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/')
                                ? 'text-blue-600 bg-blue-50 font-semibold'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/books"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/books')
                                ? 'text-blue-600 bg-blue-50 font-semibold'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                }`}
                        >
                            Books
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/loans"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/loans')
                                    ? 'text-blue-600 bg-blue-50 font-semibold'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                    }`}
                            >
                                My Loans
                            </Link>
                        )}
                        {isAuthenticated && user?.is_admin && (
                            <Link
                                to="/admin"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/admin')
                                    ? 'text-blue-600 bg-blue-50 font-semibold'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                    }`}
                            >
                                Admin
                            </Link>
                        )}
                    </nav>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.username}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-all duration-200"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 transition-all duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all duration-200"
                                >
                                    Join Now
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden animate-slide-down">
                        <div className="px-4 pt-3 pb-4 bg-gray-50 rounded-lg mt-2 space-y-2 shadow-md">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/')
                                    ? 'text-blue-600 bg-blue-100'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/books"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/books')
                                    ? 'text-blue-600 bg-blue-100'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                    }`}
                            >
                                Books
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    to="/loans"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/loans')
                                        ? 'text-blue-600 bg-blue-100'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                        }`}
                                >
                                    My Loans
                                </Link>
                            )}
                            {isAuthenticated && user?.is_admin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/admin')
                                        ? 'text-blue-600 bg-blue-100'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
