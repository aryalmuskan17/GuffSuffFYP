// client/src/App.jsx - WEEK 1: MINIMAL ROUTER SETUP

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.jsx'; 
// NOTE: We are using Login.jsx for BOTH /login and /register

function App() {
  // In Week 1, we don't have global state yet, so we hardcode authentication to false.
  const isAuthenticated = false; 

  return (
    // Router must wrap the routes if not wrapped in main.jsx
    <Router>
      <Routes>
        {/* PUBLIC ROUTES: Login and Register */}
        <Route path="/login" element={<Login isRegister={false} />} />
        <Route path="/register" element={<Login isRegister={true} />} />
        
        {/* PLACEHOLDER ROUTE: Redirects if not logged in */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <h1>Dashboard (Placeholder)</h1> : <Navigate to="/login" />} 
        />
        
        {/* Redirects the root path to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Catch-all for undefined paths */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;