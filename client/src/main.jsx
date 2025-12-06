// client/src/main.jsx - WEEK 1: MINIMAL ENTRY POINT

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Note: Use .jsx extension here for clarity
// import { UserProvider } from './context/UserContext'; // REMOVED: User Context (Future Week)
// import { BrowserRouter } from 'react-router-dom'; // REMOVED: Already handled by App.jsx or can be here

import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Removed UserProvider for Week 1 */}
    <App /> 
  </React.StrictMode>
);