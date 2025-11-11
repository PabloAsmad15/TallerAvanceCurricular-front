/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66abff',
          400: '#338fff',
          500: '#003d7a', // UPAO Blue
          600: '#003166',
          700: '#00254d',
          800: '#001933',
          900: '#000d1a',
        }
      }
    },
  },
  plugins: [],
}
