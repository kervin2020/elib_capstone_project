import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const initialState = {
  books: [],
  categories: [],
  currentBook: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  filters: {
    available: true,
    author: '',
    title: ''
  }
};

const BOOK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  FETCH_BOOKS_SUCCESS: 'FETCH_BOOKS_SUCCESS',
  FETCH_CATEGORIES_SUCCESS: 'FETCH_CATEGORIES_SUCCESS',
  FETCH_BOOK_SUCCESS: 'FETCH_BOOK_SUCCESS',
  ADD_BOOK_SUCCESS: 'ADD_BOOK_SUCCESS',
  UPDATE_BOOK_SUCCESS: 'UPDATE_BOOK_SUCCESS',
  DELETE_BOOK_SUCCESS: 'DELETE_BOOK_SUCCESS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS'
};

const bookReducer = (state, action) => {
  switch (action.type) {
    case BOOK_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case BOOK_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case BOOK_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case BOOK_ACTIONS.FETCH_BOOKS_SUCCESS:
      return { ...state, books: action.payload, isLoading: false, error: null };
    case BOOK_ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload, isLoading: false, error: null };
    case BOOK_ACTIONS.FETCH_BOOK_SUCCESS:
      return { ...state, currentBook: action.payload, isLoading: false, error: null };
    case BOOK_ACTIONS.ADD_BOOK_SUCCESS:
      return { ...state, books: [...state.books, action.payload], isLoading: false, error: null };
    case BOOK_ACTIONS.UPDATE_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books.map(b => b.id === action.payload.id ? action.payload : b),
        currentBook: state.currentBook?.id === action.payload.id ? action.payload : state.currentBook,
        isLoading: false,
        error: null
      };
    case BOOK_ACTIONS.DELETE_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books.filter(b => b.id !== action.payload),
        currentBook: state.currentBook?.id === action.payload ? null : state.currentBook,
        isLoading: false,
        error: null
      };
    case BOOK_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case BOOK_ACTIONS.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload };
    case BOOK_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case BOOK_ACTIONS.CLEAR_FILTERS:
      return { ...state, searchQuery: '', selectedCategory: null, filters: { available: true, author: '', title: '' } };
    default:
      return state;
  }
};

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  // --- Fetch functions wrapped in useCallback to stabilize references ---
  const fetchBooks = useCallback(async () => {
    dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await axios.get('/ebooks');
      dispatch({ type: BOOK_ACTIONS.FETCH_BOOKS_SUCCESS, payload: res.data.ebooks });
    } catch (err) {
      dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: err.response?.data?.msg || 'Erreur lors du chargement des livres' });
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('/categories');
      dispatch({ type: BOOK_ACTIONS.FETCH_CATEGORIES_SUCCESS, payload: res.data.categories });
    } catch (err) {
      // Error loading categories
    }
  }, []);

  const fetchBook = useCallback(async (bookId) => {
    dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await axios.get(`/ebooks/${bookId}`);
      dispatch({ type: BOOK_ACTIONS.FETCH_BOOK_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: err.response?.data?.msg || 'Erreur lors du chargement du livre' });
    }
  }, []);

  const addBook = useCallback(async (bookData) => {
    dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await axios.post('/ebooks', bookData);
      dispatch({ type: BOOK_ACTIONS.ADD_BOOK_SUCCESS, payload: res.data.ebook });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erreur lors de l\'ajout du livre';
      dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  const updateBook = useCallback(async (bookId, bookData) => {
    dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await axios.put(`/ebooks/${bookId}`, bookData);
      dispatch({ type: BOOK_ACTIONS.UPDATE_BOOK_SUCCESS, payload: res.data.ebook });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erreur lors de la mise à jour du livre';
      dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  const deleteBook = useCallback(async (bookId) => {
    dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true });
    try {
      await axios.delete(`/ebooks/${bookId}`);
      dispatch({ type: BOOK_ACTIONS.DELETE_BOOK_SUCCESS, payload: bookId });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erreur lors de la suppression du livre';
      dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  // --- Filters & search ---
  const searchBooks = useCallback(query => dispatch({ type: BOOK_ACTIONS.SET_SEARCH_QUERY, payload: query }), []);
  const filterByCategory = useCallback(catId => dispatch({ type: BOOK_ACTIONS.SET_SELECTED_CATEGORY, payload: catId }), []);
  const applyFilters = useCallback(filters => dispatch({ type: BOOK_ACTIONS.SET_FILTERS, payload: filters }), []);
  const clearFilters = useCallback(() => dispatch({ type: BOOK_ACTIONS.CLEAR_FILTERS }), []);
  const clearError = useCallback(() => dispatch({ type: BOOK_ACTIONS.CLEAR_ERROR }), []);

  // --- Get filtered books memoized ---
  const getFilteredBooks = useCallback(() => {
    let filtered = [...state.books];
    if (state.searchQuery) filtered = filtered.filter(b => b.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || b.author.toLowerCase().includes(state.searchQuery.toLowerCase()));
    if (state.selectedCategory) filtered = filtered.filter(b => b.categories?.some(c => c.id === state.selectedCategory));
    if (state.filters.available) filtered = filtered.filter(b => b.available_copies > 0);
    return filtered;
  }, [state.books, state.searchQuery, state.selectedCategory, state.filters.available]);

  // --- Load on mount only ---
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [fetchBooks, fetchCategories]);

  const value = {
    ...state,
    fetchBooks,
    fetchCategories,
    fetchBook,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
    filterByCategory,
    applyFilters,
    clearFilters,
    clearError,
    getFilteredBooks
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBooks must be used within a BookProvider');
  return context;
};

export default BookContext;