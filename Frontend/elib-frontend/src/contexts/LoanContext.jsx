import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getLoans as fetchAllLoans,
  getLoanById,
  createLoan as createNewLoan,
  returnLoan,
  deleteLoan as removeLoan
} from '../api/loanApi';

// État initial
const initialState = {
  loans: [],
  currentLoan: null,
  isLoading: false,
  error: null,
  stats: {
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0,
    returnedLoans: 0
  }
};

// Types d'actions
const LOAN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  FETCH_LOANS_SUCCESS: 'FETCH_LOANS_SUCCESS',
  FETCH_LOAN_SUCCESS: 'FETCH_LOAN_SUCCESS',
  CREATE_LOAN_SUCCESS: 'CREATE_LOAN_SUCCESS',
  UPDATE_LOAN_SUCCESS: 'UPDATE_LOAN_SUCCESS',
  DELETE_LOAN_SUCCESS: 'DELETE_LOAN_SUCCESS',
  SET_STATS: 'SET_STATS'
};

// Reducer pour gérer l'état
const loanReducer = (state, action) => {
  switch (action.type) {
    case LOAN_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case LOAN_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case LOAN_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case LOAN_ACTIONS.FETCH_LOANS_SUCCESS:
      return { ...state, loans: action.payload, isLoading: false, error: null };
    case LOAN_ACTIONS.FETCH_LOAN_SUCCESS:
      return { ...state, currentLoan: action.payload, isLoading: false, error: null };
    case LOAN_ACTIONS.CREATE_LOAN_SUCCESS:
      return { ...state, loans: [...state.loans, action.payload], isLoading: false };
    case LOAN_ACTIONS.UPDATE_LOAN_SUCCESS:
      return {
        ...state,
        loans: state.loans.map(l => (l.id === action.payload.id ? action.payload : l)),
        currentLoan: state.currentLoan?.id === action.payload.id ? action.payload : state.currentLoan,
        isLoading: false
      };
    case LOAN_ACTIONS.DELETE_LOAN_SUCCESS:
      return {
        ...state,
        loans: state.loans.filter(l => l.id !== action.payload),
        currentLoan: state.currentLoan?.id === action.payload ? null : state.currentLoan,
        isLoading: false
      };
    case LOAN_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

// Création du contexte
const LoanContext = createContext();

// Provider
export const LoanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loanReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Récupérer tous les emprunts
  const fetchLoans = useCallback(async () => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await fetchAllLoans();
      dispatch({ type: LOAN_ACTIONS.FETCH_LOANS_SUCCESS, payload: data.loans || data });
    } catch (error) {
      dispatch({
        type: LOAN_ACTIONS.SET_ERROR,
        payload: error.response?.data?.msg || 'Erreur lors du chargement des emprunts'
      });
    }
  }, []);

  // Récupérer un emprunt spécifique
  const fetchLoan = useCallback(async (loanId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await getLoanById(loanId);
      dispatch({ type: LOAN_ACTIONS.FETCH_LOAN_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: LOAN_ACTIONS.SET_ERROR,
        payload: error.response?.data?.msg || 'Erreur lors du chargement de l\'emprunt'
      });
    }
  }, []);

  // Créer un nouvel emprunt
  const createLoan = useCallback(async (bookId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await createNewLoan(bookId);
      dispatch({ type: LOAN_ACTIONS.CREATE_LOAN_SUCCESS, payload: data.loan || data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.msg || 'Erreur lors de la création de l\'emprunt';
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  }, []);

  // Retourner un livre
  const returnBook = useCallback(async (loanId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await returnLoan(loanId);
      dispatch({ type: LOAN_ACTIONS.UPDATE_LOAN_SUCCESS, payload: data.loan || data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.msg || 'Erreur lors du retour du livre';
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  }, []);

  // Supprimer un emprunt
  const deleteLoan = useCallback(async (loanId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      await removeLoan(loanId);
      dispatch({ type: LOAN_ACTIONS.DELETE_LOAN_SUCCESS, payload: loanId });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.msg || 'Erreur lors de la suppression de l\'emprunt';
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  }, []);

  // Effacer les erreurs
  const clearError = useCallback(() => {
    dispatch({ type: LOAN_ACTIONS.CLEAR_ERROR });
  }, []);

  // Méthodes utilitaires
  const getUserActiveLoans = useCallback(
    (userId) => state.loans.filter(l => l.user_id === userId && !l.is_returned),
    [state.loans]
  );

  const getUserLoanHistory = useCallback(
    (userId) => state.loans.filter(l => l.user_id === userId),
    [state.loans]
  );

  const getOverdueLoans = useCallback(() => {
    const now = new Date();
    return state.loans.filter(l => !l.is_returned && new Date(l.due_date) < now);
  }, [state.loans]);

  const isBookLoanedByUser = useCallback(
    (bookId, userId) => state.loans.some(l => l.ebook_id === bookId && l.user_id === userId && !l.is_returned),
    [state.loans]
  );

  const calculateStats = useCallback(() => {
    const totalLoans = state.loans.length;
    const activeLoans = state.loans.filter(l => !l.is_returned).length;
    const now = new Date();
    const overdueLoans = state.loans.filter(l => !l.is_returned && new Date(l.due_date) < now).length;
    const returnedLoans = state.loans.filter(l => l.is_returned).length;

    dispatch({
      type: LOAN_ACTIONS.SET_STATS,
      payload: { totalLoans, activeLoans, overdueLoans, returnedLoans }
    });
  }, [state.loans]);

  // Charger les emprunts après login
  useEffect(() => {
    if (isAuthenticated) fetchLoans();
  }, [isAuthenticated, fetchLoans]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const value = {
    ...state,
    fetchLoans,
    fetchLoan,
    createLoan,
    returnBook,
    deleteLoan,
    clearError,
    getUserActiveLoans,
    getUserLoanHistory,
    getOverdueLoans,
    isBookLoanedByUser
  };

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};

// Hook d'accès
export const useLoans = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return context;
};

export default LoanContext;
