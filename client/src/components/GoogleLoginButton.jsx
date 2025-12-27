import React from 'react';
import { useTranslation } from 'react-i18next';
import { FcGoogle } from 'react-icons/fc'; 


const GoogleLoginButton = () => {
  const { t } = useTranslation();

  const handleGoogleLogin = () => {

    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  return (
    <button 
      onClick={handleGoogleLogin} 
      className="w-full py-2 border border-gray-300 rounded-lg transition-colors flex items-center justify-center space-x-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md"
    >
      <FcGoogle className="h-5 w-5" /> 

      <span className="font-bold">{t('loginWithGoogle')}</span>
    </button>
  );
};

export default GoogleLoginButton;