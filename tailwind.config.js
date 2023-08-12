/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        demoPrimary: "#203953",
        demoSecondary: "#214A87",
        demoTertiary: "#4673AB",
      },
    },
  },
  plugins: [],
}

