import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  getUsers,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from '../api/userApi';
import {
  getCategories,
  createCategory,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
} from '../api/categoryApi';

const initialState = {
  users: [],
  categories: [],
  stats: {
    totalUsers: 0,
    totalBooks: 0,
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0,
  },
  isLoading: false,
  error: null,
};

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
  SET_STATS: 'SET_STATS',
};

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
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
        isLoading: false,
        error: null,
      };
    case ADMIN_ACTIONS.DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        isLoading: false,
        error: null,
      };
    case ADMIN_ACTIONS.ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        isLoading: false,
        error: null,
      };
    case ADMIN_ACTIONS.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
        isLoading: false,
        error: null,
      };
    case ADMIN_ACTIONS.DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        isLoading: false,
        error: null,
      };
    case ADMIN_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const fetchUsers = useCallback(async () => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await getUsers();
      dispatch({
        type: ADMIN_ACTIONS.FETCH_USERS_SUCCESS,
        payload: response.data.users || response.data,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_ACTIONS.SET_ERROR,
        payload:
          error.response?.data?.msg ||
          'Erreur lors du chargement des utilisateurs',
      });
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await getCategories();
      dispatch({
        type: ADMIN_ACTIONS.FETCH_CATEGORIES_SUCCESS,
        payload: response.data.categories || response.data,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_ACTIONS.SET_ERROR,
        payload:
          error.response?.data?.msg ||
          'Erreur lors du chargement des catégories',
      });
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await updateUserApi(userId, userData);
      dispatch({
        type: ADMIN_ACTIONS.UPDATE_USER_SUCCESS,
        payload: response.data.user || response.data,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        "Erreur lors de la mise à jour de l'utilisateur";
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      await deleteUserApi(userId);
      dispatch({ type: ADMIN_ACTIONS.DELETE_USER_SUCCESS, payload: userId });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        "Erreur lors de la suppression de l'utilisateur";
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const toggleUserBan = useCallback(
    async (userId, isBanned) => updateUser(userId, { is_banned: isBanned }),
    [updateUser]
  );

  const addCategory = useCallback(async (categoryData) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await createCategory(categoryData);
      dispatch({
        type: ADMIN_ACTIONS.ADD_CATEGORY_SUCCESS,
        payload: response.data.category || response.data,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        "Erreur lors de l'ajout de la catégorie";
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await updateCategoryApi(categoryId, categoryData);
      dispatch({
        type: ADMIN_ACTIONS.UPDATE_CATEGORY_SUCCESS,
        payload: response.data.category || response.data,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        "Erreur lors de la mise à jour de la catégorie";
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteCategory = useCallback(async (categoryId) => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      await deleteCategoryApi(categoryId);
      dispatch({
        type: ADMIN_ACTIONS.DELETE_CATEGORY_SUCCESS,
        payload: categoryId,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        "Erreur lors de la suppression de la catégorie";
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const fetchStats = useCallback(() => {
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
        overdueLoans,
      },
    });
  }, [state.users.length]);

  const clearError = useCallback(() => {
    dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
  }, []);

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
    clearError,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
