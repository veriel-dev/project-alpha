import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      // Configurar token en las cabeceras de las peticiones
      api.defaults.headers.common['x-auth-token'] = token;

      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', { email, password });
      const { token, user } = response.data;

      // Guardar token y usuario
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Configurar token para peticiones
      api.defaults.headers.common['x-auth-token'] = token;

      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  // Función para registrarse
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/users/register', { name, email, password });
      const { token, user } = response.data;

      // Guardar token y usuario
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Configurar token para peticiones
      api.defaults.headers.common['x-auth-token'] = token;

      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al registrarse');
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  // Función para actualizar perfil
  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      const response = await api.put('/users/profile', data);
      const updatedUser = response.data.user;

      // Actualizar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUser(updatedUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al actualizar perfil');
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.put('/users/change-password', { currentPassword, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al cambiar contraseña');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};