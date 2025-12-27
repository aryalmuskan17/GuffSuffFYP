import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ne', label: 'नेपाली' },
  ];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code); 
  };
  
  const currentLang = i18n.language;

  return (
    <div className="flex space-x-2 p-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1 text-sm rounded-lg transition-colors 
            ${currentLang === lang.code 
              ? 'bg-indigo-600 text-white font-semibold' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
            }`
          }
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;