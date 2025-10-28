import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, LogOut, Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };



    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-primary-900" />
                        <span className="text-2xl font-bold text-primary-900">E-Lib</span>
                    </Link>

                    {/* Navigation Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                                ? 'text-primary-900 bg-primary-100'
                                : 'text-gray-700 hover:text-primary-900 hover:bg-gray-100'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/books"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/books')
                                ? 'text-primary-900 bg-primary-100'
                                : 'text-gray-700 hover:text-primary-900 hover:bg-gray-100'
                                }`}
                        >
                            Books
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/loans"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/loans')
                                    ? 'text-primary-900 bg-primary-100'
                                    : 'text-gray-700 hover:text-primary-900 hover:bg-gray-100'
                                    }`}
                            >
                                My Loans
                            </Link>
                        )}
                        {isAuthenticated && user?.is_admin && (
                            <Link
                                to="/admin"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin')
                                    ? 'text-primary-900 bg-primary-100'
                                    : 'text-gray-700 hover:text-primary-900 hover:bg-gray-100'
                                    }`}
                            >
                                Admin
                            </Link>
                        )}
                    </nav>



                    {/* User Menu */}
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
                                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-primary-900 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Join Now
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-900 hover:bg-gray-100"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
                            {/* Mobile Search
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search books..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </form> */}

                            {/* Mobile Navigation Links */}
                            <Link
                                to="/"
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/')
                                    ? 'text-primary-900 bg-primary-100'
                                    : 'text-gray-700 hover:text-primary-900 hover:bg-gray-100'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/books"
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/books')
                                    ? 'text-primary-900 bg-primary-100'
                                    : 'text-gray-700 hover:text-primary-900 hover:bg-gray-100'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Books
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    to="/loans"
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/loans')
                                        ? 'text-primary-900 bg-primary-100'
                                        : 'text-gray-700 hover:text-primary-900 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Loans
                                </Link>
                            )}
                            {isAuthenticated && user?.is_admin && (
                                <Link
                                    to="/admin"
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/admin')
                                        ? 'text-primary-900 bg-primary-100'
                                        : 'text-gray-700 hover:text-primary-900 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
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