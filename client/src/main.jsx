import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; 
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext'; 
import './index.css'; 

import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider> 
      <UserProvider>
        <App /> 
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);