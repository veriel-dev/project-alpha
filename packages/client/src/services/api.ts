import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar error 401 (no autorizado)
    if (error.response && error.response.status === 401) {
      // Limpiar localStorage y recargar página
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);