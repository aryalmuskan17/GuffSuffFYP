// client/src/components/GoogleLoginButton.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

// This component provides the button to start the Google OAuth process.
const GoogleLoginButton = () => {
  const { t } = useTranslation();

  // The function redirects the browser to the backend's Google auth endpoint.
  // Passport.js intercepts this route and handles the redirect to Google.
  const handleGoogleLogin = () => {
    // CRITICAL: This URL must match the route defined in your server/routes/auth.js
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  return (
    <button 
      onClick={handleGoogleLogin} 
      className="w-full py-2 text-gray-700 font-bold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
    >
      {/* Placeholder for the Google Icon (You may need to install/configure an icon library like react-icons) */}
      <img src="/google-icon.png" alt="Google Icon" style={{ height: '20px' }} />
      <span>{t('loginWithGoogle')}</span>
    </button>
  );
};

export default GoogleLoginButton;