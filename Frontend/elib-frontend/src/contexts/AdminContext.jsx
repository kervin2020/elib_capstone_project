import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// État initial
const initialState = {
  users: [],
  categories: [],
  stats: {
    totalUsers: 0,
    totalBooks: 0,
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0
  },
  isLoading: false,
  error: null
};

// Types d'actions
const ADMIN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_CATEGORIES_SUCCESS: 'FETCH_CATEGORIES_SUCCESS',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
  ADD_CATEGORY_SUCCESS: 'ADD_CATEGORY_SUCCESS',
  UPDATE_CATEGORY_SUCCESS: 'UPDATE_CATEGORY_SUCCESS',
  DELETE_CATEGORY_SUCCESS: 'DELETE_CATEGORY_SUCCESS',
  SET_STATS: 'SET_STATS'
};

// Reducer pour gérer l'état d'administration
const adminReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ADMIN_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ADMIN_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ADMIN_ACTIONS.FETCH_USERS_SUCCESS:
      return { ...state, users: action.payload, isLoading: false, error: null };
    case ADMIN_ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload, isLoading: false, error: null };
    case ADMIN_ACTIONS.UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map(user => user.id === action.payload.id ? action.payload : user),
        isLoading: false,
        error: null
      };
    case ADMIN_ACTIONS.DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        isLoading: false,
        error: null
      };
    case ADMIN_ACTIONS.ADD_CATEGORY_SUCCESS:
      return { ...state, categories: [...state.categories, action.payload], isLoading: false, error: null };
    case ADMIN_ACTIONS.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map(cat => cat.id === action.payload.id ? action.payload : cat),
        isLoading: false,
        error: null
      };
    case ADMIN_ACTIONS.DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
        isLoading: false,
        error: null
      };
    case ADMIN_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

// Création du contexte
const AdminContext = createContext();

// Provider du contexte d'administration
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Fonction pour récupérer tous les utilisateurs
  const fetchUsers = async () => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.get('/users');
      dispatch({ type: ADMIN_ACTIONS.FETCH_USERS_SUCCESS, payload: response.data.users });
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.response?.data?.msg || 'Erreur lors du chargement des utilisateurs' });
    }
  };

  // Fonction pour récupérer toutes les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      dispatch({ type: ADMIN_ACTIONS.FETCH_CATEGORIES_SUCCESS, payload: response.data.categories });
    } catch (error) {
      // Error loading categories
    }
  };

  // Fonction pour mettre à jour un utilisateur
  const updateUser = async (userId, userData) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.put(`/users/${userId}`, userData);
      dispatch({ type: ADMIN_ACTIONS.UPDATE_USER_SUCCESS, payload: response.data.user });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Erreur lors de la mise à jour de l\'utilisateur';
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction pour supprimer un utilisateur
  const deleteUser = async (userId) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      await axios.delete(`/users/${userId}`);
      dispatch({ type: ADMIN_ACTIONS.DELETE_USER_SUCCESS, payload: userId });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Erreur lors de la suppression de l\'utilisateur';
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction pour bannir/débannir un utilisateur
  const toggleUserBan = async (userId, isBanned) => {
    return updateUser(userId, { is_banned: isBanned });
  };

  // Fonction pour ajouter une catégorie
  const addCategory = async (categoryData) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.post('/categories', categoryData);
      dispatch({ type: ADMIN_ACTIONS.ADD_CATEGORY_SUCCESS, payload: response.data.category });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Erreur lors de l\'ajout de la catégorie';
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction pour mettre à jour une catégorie
  const updateCategory = async (categoryId, categoryData) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.put(`/categories/${categoryId}`, categoryData);
      dispatch({ type: ADMIN_ACTIONS.UPDATE_CATEGORY_SUCCESS, payload: response.data.category });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Erreur lors de la mise à jour de la catégorie';
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction pour supprimer une catégorie
  const deleteCategory = async (categoryId) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      await axios.delete(`/categories/${categoryId}`);
      dispatch({ type: ADMIN_ACTIONS.DELETE_CATEGORY_SUCCESS, payload: categoryId });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Erreur lors de la suppression de la catégorie';
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction pour récupérer les statistiques
  const fetchStats = async () => {
    try {
      // Fetch statistics from API
      // Calculate statistics from existing data
      const totalUsers = state.users.length;
      const totalBooks = 0;
      const totalLoans = 0;
      const activeLoans = 0;
      const overdueLoans = 0;

      dispatch({
        type: ADMIN_ACTIONS.SET_STATS,
        payload: {
          totalUsers,
          totalBooks,
          totalLoans,
          activeLoans,
          overdueLoans
        }
      });
    } catch (error) {
      // Error loading statistics
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchUsers,
    fetchCategories,
    updateUser,
    deleteUser,
    toggleUserBan,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchStats,
    clearError
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook pour utiliser le contexte d'administration
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;