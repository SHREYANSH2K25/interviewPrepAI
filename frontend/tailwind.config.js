/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        foreground: '#111827',
        background: '#ffffff',
        foregroundDark: '#f9fafb',
      },
    },
  },
  plugins: [],
};
