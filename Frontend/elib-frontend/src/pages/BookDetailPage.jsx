import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookDetailPage = () => {
    const { id } = useParams(); // récupère l'ID du livre depuis l'URL
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

    if (isLoading) {
        return <LoadingSpinner size="large" />;
    }

    if (!book) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-gray-700">Livre introuvable</h2>
                <Link to="/books" className="text-primary-600 mt-4 block">
                    ← Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <Link
                    to="/books"
                    className="flex items-center text-primary-700 hover:text-primary-900 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Retour à la bibliothèque
                </Link>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image / icône du livre */}
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="w-40 h-56 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-primary-700" />
                        </div>
                    </div>

                    {/* Détails du livre */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                        <p className="text-lg text-gray-600 mb-4">by {book.author}</p>

                        <p className="text-gray-700 mb-6">{book.description}</p>

                        <div className="space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium text-gray-800">Category:</span>{' '}
                                {book.category?.name || 'Uncategorized'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-800">Availability:</span>{' '}
                                {book.available ? 'Available' : 'Currently loaned'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-800">Format:</span>{' '}
                                {book.is_ebook ? 'E-Book' : 'Physical copy'}
                            </p>
                        </div>

                        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md">
                            Borrow this book
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;
