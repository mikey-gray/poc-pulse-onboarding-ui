/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        company: {
          50: '#fffbea',
          100: '#fff3c4',
          200: '#ffe69a',
          300: '#ffd66d',
          400: '#fcbf49',
          500: '#f3a712',
          600: '#e59400',
          700: '#cc7a00',
          800: '#a56200',
          900: '#7f4a00',
        },
        workspace: {
          50: '#e3f2ff',
          100: '#b9e4fe',
          200: '#8fd4fd',
          300: '#63c1fa',
          400: '#3aaef6',
          500: '#189ae9',
          600: '#0d7dc5',
          700: '#0660a0',
          800: '#034477',
          900: '#012c50',
        },
        client: {
          50: '#f6e8ff',
          100: '#e9ccff',
          200: '#dbafff',
          300: '#cd90ff',
          400: '#bf71fa',
          500: '#b052f1',
          600: '#943ace',
          700: '#7628a6',
          800: '#571a7c',
          900: '#3b1053',
        },
      },
    },
  },
  plugins: [],
};
