export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "MerchTab",
  description:
    process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ||
    "A modern e-commerce frontend built with Next.js and Shopify",
  logo: process.env.NEXT_PUBLIC_BRAND_LOGO || "/logo.png",
  favicon: process.env.NEXT_PUBLIC_BRAND_FAVICON || "/favicon.ico",
  color: "var(--tw-color-accent)",
  email: process.env.NEXT_PUBLIC_BRAND_EMAIL || "contact@merchtab.com",
  twitter: process.env.NEXT_PUBLIC_BRAND_TWITTER || "@merchtab",
  website: process.env.NEXT_PUBLIC_BRAND_WEBSITE || "https://merchtab.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://merchtab.vercel.app",
} as const;
