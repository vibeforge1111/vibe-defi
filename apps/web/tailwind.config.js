/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // VibeShip-inspired color scheme
        background: {
          DEFAULT: '#0a0f1a',
          secondary: '#0f1629',
          tertiary: '#151d2e',
        },
        surface: {
          DEFAULT: '#1a2332',
          hover: '#222d3f',
          border: '#2a3548',
        },
        accent: {
          DEFAULT: '#10b981',
          hover: '#34d399',
          muted: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.3)',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        success: {
          DEFAULT: '#10b981',
          muted: 'rgba(16, 185, 129, 0.15)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          muted: 'rgba(245, 158, 11, 0.15)',
        },
        danger: {
          DEFAULT: '#ef4444',
          muted: 'rgba(239, 68, 68, 0.15)',
        },
        border: '#2a3548',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(16, 185, 129, 0.15)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(42, 53, 72, 0.3) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(42, 53, 72, 0.3) 1px, transparent 1px)`,
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)' },
        },
      },
    },
  },
  plugins: [],
};
