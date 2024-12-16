module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Exo", "sans-serif"],
      },
      clipPath: {
        "slanted-right": "polygon(0 0, 100% 10%, 100% 90%, 0 100%)",
        "slanted-left": "polygon(0 10%, 100% 0, 100% 100%, 0 90%)",
      },
      animation: {
        blink: "blink 1s step-end 3s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
