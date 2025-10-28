// src/api/apiClient.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://capstone-backend-elib.onrender.com/api' || 'http://localhost:5000/api',
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        // Affiche un succès seulement si le backend renvoie un message
        const method = response.config?.method?.toLowerCase();
        const message =
            response.data?.message ||
            response.data?.msg ||
            response.data?.successMessage;

        if (message && ['post', 'put', 'delete', 'patch'].includes(method)) {
            toast.success(message);
        }

        return response;
    },
    (error) => {
        const status = error.response?.status;
        const message =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            'Une erreur est survenue.';

        if (status === 401) {
            toast.error('Session expirée. Veuillez vous reconnecter.');
            localStorage.removeItem('token');
            setTimeout(() => {
                window.history.pushState({}, '', '/signin');
                window.dispatchEvent(new Event('popstate'));
            }, 1500);
        } else if (status === 403) {
            toast.error('Accès refusé.');
        } else if (status === 404) {
            toast.error('Ressource introuvable.');
        } else if (status >= 500) {
            toast.error('Erreur serveur. Réessayez plus tard.');
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
