import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Calendar, Eye } from 'lucide-react';

const BookCard = ({ book, onLoan, isLoaned, showLoanButton = true }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const getAvailabilityStatus = () => {
    if (book.available_copies > 0) {
      return { text: 'Available', color: 'text-green-700 bg-green-100' };
    } else {
      return { text: 'Checked Out', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const status = getAvailabilityStatus();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col p-6 h-full group">
      {/* Book Cover */}
      <div className="w-28 h-36 mx-auto bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-5 flex items-center justify-center">
        <BookOpen className="h-10 w-10 text-primary-600 transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Book Info */}
      <div className="flex flex-col flex-grow space-y-3 text-center sm:text-left">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-900 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 text-sm">
          <User className="h-4 w-4 shrink-0" />
          <span>{book.author}</span>
        </div>

        {/* Categories */}
        {book.categories?.length > 0 && (
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
            {book.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="px-2.5 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full"
              >
                {category.name}
              </span>
            ))}
            {book.categories.length > 2 && (
              <span className="px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{book.categories.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {book.description && (
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Upload Date */}
        <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-500 text-xs pt-1">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>Added {formatDate(book.uploaded_at)}</span>
        </div>

        {/* Availability */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-xs">
          <div
            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-medium ${status.color}`}
          >
            {status.text}
          </div>
          <div className="text-gray-500 mt-1 sm:mt-0">
            {book.available_copies} / {book.total_copies} available
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to={`/books/${book.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-lg hover:bg-blue-900 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Link>

          {showLoanButton && book.available_copies > 0 && !isLoaned && (
            <button
              onClick={() => onLoan && onLoan(book.id)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Borrow
            </button>
          )}

          {isLoaned && (
            <button
              disabled
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
            >
              Borrowed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
