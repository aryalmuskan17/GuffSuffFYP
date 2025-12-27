import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from './context/UserContext';
import { ThemeContext } from './context/ThemeContext';
import { toast } from 'react-toastify'; 
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './assets/logo.png'; 
import GoogleLoginButton from './components/GoogleLoginButton'; 
import LanguageSwitcher from './components/LanguageSwitcher'; 

const API_URL = 'http://localhost:5001/api/auth'; 

const Login = ({ isRegister }) => { 
  const { t } = useTranslation();
  const { login } = useContext(UserContext); 
  const { isDarkMode } = useContext(ThemeContext); 

  // State for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const title = isRegister ? t('register') : t('login');
  const endpoint = isRegister ? '/register' : '/login';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); 

    if (token) {

        login(token); 
        navigate('/welcome', { replace: true });
        toast.success(t('loginSuccess'));
        return;
    }

    const googleId = params.get('googleId');
    const googleUsername = params.get('username');
    const googleEmail = params.get('email');

    if (isRegister && googleId) {

        setUsername(googleUsername || '');
        setEmail(googleEmail || '');

        if (!location.pathname.includes('register')) {
            navigate(`/register?${location.search}`, { replace: true });
        }
    }
  }, [location.search, isRegister, login, navigate, t, location.pathname]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams(location.search);
      const googleId = params.get('googleId');
      
      const payload = isRegister 
        ? { username, email, password, role: 'Reader', googleId } 
        : { username, password }; 

      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      if (res.data.token) {

        login(res.data.token);
        toast.success(t('loginSuccess'));
      }

      if (isRegister) {
          toast.success(t('registrationSuccess')); 
          navigate('/login');
      }

    } catch (err) {
      console.error(`${title} failed:`, err.response?.data || err);
      toast.error(err.response?.data?.message || t('authFailed'));
    }
  };

  return (

    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>

      <div className="w-full max-w-md flex justify-end mb-4">
        <LanguageSwitcher />
      </div>

      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 shadow-none' : 'bg-white shadow-lg'}`}>
        
        <div className="flex flex-col items-center justify-center mb-6">

          <img 
            src={Logo} 
            alt="GuffSuff Logo" 
            className="h-16 w-16 mb-2" 
          />
          <h1 className="text-3xl font-bold dark:text-gray-100">
            {title} to GuffSuff
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold mb-1 dark:text-gray-300">{t('username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              autoComplete="username"
              readOnly={isRegister && new URLSearchParams(location.search).get('googleId') && !!username} 
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-semibold mb-1 dark:text-gray-300">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                autoComplete="email"
                readOnly={new URLSearchParams(location.search).get('googleId')} 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1 dark:text-gray-300">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isRegister || !new URLSearchParams(location.search).get('googleId')} 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
            {isRegister && new URLSearchParams(location.search).get('googleId') && (
                 <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{t('optionalPassword')}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white font-bold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {title}
          </button>
        </form>

        {!isRegister && (
            <>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
                    <span className="px-2 text-sm text-gray-500 dark:text-gray-400">{t('or')}</span>
                    <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
                </div>
                <GoogleLoginButton />
            </>
        )}

        <div className="mt-6 text-center dark:text-gray-400">
          {isRegister ? t('alreadyAccount') : t('noAccount')}
          <Link to={isRegister ? "/login" : "/register"} className="text-indigo-600 hover:underline ml-1">
            {isRegister ? t('loginHere') : t('registerHere')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;