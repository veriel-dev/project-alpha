import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';
import { ToastProvider } from './context/ToastContext';


ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <Router>
          <App />
        </Router>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);