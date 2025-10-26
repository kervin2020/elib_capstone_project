import React, { createContext, useContext, useReducer } from 'react';

// État initial
const initialState = {
    toasts: []
};

// Types d'actions
const TOAST_ACTIONS = {
    ADD_TOAST: 'ADD_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
    CLEAR_ALL: 'CLEAR_ALL'
};

// Reducer pour gérer l'état des toasts
const toastReducer = (state, action) => {
    switch (action.type) {
        case TOAST_ACTIONS.ADD_TOAST:
            return {
                ...state,
                toasts: [...state.toasts, action.payload]
            };
        case TOAST_ACTIONS.REMOVE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter(toast => toast.id !== action.payload)
            };
        case TOAST_ACTIONS.CLEAR_ALL:
            return {
                ...state,
                toasts: []
            };
        default:
            return state;
    }
};

// Création du contexte
const ToastContext = createContext();

// Provider du contexte des toasts
export const ToastProvider = ({ children }) => {
    const [state, dispatch] = useReducer(toastReducer, initialState);

    // Fonction pour ajouter un toast
    const addToast = (toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: 'info',
            duration: 5000,
            ...toast
        };
        dispatch({
            type: TOAST_ACTIONS.ADD_TOAST,
            payload: newToast
        });
        return id;
    };

    // Fonction pour supprimer un toast
    const removeToast = (id) => {
        dispatch({
            type: TOAST_ACTIONS.REMOVE_TOAST,
            payload: id
        });
    };

    // Fonction pour effacer tous les toasts
    const clearAll = () => {
        dispatch({
            type: TOAST_ACTIONS.CLEAR_ALL
        });
    };

    // Fonctions de convenance pour différents types de toasts
    const success = (message, title = 'Success', options = {}) => {
        return addToast({
            type: 'success',
            title,
            message,
            ...options
        });
    };

    const error = (message, title = 'Error', options = {}) => {
        return addToast({
            type: 'error',
            title,
            message,
            duration: 7000, // Plus long pour les erreurs
            ...options
        });
    };

    const warning = (message, title = 'Warning', options = {}) => {
        return addToast({
            type: 'warning',
            title,
            message,
            ...options
        });
    };

    const info = (message, title = 'Info', options = {}) => {
        return addToast({
            type: 'info',
            title,
            message,
            ...options
        });
    };

    const value = {
        ...state,
        addToast,
        removeToast,
        clearAll,
        success,
        error,
        warning,
        info
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};

// Hook pour utiliser le contexte des toasts
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastContext;