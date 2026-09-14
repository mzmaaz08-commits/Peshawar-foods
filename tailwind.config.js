/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        'primary-dark': '#e55a28',
        secondary: '#004E89',
        accent: '#F7C59F',
        dark: '#0a0a0f',
        dark2: '#12121a',
        dark3: '#1a1a28',
        dark4: '#22223a',
        light: '#F8F9FA',
        gold: '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        head: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255,107,53,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255,107,53,0.8)' },
        }
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
