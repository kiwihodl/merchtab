/** srctype {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://shop.app",
              "style-src 'self' 'unsafe-inline' https://fonts.shopifycdn.com",
              "font-src 'self' https://fonts.shopifycdn.com",
              "img-src 'self' blob: data: https://*.shopifycdn.com https://*.shopify.com",
              "frame-src 'self' https://shop.app",
              "connect-src 'self' https://shop.app https://*.shopify.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
