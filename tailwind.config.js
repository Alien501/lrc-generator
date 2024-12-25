/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        up: '0 -10px 10px rgba(0, 0, 0, .1)'
      },
      fontFamily: {
        satoshi: ['satoshi', 'sans-serif']
      }
    },
  },
  plugins: [],
}

