import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as authApi from '../api/authApi';

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_LOADING: 'SET_LOADING',
};

const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
            return { ...state, isLoading: true, error: null };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };
        case AUTH_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(authReducer, initialState);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const resp = await authApi.getCurrentUser();
                    dispatch({
                        type: AUTH_ACTIONS.LOGIN_SUCCESS,
                        payload: { user: resp.data, token },
                    });
                } catch {
                    localStorage.removeItem('token');
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } else {
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });
        try {
            const response = await authApi.login(email, password);
            const accessToken = response.data?.access_token || response.data?.token || null;
            if (!accessToken) {
                throw new Error('No access token returned from server');
            }
            localStorage.setItem('token', accessToken);

            const userResp = await authApi.getCurrentUser();
            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: userResp.data, token: accessToken },
            });
            return { success: true };
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg ||
                error.response?.data?.message ||
                error.message ||
                'Login failed';
            dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        dispatch({ type: AUTH_ACTIONS.REGISTER_START });
        try {
            // create user
            await authApi.register(userData);

            // login immediately after registration
            const loginResp = await authApi.login(userData.email, userData.password);
            const accessToken = loginResp.data?.access_token || loginResp.data?.token || null;
            if (!accessToken) {
                throw new Error('No access token returned after registration');
            }
            localStorage.setItem('token', accessToken);

            const userResp = await authApi.getCurrentUser();
            dispatch({
                type: AUTH_ACTIONS.REGISTER_SUCCESS,
                payload: { user: userResp.data, token: accessToken },
            });
            return { success: true };
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg ||
                error.response?.data?.message ||
                error.message ||
                'Registration failed';
            dispatch({ type: AUTH_ACTIONS.REGISTER_FAILURE, payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    const isAdmin = () => !!state.user?.is_admin;

    const value = {
        ...state,
        login,
        register,
        logout,
        clearError,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
