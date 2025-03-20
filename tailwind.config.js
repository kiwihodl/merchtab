const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main text color in dark mode and background in light mode
        white: "#f8f8ff",
        // Bitcoin orange - used for buttons, links, and highlights throughout the site
        accent: "#FF9500",
        // Primary color scheme for light mode
        primary: {
          DEFAULT: "#000000", // Main background color in light mode
          text: "#FFFFFF", // Main text color in light mode
          muted: "#6B7280", // Secondary text color for less emphasis
        },
        // Border colors for UI elements
        border: {
          DEFAULT: "#374151", // Default border color for UI elements
          accent: "#FF9500", // Accent border color (matches accent) for highlighted elements
        },
        // Placeholder color for loading states and empty content
        placeholder: "#CCCCCC", // Light gray for placeholder images and loading states
      },
      screens: {
        "max-mob": {
          max: "475px",
        },
        "max-tab": {
          max: "768px",
        },
        "max-lap": {
          max: "1440px",
        },
        "max-sidebar": {
          max: "1285px",
        },
        "min-bottom-bar": {
          min: "1285px",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        blinker: ["Blinker", "sans-serif"],
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "2.5rem" }],
        h2: ["1.75rem", { lineHeight: "2rem" }],
        h3: ["1.25rem", { lineHeight: "1.75rem" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        "theme-default": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "theme-default": "300ms",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
