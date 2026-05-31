/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // CRITICAL: scope all Tailwind utilities under .usturf-react-lp so they
  // don't leak into the Shopify theme. Every component renders INSIDE an
  // element with .usturf-react-lp class (added by main.tsx on mount).
  important: '.usturf-react-lp',
  theme: {
    extend: {
      colors: {
        'turf-green': '#4FAE45',
        'turf-green-dark': '#367D2F',
        'turf-green-deep': '#1F4C1A',
        'turf-gold': '#FFC431',
        'turf-gold-soft': '#FFD86E',
        'turf-ink': '#14180F',
        'turf-slate': '#2A2F25',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
