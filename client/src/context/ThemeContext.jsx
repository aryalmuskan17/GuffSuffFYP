// client/src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context
const ThemeContext = createContext();

// 2. Create the Provider Component
const ThemeProvider = ({ children }) => {
  // State to track if dark mode is active (defaulting to system preference or false)
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark' || 
         (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Function to toggle the dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Effect to apply the dark/light class to the <html> tag and save preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // The value exposed to the app
  const value = {
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Export Context and Provider
export { ThemeContext, ThemeProvider };