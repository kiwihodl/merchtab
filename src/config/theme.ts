export const theme = {
  colors: {
    // Brand Colors
    primary: "#000000", // Default black
    accent: "#FF9500", // Bitcoin orange

    // Text Colors
    text: {
      primary: "#FFFFFF", // White text for dark mode
      secondary: "#9CA3AF", // Neutral gray for secondary text
      muted: "#6B7280", // Muted text color
    },

    // Background Colors
    background: {
      primary: "#000000", // Dark mode background
      secondary: "#1F2937", // Slightly lighter dark background
      hover: "#374151", // Hover state background
    },

    // Border Colors
    border: {
      default: "#374151", // Default border color
      hover: "#FF9500", // Border color on hover (accent)
      active: "#FF9500", // Border color for active states (accent)
    },
  },

  // Typography
  fonts: {
    body: "Blinker, sans-serif", // Default body font
    heading: "Blinker, sans-serif", // Default heading font
  },

  // Border Radius
  borderRadius: {
    sm: "0.375rem", // 6px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
  },

  // Transitions
  transitions: {
    default: "0.3s ease-in-out",
    fast: "0.15s ease-in-out",
    slow: "0.5s ease-in-out",
  },
} as const;

// Type for the theme
export type Theme = typeof theme;

// Utility function to get a nested theme value
export function getThemeValue<T>(path: string, themeObj = theme): T {
  return path.split(".").reduce((acc, part) => acc[part], themeObj as any) as T;
}
