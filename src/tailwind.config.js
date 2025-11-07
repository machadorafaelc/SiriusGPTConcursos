/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  darkMode: 'class', // forçar dark mode
  theme: {
    extend: {
      colors: {
        'vega-bg': '#0B0E23',
        'vega-bg-2': '#1A1F4A',
        'vega-card': '#15193C',
        'vega-text': '#FFFFFF',
        'vega-text-2': '#B0B3C6',
        'vega-neon': '#3CF5FF',
        'vega-purple': '#6E00FF',
        'vega-pink': '#E4007C',
      },
      backgroundImage: {
        'vega-page': 'linear-gradient(180deg, #0B0E23 0%, #1A1F4A 100%)',
        'vega-cta': 'linear-gradient(90deg, #6E00FF 0%, #E4007C 100%)',
      },
      boxShadow: {
        'vega': '0 0 20px rgba(0,0,0,0.60)',
        'vega-cta': '0 6px 16px rgba(110,0,255,0.35)',
      },
      borderRadius: {
        'vega': '16px',
        'vega-btn': '12px',
      },
    }
  },
  plugins: [],
}
