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
          dark: '#1b4332',       // Deep forest green
          primary: '#2d6a4f',    // Soft leafy green
          light: '#52b788',      // Fresh sprout green
          pastel: '#e8f5e9',     // Pastel mint green
          cream: '#fefae0',      // Soft cream
          warm: '#fff7ed',       // Warm white / light peach
          accent: '#e9c46a',     // Warm harvest golden yellow
          peach: '#ffedd5',      // Peach highlight
          terracotta: '#e76f51'  // Earthy terracotta accent
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' }
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(8px) rotate(-3deg)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        }
      }
    },
  },
  plugins: [],
}
