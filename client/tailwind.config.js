/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grayRegular: "#282828",
        graySecondary: "#3d3c3c",
        whiteRegular: "#faebd7",
      },
    },
  },
  plugins: [],
};
