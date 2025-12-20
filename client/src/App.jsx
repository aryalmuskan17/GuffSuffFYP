// client/src/App.jsx - FINAL VERSION WITH TOAST

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Login from './Login.jsx'; 
import { UserContext } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute'; 
import Welcome from './pages/Welcome.jsx'; 

// --- NEW IMPORTS for Toast Notifications ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ------------------------------------------

function App() {
  const { isAuthenticated } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Login isRegister={false} />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Login isRegister={true} />} 
        />
        
        {/* Protected Route */}
        <Route 
          path="/welcome" 
          element={
            <ProtectedRoute>
              <Welcome /> 
            </ProtectedRoute>
          } 
        />
        
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} replace />} />
        
        {/* Catch-all */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
      
      {/* --- ADD THIS TO RENDER THE TOAST NOTIFICATIONS --- */}
      <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // Use the "colored" theme for a nice look
      />
    </Router>
  );
}

export default App;