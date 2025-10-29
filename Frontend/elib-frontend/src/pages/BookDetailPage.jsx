import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookDetailPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(
                    `https://capstone-backend-elib.onrender.com/api/ebooks/${id}`
                );
                setBook(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement du livre :', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (isLoading) return <LoadingSpinner size="large" />;

    if (!book)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Livre introuvable</h2>
                <Link
                    to="/books"
                    className="text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
                >
                    ← Retour à la bibliothèque
                </Link>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Back Link */}
                <div className="px-6 pt-6">
                    <Link
                        to="/books"
                        className="flex items-center text-cyan-700 hover:text-cyan-900 transition-colors font-medium"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Retour à la bibliothèque
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-8 px-6 py-8">
                    {/* Book Cover / Icon */}
                    <div className="md:w-1/3 flex justify-center">
                        <div className="w-44 h-64 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center shadow-md transition-transform transform hover:scale-105">
                            <BookOpen className="h-16 w-16 text-cyan-700" />
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="md:w-2/3 flex-1 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                            <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
                            <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium text-gray-800">Category:</span>{' '}
                                    {book.category?.name || 'Uncategorized'}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Availability:</span>{' '}
                                    {book.available ? 'Available' : 'Currently loaned'}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Format:</span>{' '}
                                    {book.is_ebook ? 'E-Book' : 'Physical copy'}
                                </div>
                            </div>
                        </div>

                        {/* Borrow Button */}
                        <div className="mt-6">
                            <button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1">
                                Borrow this book
                            </button>
                        </div>
                    </div>
                </div>

                {/* Optional: Similar Books / Recommendations */}
                {/* Could add a section here if needed */}
            </div>
        </div>
    );
};

export default BookDetailPage;
