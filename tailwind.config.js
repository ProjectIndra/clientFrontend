/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          app: 'var(--color-bg-app)',
          wrapper: 'var(--color-bg-wrapper)',
          navbar: 'var(--color-bg-navbar)',
          surface: 'var(--color-bg-surface)',
          surfaceMuted: 'var(--color-bg-surface-muted)',
          textPrimary: 'var(--color-text-primary)',
          textSecondary: 'var(--color-text-secondary)',
          textTertiary: 'var(--color-text-tertiary)',
          textMuted: 'var(--color-text-muted)',
          textInverse: 'var(--color-text-inverse)',
          border: 'var(--color-border)',
          bg0d: 'var(--color-bg-0d)',
          bgf6: 'var(--color-bg-f6)',
          bgf8: 'var(--color-bg-f8)',
          text0d: 'var(--color-text-0d)',
          brand0a: 'var(--color-brand-0a)',
        },
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
