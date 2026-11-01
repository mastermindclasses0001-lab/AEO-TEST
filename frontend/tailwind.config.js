/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeBlack: '#000000',
        themeRed: '#FF3B30',
        themeYellow: '#FFCC00',
        themeBlue: '#5AC8FA',
        themeGreen: '#34C759',
        themeDarkGray: '#1C1C1E',
      }
    },
  },
  plugins: [],
}