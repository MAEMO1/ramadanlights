import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme background colors
        background: {
          DEFAULT: "#0a0a1a",
          alt: "#101028",
          card: "#151530",
        },
        // Primary accent - Gold/Amber (symbolizes light)
        primary: {
          DEFAULT: "#d4a853",
          hover: "#e6be6a",
          light: "#f0d78a",
          dark: "#b8923d",
        },
        // Secondary accent - Teal (from VGM logo)
        teal: {
          DEFAULT: "#2d9596",
          light: "#3db5b6",
          dark: "#1d7576",
        },
        // Text colors
        text: {
          primary: "#ffffff",
          secondary: "#a0a0b0",
          muted: "#6b6b7b",
        },
        // Border colors
        border: {
          DEFAULT: "#2a2a4a",
          light: "#3a3a5a",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glow-gold": "radial-gradient(circle, rgba(212, 168, 83, 0.3) 0%, transparent 70%)",
        "glow-teal": "radial-gradient(circle, rgba(45, 149, 150, 0.3) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(212, 168, 83, 0.3)",
        "glow-md": "0 0 30px rgba(212, 168, 83, 0.4)",
        "glow-lg": "0 0 50px rgba(212, 168, 83, 0.5)",
        "glow-teal": "0 0 30px rgba(45, 149, 150, 0.4)",
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "twinkle": "twinkle 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
