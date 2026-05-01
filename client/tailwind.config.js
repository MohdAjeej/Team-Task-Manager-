/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF9F5',
        ink: '#000000',
        slate: {
          DEFAULT: '#646462',
          soft: '#8a8a87',
        },
        fog: '#CDCCC9',
        cloud: '#FFFFFF',
        orchid: {
          DEFAULT: '#B074CE',
          hover: '#9A5CB8',
          tint: '#F0E6F6',
        },
        analyst: '#FFCC00',
        glacier: {
          DEFAULT: '#2DCBDC',
          tint: '#D5F2F6',
        },
        'brand-green': {
          DEFAULT: '#20A277',
          tint: '#D6EFE4',
        },
        'revops-red': {
          DEFAULT: '#E5484D',
          tint: '#FBE0E1',
        },
        'founders-navy': {
          DEFAULT: '#1E2A4A',
          tint: '#D8DCE5',
        },
        // legacy primary kept as alias to orchid for any stragglers
        primary: {
          50: '#F0E6F6',
          100: '#E1CDED',
          500: '#B074CE',
          600: '#B074CE',
          700: '#9A5CB8',
          800: '#7E489A',
          900: '#5E3473',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Times New Roman', 'serif'],
        sans: ['"Inter Tight"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
        ui: '-0.005em',
        micro: '0.18em',
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
}
