/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medieval: {
          primary: '#1a1410',
          accent: '#c9a84c',
          bg: '#0d0b08',
          text: '#e8dcc8',
        },
        renaissance: {
          primary: '#1a1520',
          accent: '#b8860b',
          bg: '#12101a',
          text: '#d4c5a0',
        },
        medical: {
          primary: '#0a1628',
          accent: '#4fc3f7',
          bg: '#060d18',
          text: '#e0e8f0',
        },
        space: {
          primary: '#050510',
          accent: '#7c4dff',
          bg: '#02020a',
          text: '#e8e0ff',
        },
        gold: '#c9a84c',
        'gold-dark': '#b8860b',
        'signal-red': '#ff4444',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'ember-float': 'emberFloat 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        emberFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 168, 76, 0.6)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
