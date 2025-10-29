import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus, Grid, List, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BookContext';
import { useLoans } from '../contexts/LoanContext';
import { useToast } from '../contexts/ToastContext';
import BookCard from '../components/common/BookCard';
import BookDetailModal from '../components/books/BookDetailModal';
import AddBookModal from '../components/books/AddBookModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const {
    books,
    categories,
    searchQuery,
    selectedCategory,
    filters,
    isLoading,
    searchBooks,
    filterByCategory,
    applyFilters,
    clearFilters,
    getFilteredBooks,
    fetchBooks
  } = useBooks();
  const { createLoan, isBookLoanedByUser } = useLoans();
  const { success, error } = useToast();

  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) searchBooks(search);
  }, [searchParams, searchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    searchBooks(query);
    setSearchParams({ search: query });
  };

  const handleCategoryFilter = (categoryId) => filterByCategory(categoryId);
  const handleFilterChange = (newFilters) => applyFilters(newFilters);

  const handleLoan = async (bookId) => {
    if (!isAuthenticated) {
      error('Please login to borrow books');
      return;
    }

    try {
      const result = await createLoan(bookId);
      if (result.success) {
        success('Book borrowed successfully!');
        fetchBooks();
      } else {
        error(result.error || 'Failed to borrow book');
      }
    } catch (err) {
      error('An error occurred while borrowing the book');
    }
  };

  const handleViewBook = (book) => setSelectedBook(book);

  const filteredBooks = getFilteredBooks();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books</h1>
            <p className="text-gray-600 mt-2">Browse our collection of digital and physical books</p>
          </div>

          {user?.is_admin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-md border p-6 mb-8 transition-all duration-300">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search books by title, author, or description..."
                defaultValue={searchQuery}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
              />
            </div>
          </form>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-100 text-cyan-900' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-100 text-cyan-900' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <span className="text-sm text-gray-600">{filteredBooks.length} books found</span>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => handleCategoryFilter(e.target.value || null)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={filters.available ? 'available' : 'all'}
                  onChange={(e) => handleFilterChange({ available: e.target.value === 'available' })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="all">All Books</option>
                  <option value="available">Available Only</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Books Grid/List */}
        {isLoading ? (
          <LoadingSpinner size="large" className="py-12" />
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onLoan={handleLoan}
                isLoaned={isBookLoanedByUser(book.id, user?.id)}
                showLoanButton={true}
                onView={() => handleViewBook(book)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {selectedBook && (
          <BookDetailModal
            isOpen={!!selectedBook}
            onClose={() => setSelectedBook(null)}
            book={selectedBook}
            onLoan={handleLoan}
          />
        )}
        <AddBookModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
    </div>
  );
};

export default BooksPage;
