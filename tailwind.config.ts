import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      colors: {
        charcoal: {
          DEFAULT: "#1A1A2E",
          light: "#252540",
        },
        ivory: {
          DEFAULT: "#F8F4EF",
          dark: "#F1EDE6",
        },
        gold: {
          DEFAULT: "#D4A94A",
          light: "#E8C97A",
          dark: "#B8932E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
