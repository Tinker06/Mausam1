/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mausam: {
          dark: '#0B0F19',
          card: '#161F33',
          border: '#2A364F',
          primary: '#3B82F6',
          accent: '#06B6D4',
          highlight: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
}
