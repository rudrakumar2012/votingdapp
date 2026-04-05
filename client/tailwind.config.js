/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        '1F2544': '#1F2544',
        '474F7A': '#474F7A',
        '81689D': '#81689D',
        'FFD0EC': '#FFD0EC',
      },
    },
  },
  plugins: [],
}