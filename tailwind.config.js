/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00593F',
        emeraldLight: '#d1fae5',   // emerald-100
        emeraldMid: '#a7f3d0',     // emerald-200
        emeraldSemi: '#6ee7b7',    // emerald-300
        emeraldBase: '#34d399',    // emerald-400
        greenDark: '#065f46',      // green-900
        greenFocus: '#059669',     // green-600
        grayBorder: '#d1d5db',     // gray-300
        grayText: '#374151',       // gray-700
        errorRed: '#ef4444',       // red-500
        pureWhite: '#ffffff',      // white
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
