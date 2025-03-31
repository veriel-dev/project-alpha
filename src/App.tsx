import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PageList from './pages/PageList';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Componentes
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import { Toast } from './components/Toast';

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar carga mientras se verifica la autenticación
  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Rutas privadas */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pages" element={<PageList />} />
          <Route path="editor/:id?" element={<Editor />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Componente de notificaciones */}
      <Toast />
    </>
  );
};

export default App;