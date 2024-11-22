import { plugin } from "postcss";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    plugin(([matchUtilities, theme]) => {
      matchUtilities(
        {
          "animate-delay": (value) => {
            return {
              "animation-delay": value
            }
          }
        },
        {
          values: theme('transitionDelay')
        }
      )
}) satisfies Config;
