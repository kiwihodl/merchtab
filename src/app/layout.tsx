import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { cookies } from "next/headers";
import { getCart } from "@/app/lib/shopify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sovereign University",
  description: "Official merchandise store for Sovereign University",
  metadataBase: new URL("https://sovereignuniversity.vercel.app"),
  openGraph: {
    title: "Sovereign University",
    description: "Official merchandise store for Sovereign University",
    url: "https://sovereignuniversity.vercel.app",
    siteName: "Sovereign University",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sovereign University",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sovereign University",
    description: "Official merchandise store for Sovereign University",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = cookies().get("cartId")?.value;
  const cart = getCart(cartId);
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white`}>
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
