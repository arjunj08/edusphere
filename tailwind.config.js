/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        ink: { DEFAULT: "#101B2D", soft: "#3A4558" },
        line: "#E4E2DA",
        risk: { DEFAULT: "#E24B4A", soft: "#FCEBEB" },
        watch: { DEFAULT: "#EF9F27", soft: "#FAEEDA" },
        track: { DEFAULT: "#1D9E75", soft: "#E1F5EE" },
        accent: { DEFAULT: "#534AB7", soft: "#EEEDFE" },
        mint: "#9FE1CB",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ['"Instrument Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "book-bind-bg":
          "linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(255,255,255,0.18) 10%, rgba(0,0,0,0.12) 15%, rgba(0,0,0,0) 24%)",
        "book-pages":
          "repeating-linear-gradient(90deg, #ffffff 0px, #efede6 1px, #ffffff 3px, #f7f5ef 4px)",
      },
      boxShadow: {
        book: "0 16px 32px -14px rgba(16,27,45,0.4), 0 3px 8px rgba(16,27,45,0.18)",
      },
    },
  },
  plugins: [],
};
