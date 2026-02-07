/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#14181c",
        surface: "#1a2128",
        primary: "#00e054",
        accent: "#ff8000",
        textMuted: "#9ab",
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
