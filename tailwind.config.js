/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'Newsreader'", "serif"]
      },
      colors: {
        bbcRed: "#bb1919",
        ink: "#101418",
        sand: "#f4f1ea"
      }
    }
  },
  plugins: []
};
