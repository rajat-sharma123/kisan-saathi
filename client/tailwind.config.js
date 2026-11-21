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
          dark: '#315D2A',    // Primary dark green
          green: '#568B35',   // Secondary green
          accent: '#82BD4B',  // Accent green
          light: '#EAF3E2',   // Light green background/accent
          bg: '#F7F9F4',      // Soft natural page background
          text: '#202B20',    // Primary dark text
          muted: '#687568',   // Secondary subdued text
          border: '#E3E9DE',  // Natural border tone
          earth: '#8D6E63',   // Subtle soil accent
          amber: '#D97706',   // Warning/mandi gold
          sand: '#FDFBF7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(32, 43, 32, 0.05), 0 1px 2px rgba(32, 43, 32, 0.03)',
        'card': '0 4px 12px -2px rgba(49, 93, 42, 0.06), 0 2px 6px -1px rgba(49, 93, 42, 0.04)',
        'lift': '0 10px 25px -5px rgba(49, 93, 42, 0.1), 0 8px 10px -6px rgba(49, 93, 42, 0.06)',
      }
    },
  },
  plugins: [],
}
