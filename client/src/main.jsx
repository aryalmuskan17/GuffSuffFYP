// client/src/main.jsx - WEEK 3: INTEGRATING USER & THEME CONTEXTS

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; 
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext'; // <-- NEW: Import ThemeProvider

import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Wrap the entire app with ThemeProvider */}
    <ThemeProvider> 
      {/* Wrap the App with UserProvider */}
      <UserProvider>
        <App /> 
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);