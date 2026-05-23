/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F0CC5A',
          dark: '#A07820',
          bright: '#FFD700',
        },
        tomb: {
          bg: '#0A0806',
          card: '#140E05',
          border: '#3D2E0A',
          surface: '#1C1508',
          muted: '#8A7355',
          text: '#E8D5A3',
          stone: '#5C4A32',
          'stone-light': '#8B7355',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      animation: {
        'flicker': 'flicker 2s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 6px #D4AF37, 0 0 12px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 12px #D4AF37, 0 0 24px rgba(212,175,55,0.5)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
