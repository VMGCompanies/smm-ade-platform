/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FAFAF8',
        'bg-secondary': '#F5F4F1',
        'bg-card': '#FFFFFF',
        'border-base': '#E8E6E1',
        'text-primary': '#1A1A18',
        'text-secondary': '#6B6B65',
        'text-muted': '#9E9E96',
        'accent-blue': '#0F52BA',
        'accent-blue-light': '#E8EEFA',
        'accent-green': '#1A7A4A',
        'accent-green-light': '#E6F4ED',
        'accent-amber': '#B45309',
        'accent-amber-light': '#FEF3E2',
        'accent-red': '#C0392B',
        'accent-red-light': '#FDEDEB',
        'mai-accent': '#1A4480',
        'natalia-accent': '#2D6A4F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
