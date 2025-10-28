import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BookOpen, Users, TrendingUp, Star, ArrowRight, Clock, Globe } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import { useLoans } from '../contexts/LoanContext';
import BookCard from '../components/common/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';


const HomePage = () => {
    const { books, fetchBooks, isLoading: booksLoading } = useBooks();
    const { stats, createLoan } = useLoans();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoaned, setIsLoaned] = useState(false);
    const { success, error } = useToast();
    // console.log(stats);
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Get featured books (first 6 books)
    const featuredBooks = books.slice(0, 6);
    const recommendedBooks = books.slice(6, 8);
    const navigate = useNavigate();
    const location = useLocation();


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

    // Mock user reviews
    const reviews = [
        {
            id: 1,
            name: 'Emma Johnson',
            rating: 5,
            comment: 'Amazing collection! I found so many great books here.',
            avatar: 'EJ'
        },
        {
            id: 2,
            name: 'Liam Smith',
            rating: 5,
            comment: 'The online reading experience is fantastic. Highly recommended!',
            avatar: 'LS'
        },
        {
            id: 3,
            name: 'Sophia Brown',
            rating: 4,
            comment: 'Great selection of both digital and physical books.',
            avatar: 'SB'
        },
        {
            id: 4,
            name: 'Michael Davis',
            rating: 5,
            comment: 'Easy to use and the staff is very helpful.',
            avatar: 'MD'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Welcome to <span className="text-accent-400">E-Lib</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto">
                            Read online or loan physical books easily. Your digital library for endless knowledge.
                        </p>

                        {/* Search Bar */}
                        <div className="flex justify-center mb-8">
                            <form onSubmit={handleSearch} className="w-full max-w-lg">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search books..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </form>
                        </div>


                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"'>

                                <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                                    Join Now
                                </Link>
                            </button>
                            <button className='bg-gray-300 hover:bg-blue-400 text-black hover:text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'>
                                <Link to="/books" className="btn-primary text-lg px-8 py-4">
                                    Browse Books
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Library Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <div className="bg-gray-50 rounded-xl p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Loans</h3>
                            {/* Simple bar chart representation */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">January</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                        <span className="text-sm font-medium">150</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">February</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                                        </div>
                                        <span className="text-sm font-medium">180</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">March</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                        <span className="text-sm font-medium">200</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 ">
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center transition-transform hover:scale-105">
                            <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">5,000</h3>
                            <p className="text-gray-600">Total Books</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center transition-transform hover:scale-105  ">
                            <Globe className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">2,000</h3>
                            <p className="text-gray-600">E-Books</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center transition-transform hover:scale-105">
                            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">1,500</h3>
                            <p className="text-gray-600">Registered Users</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Books Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Books</h2>
                        <p className="text-lg text-gray-600">List of all E-books and physical books in the library.</p>
                    </div>
                    {booksLoading ? (
                        <LoadingSpinner size="large" className="py-12" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredBooks.map((book) => (
                                <BookCard key={book.id} book={book} onLoan={handleLoan} isLoaned={isLoaned} setIsLoaned={setIsLoaned} />
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-8">
                        <Link to="/books" className="btn-primary inline-flex items-center space-x-2">
                            <span>View All Books</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recommended Reads Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Reads</h2>
                        <p className="text-lg text-gray-600">Handpicked books just for you.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recommendedBooks.map((book) => (
                            <div key={book.id} className="card p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                                            <BookOpen className="h-8 w-8 text-primary-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                                        <p className="text-gray-600 mb-3">{book.author}</p>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{book.description}</p>
                                        <Link to={`/books/${book.id}`} className="text-primary-900 hover:text-primary-800 font-medium">
                                            View More →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* User Reviews Section */}

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
                                {/* Avatar */}
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-lg font-semibold text-primary-900">
                                        {review.avatar}
                                    </span>
                                </div>

                                {/* User name */}
                                <h4 className="font-semibold text-gray-900 text-lg mb-2">{review.name}</h4>

                                {/* Stars */}
                                <div className="flex items-center justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < review.rating
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Comment */}
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