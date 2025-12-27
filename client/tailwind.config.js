/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: { 
        black: '#000000',
      },
    },
  },
  plugins: [

    require('@tailwindcss/forms'),
  ],
}