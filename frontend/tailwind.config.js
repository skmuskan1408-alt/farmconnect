/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          dark: '#1b4332',      // Deep forest green
          primary: '#2d6a4f',   // Leaf green
          light: '#52b788',     // Fresh green accent
          pale: '#d8f3dc',      // Soft mint green background
          accent: '#e9c46a',    // Warm harvest golden yellow
          cream: '#f8f9fa'      // Off-white cream
        }
      }
    },
  },
  plugins: [],
}
