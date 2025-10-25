import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

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

// Reducer pour gérer l'état des emprunts
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
      return { ...state, loans: [...state.loans, action.payload], isLoading: false, error: null };
    case LOAN_ACTIONS.UPDATE_LOAN_SUCCESS:
      return {
        ...state,
        loans: state.loans.map(loan => loan.id === action.payload.id ? action.payload : loan),
        currentLoan: state.currentLoan?.id === action.payload.id ? action.payload : state.currentLoan,
        isLoading: false,
        error: null
      };
    case LOAN_ACTIONS.DELETE_LOAN_SUCCESS:
      return {
        ...state,
        loans: state.loans.filter(loan => loan.id !== action.payload),
        currentLoan: state.currentLoan?.id === action.payload ? null : state.currentLoan,
        isLoading: false,
        error: null
      };
    case LOAN_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

// Création du contexte
const LoanContext = createContext();

// Provider du contexte des emprunts
export const LoanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  // Charger les emprunts au montage du composant
  useEffect(() => {
    fetchLoans();
  }, []);

  // Fonction pour récupérer tous les emprunts
  const fetchLoans = async () => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.get('/loans');
      dispatch({ type: LOAN_ACTIONS.FETCH_LOANS_SUCCESS, payload: response.data.loans });
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.response?.data?.msg || 'Erreur lors du chargement des emprunts' });
    }
  };

  // Fonction pour récupérer un emprunt spécifique
  const fetchLoan = async (loanId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.get(`/loans/${loanId}`);
      dispatch({ type: LOAN_ACTIONS.FETCH_LOAN_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.response?.data?.msg || 'Erreur lors du chargement de l\'emprunt' });
    }
  };

  // Fonction pour créer un emprunt
  const createLoan = async (ebookId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.post('/loans', { ebook_id: ebookId });
      dispatch({ type: LOAN_ACTIONS.CREATE_LOAN_SUCCESS, payload: response.data.loan });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Erreur lors de la création de l\'emprunt';
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction pour retourner un livre
  const returnBook = async (loanId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.put(`/loans/${loanId}`);
      dispatch({ type: LOAN_ACTIONS.UPDATE_LOAN_SUCCESS, payload: response.data.loan });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Erreur lors du retour du livre';
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction pour supprimer un emprunt (admin)
  const deleteLoan = async (loanId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    try {
      await axios.delete(`/loans/${loanId}`);
      dispatch({ type: LOAN_ACTIONS.DELETE_LOAN_SUCCESS, payload: loanId });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Erreur lors de la suppression de l\'emprunt';
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    dispatch({ type: LOAN_ACTIONS.CLEAR_ERROR });
  };

  // Fonction pour obtenir les emprunts actifs d'un utilisateur
  const getUserActiveLoans = (userId) => {
    return state.loans.filter(loan => loan.user_id === userId && !loan.is_returned);
  };

  // Fonction pour obtenir l'historique des emprunts d'un utilisateur
  const getUserLoanHistory = (userId) => {
    return state.loans.filter(loan => loan.user_id === userId);
  };

  // Fonction pour obtenir les emprunts en retard
  const getOverdueLoans = () => {
    const now = new Date();
    return state.loans.filter(loan => 
      !loan.is_returned && new Date(loan.due_date) < now
    );
  };

  // Fonction pour vérifier si un livre est emprunté par un utilisateur
  const isBookLoanedByUser = (bookId, userId) => {
    return state.loans.some(loan => 
      loan.ebook_id === bookId && loan.user_id === userId && !loan.is_returned
    );
  };

  // Calculer les statistiques
  const calculateStats = () => {
    const totalLoans = state.loans.length;
    const activeLoans = state.loans.filter(loan => !loan.is_returned).length;
    const overdueLoans = getOverdueLoans().length;
    const returnedLoans = state.loans.filter(loan => loan.is_returned).length;

    dispatch({
      type: LOAN_ACTIONS.SET_STATS,
      payload: {
        totalLoans,
        activeLoans,
        overdueLoans,
        returnedLoans
      }
    });
  };

  // Recalculer les stats quand les emprunts changent
  useEffect(() => {
    calculateStats();
  }, [state.loans]);

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

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
};

// Hook pour utiliser le contexte des emprunts
export const useLoans = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return context;
};

export default LoanContext;