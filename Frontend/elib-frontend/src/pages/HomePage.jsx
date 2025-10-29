import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Users, Globe, Star, ArrowRight } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import { useLoans } from '../contexts/LoanContext';
import BookCard from '../components/common/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

const HomePage = () => {
    const { books, fetchBooks, isLoading: booksLoading } = useBooks();
    const { createLoan } = useLoans();
    const [searchQuery, setSearchQuery] = useState('');
    const { success, error } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const featuredBooks = books.slice(0, 6);
    const recommendedBooks = books.slice(6, 8);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLoan = async (bookId) => {
        const result = await createLoan(bookId);
        if (result.success) {
            success('Book borrowed successfully!');
        } else {
            error(`Failed to borrow book: ${result.message}`);
        }
    };

    const reviews = [
        { id: 1, name: 'Emma Johnson', rating: 5, comment: 'Amazing collection!', avatar: 'EJ' },
        { id: 2, name: 'Liam Smith', rating: 5, comment: 'Fantastic online reading experience!', avatar: 'LS' },
        { id: 3, name: 'Sophia Brown', rating: 4, comment: 'Great selection of books.', avatar: 'SB' },
        { id: 4, name: 'Michael Davis', rating: 5, comment: 'Easy to use and helpful staff.', avatar: 'MD' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero Section */}
            <section className="relative w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white flex items-center justify-center overflow-hidden">
                {/* Decorative gradient circles */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-400 opacity-10 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-900 to-transparent"></div>
                </div>

                <div className="relative w-full px-6 sm:px-10 md:px-16 lg:px-24 text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Welcome to <span className="text-cyan-300">E-Lib</span>
                    </h1>

                    <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl sm:max-w-3xl">
                        Discover, read, and borrow from an ever-growing collection of books — your digital gateway to infinite knowledge.
                    </p>

                    {/* Search Bar */}
                    <div className="w-full max-w-lg mb-10">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Search books, authors, or topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-md"
                                />
                            </div>
                        </form>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link
                            to="/register"
                            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-lg px-8 py-3 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-cyan-500/50"
                        >
                            Join Now
                        </Link>
                        <Link
                            to="/books"
                            className="bg-white text-blue-900 font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-transform transform hover:-translate-y-1 hover:shadow-white/30"
                        >
                            Browse Books
                        </Link>
                    </div>
                </div>
            </section>

            {/* Library Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Library Stats</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Discover our extensive collection of digital and physical books, serving thousands of readers worldwide.
                            </p>
                            <Link to="/books" className="btn-primary">
                                View Details
                            </Link>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Loans</h3>
                            <div className="space-y-4">
                                {[
                                    { month: 'January', value: 75, count: 150 },
                                    { month: 'February', value: 90, count: 180 },
                                    { month: 'March', value: 100, count: 200 },
                                ].map((item) => (
                                    <div key={item.month} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{item.month}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full" style={{ width: `${item.value}%` }}></div>
                                            </div>
                                            <span className="text-sm font-medium">{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-center transition-transform hover:scale-105">
                            <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">5,000</h3>
                            <p className="text-gray-600">Total Books</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-center transition-transform hover:scale-105">
                            <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">2,000</h3>
                            <p className="text-gray-600">E-Books</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-center transition-transform hover:scale-105">
                            <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">1,500</h3>
                            <p className="text-gray-600">Registered Users</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Books Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Books</h2>
                        <p className="text-lg text-gray-600">List of all E-books and physical books in the library.</p>
                    </div>

                    {booksLoading ? (
                        <LoadingSpinner size="large" className="py-12" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredBooks.map((book) => (
                                <BookCard key={book.id} book={book} onLoan={handleLoan} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-8">
                        <Link
                            to="/books"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-5 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition-colors duration-200"
                        >
                            <span>View All Books</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                </div>
            </section>

            {/* Recommended Reads */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Reads</h2>
                        <p className="text-lg text-gray-600">Handpicked books just for you.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recommendedBooks.map((book) => (
                            <div key={book.id} className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-xl transition-transform hover:scale-105">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center shadow-inner">
                                            <BookOpen className="h-8 w-8 text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                                        <p className="text-gray-600 mb-3">{book.author}</p>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{book.description}</p>
                                        <Link to={`/books/${book.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                            View More →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* User Reviews */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Readers Say</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover what other readers think about our library and reading experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                    <span className="text-lg font-semibold text-blue-500">{review.avatar}</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 text-lg mb-2">{review.name}</h4>
                                <div className="flex items-center justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
