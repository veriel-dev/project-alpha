import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Web Builder</h2>
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/pages" className={({ isActive }) => isActive ? 'active' : ''}>
          Mis Páginas
        </NavLink>
        <NavLink to="/editor" className={({ isActive }) => isActive ? 'active' : ''}>
          Nuevo Diseño
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          Mi Perfil
        </NavLink>
      </nav>
      
      <div className="user-info">
        <div className="user-name">{user?.name}</div>
        <button className="logout-button" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;