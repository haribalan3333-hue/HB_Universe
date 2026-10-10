/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        'hb-dark': '#0a0a0f',
        'hb-charcoal': '#12121a',
        'hb-panel': 'rgba(18, 18, 28, 0.75)',
        'hb-yellow': '#FFE500',
        'hb-yellow-glow': 'rgba(255, 229, 0, 0.4)',
        'hb-red': '#FF2A55',
        'hb-cyan': '#00F0FF',
        'hb-purple': '#A855F7',
        'hb-blue': '#3B82F6',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-yellow': '0 0 20px rgba(255, 229, 0, 0.35), 0 0 40px rgba(255, 229, 0, 0.15)',
        'neon-yellow-sm': '0 0 10px rgba(255, 229, 0, 0.5)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'neon-red': '0 0 20px rgba(255, 42, 85, 0.35)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'glow-sweep': 'sweep 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sweep: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};