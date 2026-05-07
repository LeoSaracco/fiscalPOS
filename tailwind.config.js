/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f1a',
        card: '#151826',
        card2: '#1c2035',
        border: '#262d47',
        blue: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb'
        },
        green: {
          DEFAULT: '#10b981',
          hover: '#059669'
        },
        amber: '#f59e0b',
        red: '#ef4444',
        text: '#e2e8f0',
        muted: '#64748b',
        dim: '#2a3555',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
