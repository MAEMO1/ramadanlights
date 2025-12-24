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
        // Light, clean backgrounds
        surface: {
          DEFAULT: "#ffffff",
          soft: "#fafafa",
          muted: "#f5f5f5",
        },
        // VGM Teal - primary brand
        teal: {
          DEFAULT: "#2d9596",
          light: "#3aabac",
          dark: "#1f6b6c",
          50: "#e6f4f4",
        },
        // Gold accent
        gold: {
          DEFAULT: "#d4a853",
          light: "#e8c478",
          dark: "#b8923f",
        },
        // Text hierarchy
        text: {
          primary: "#1a1a1a",
          secondary: "#4a4a4a",
          muted: "#717171",
          light: "#9a9a9a",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "soft": "0 2px 15px rgba(0, 0, 0, 0.04)",
        "medium": "0 4px 25px rgba(0, 0, 0, 0.06)",
        "strong": "0 8px 40px rgba(0, 0, 0, 0.08)",
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
