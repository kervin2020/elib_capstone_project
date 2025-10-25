import React, { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, Clock, Download, Eye, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoans } from '../../contexts/LoanContext';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

const BookDetailModal = ({ isOpen, onClose, book, onLoan }) => {
  const { user, isAuthenticated } = useAuth();
  const { isBookLoanedByUser } = useLoans();
  const { success, error } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const isLoaned = book && isBookLoanedByUser(book.id, user?.id);

  const handleLoan = async () => {
    if (!isAuthenticated) {
      error('Please login to borrow books');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await onLoan(book.id);
      if (result.success) {
        success(`Successfully borrowed "${book.title}"`);
        onClose();
      } else {
        error(result.error || 'Failed to borrow book');
      }
    } catch (err) {
      error('An error occurred while borrowing the book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadOnline = () => {
    if (book.file_path) {
      // Ouvrir le fichier dans un nouvel onglet
      window.open(`/api/ebooks/${book.id}/read`, '_blank');
      success('Opening book for online reading');
    } else {
      error('This book is not available for online reading');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={book.title} size="large">
      <div className="space-y-6">
        {/* Book Info */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <div className="w-48 h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary-600" />
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <User className="h-4 w-4" />
                <span className="text-lg">{book.author}</span>
              </div>
            </div>

            {/* Categories */}
            {book.categories && book.categories.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {book.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Book Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Added {formatDate(book.uploaded_at)}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{book.available_copies} of {book.total_copies} available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Read Online Button */}
            {book.file_path && (
              <button
                onClick={handleReadOnline}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Read Online</span>
              </button>
            )}

            {/* Download Button */}
            {book.file_path && (
              <button
                onClick={() => {
                  window.open(`/api/ebooks/${book.id}/download`, '_blank');
                  success('Starting download...');
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            )}

            {/* Borrow Button */}
            {book.available_copies > 0 && !isLoaned && (
              <button
                onClick={handleLoan}
                disabled={isLoading || !isAuthenticated}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    <span>Borrow Physical Copy</span>
                  </>
                )}
              </button>
            )}

            {/* Already Borrowed */}
            {isLoaned && (
              <button
                disabled
                className="flex-1 px-4 py-3 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
              >
                Already Borrowed
              </button>
            )}

            {/* Not Available */}
            {book.available_copies === 0 && (
              <button
                disabled
                className="flex-1 px-4 py-3 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
              >
                Not Available
              </button>
            )}
          </div>
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              Please login to borrow books
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookDetailModal;