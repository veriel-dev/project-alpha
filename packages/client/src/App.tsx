import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Views 
import Login from './views/login/Login';
import { Register } from './views/register/Register';
import Dashboard from './views/dashboard/Dashboard';
import PageList from './views/pageList/PageList';
import Profile from './views/profile/Profile';
import NotFound from './views/NotFound';
import { EditorApp } from './views/editor/EditorApp';

// Componentes
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Toast from './components/toast/Toast';


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
          <Route path="editor/:id?" element={<EditorApp />} />
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