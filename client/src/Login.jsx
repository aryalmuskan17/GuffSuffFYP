// client/src/Login.jsx - WEEK 1: MINIMAL LOGIN/REGISTER FORM

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// NOTE: Toast, UserContext, ThemeContext, useTranslation, Logo, and GoogleLoginButton are REMOVED for Week 1

// Define the base URL for the backend
const API_URL = 'http://localhost:5001/api/auth'; 

// This component handles BOTH Login and Register based on the isRegister prop
const Login = ({ isRegister }) => { 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Only needed for registration
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const title = isRegister ? 'Register' : 'Login';
  const endpoint = isRegister ? '/register' : '/login';

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Data payload changes based on whether it's login or register
      const payload = isRegister 
        ? { username, email, password, role: 'Reader' } // Week 1 only needs basic fields
        : { username, password }; 

      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      // Since we don't have global context (UserProvider) yet, we just log the success
      console.log(`${title} successful! Token:`, res.data.token);
      
      // Redirect to the login page after successful registration, or to the dashboard after login
      if (isRegister) {
          alert("Registration successful! Please log in.");
          navigate('/login');
      } else {
          alert("Login successful!");
          // Use localStorage to temporarily store token and simulate auth for Week 1
          localStorage.setItem('token', res.data.token); 
          navigate('/dashboard'); 
      }

    } catch (err) {
      console.error(`${title} failed:`, err.response?.data?.message || 'Network Error');
      alert(`${title} failed: ${err.response?.data?.message || 'Please check server connection.'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          {title} to GuffSuff
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
              autoComplete="username"
            />
          </div>

          {/* Email Field (Only visible for Registration) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
                autoComplete="email"
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white font-bold bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            {title}
          </button>
        </form>
        
        {/* Link to switch between Login and Register */}
        <div className="mt-4 text-center text-sm">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <Link to={isRegister ? "/login" : "/register"} className="text-indigo-600 hover:underline ml-1">
            {isRegister ? "Login here" : "Register here"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;