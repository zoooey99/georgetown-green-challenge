/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['adobe-garamond-pro', 'Garamond', 'Georgia', 'serif'],
        sans: ['source-sans-pro', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};