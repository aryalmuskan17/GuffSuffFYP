import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Login from './Login.jsx'; 
import { UserContext } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute'; 
import Welcome from './pages/Welcome.jsx'; 
import Layout from './components/Layout.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { isAuthenticated } = useContext(UserContext);

  return (
    <Router>
      <Routes>

        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Login isRegister={false} />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Login isRegister={true} />} 
        />

        <Route 
          path="/welcome" 
          element={
            <ProtectedRoute>

              <Layout> 
                <Welcome /> 
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} replace />} />

        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>

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
          theme="colored" 
      />
    </Router>
  );
}

export default App;