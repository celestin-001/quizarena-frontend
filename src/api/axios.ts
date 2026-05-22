import axios from 'axios';
import { getToken } from '../utils/token';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Redirige vers /login si le token est expiré
apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('quizarena_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;