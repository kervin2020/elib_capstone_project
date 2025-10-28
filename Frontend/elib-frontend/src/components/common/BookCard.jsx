import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Calendar, Eye } from 'lucide-react';

const BookCard = ({ book, onLoan, isLoaned, showLoanButton = true }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvailabilityStatus = () => {
    if (book.available_copies > 0) {
      return {
        text: 'Available',
        color: 'text-green-600 bg-green-100',
        icon: '✓'
      };
    } else {
      return {
        text: 'Checked Out',
        color: 'text-gray-600 bg-gray-100',
        icon: '✗'
      };
    }
  };

  const status = getAvailabilityStatus();

  return (
    <div className="card p-6 group bg-white rounded-xl shadow-lg p-6 text-center">
      {/* Book Cover Placeholder */}
      <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
        <BookOpen className="h-12 w-12 text-primary-600" />
      </div>

      {/* Book Info */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-900 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center space-x-2 text-gray-600">
          <User className="h-4 w-4" />
          <span className="text-sm">{book.author}</span>
        </div>

        {/* Categories */}
        {book.categories && book.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
              >
                {category.name}
              </span>
            ))}
            {book.categories.length > 2 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{book.categories.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {book.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {book.description}
          </p>
        )}

        {/* Upload Date */}
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="h-4 w-4" />
          <span className="text-xs">Added {formatDate(book.uploaded_at)}</span>
        </div>

        {/* Availability Status */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <span>{status.icon}</span>
            <span>{status.text}</span>
          </div>
          <div className="text-xs text-gray-500">
            {book.available_copies} of {book.total_copies} available
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Link
            to={`/books/${book.id}`}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-primary-900 border border-primary-900 rounded-lg hover:bg-primary-900 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Link>
          {showLoanButton && book.available_copies > 0 && !isLoaned && (
            <button
              onClick={() => onLoan && onLoan(book.id)}
              className="flex-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Borrow
            </button>
          )}
          {isLoaned && (
            <button
              disabled
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
            >
              Already Borrowed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;