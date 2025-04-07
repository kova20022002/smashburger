/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        smash: {
          yellow: "#FFCC00",
          black: "#1A1A1A",
          gray: "#F5F5F5",
        },
      },
      boxShadow: {
        custom: "0 4px 12px rgba(0, 0, 0, 0.1)",
        hover: "0 6px 16px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
