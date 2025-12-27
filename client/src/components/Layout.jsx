import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/logo.png'; 
import { toast } from 'react-toastify';

const MdDarkMode = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const MdLightMode = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { user, logout } = useContext(UserContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    toast.info(t('logoutSuccess'));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* Navbar/Header Component */}
      <header className={`shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          
          <Link to="/welcome" className="flex items-center space-x-2">
            <img src={Logo} alt="GuffSuff Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">GuffSuff</span>
          </Link>

          <nav className="flex items-center space-x-6">
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
              title={t('toggleTheme')}
            >
              {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
            </button>

            <Link to="/profile" className="text-indigo-500 font-semibold hover:text-indigo-400">
              {user?.username || t('profile')}
            </Link>

            <button
              onClick={handleLogout}
              className="py-1 px-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              {t('logout')}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;