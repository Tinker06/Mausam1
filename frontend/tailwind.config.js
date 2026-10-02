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
        turquoise: {
          DEFAULT: '#447F98',
          50: '#D6EBF3',
          100: '#B9D8E1',
          200: '#8EBACD',
          300: '#629BB5',
          400: '#447F98',
          500: '#34667B',
          600: '#2A5364',
          700: '#1F3E4B',
          800: '#152A33',
          900: '#0C181D',
          950: '#060D10',
        },
        slateBlue: {
          DEFAULT: '#629BB5',
          light: '#7CAEC6',
          dark: '#457993',
        },
        platinum: {
          DEFAULT: '#DADEE1',
          light: '#EAEFF2',
          dark: '#B8C0C6',
        },
        glacier: {
          DEFAULT: '#B9D8E1',
          light: '#D3E9F0',
          dark: '#8CB8C6',
        },
        iceBlue: {
          DEFAULT: '#D6EBF3',
          light: '#EBF6FA',
          dark: '#A4D3E5',
        }
      }
    },
  },
  plugins: [],
}
