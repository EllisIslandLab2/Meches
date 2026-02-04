import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { SeasonProvider } from "@/contexts/SeasonContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import ErrorBoundary from "@/components/ErrorBoundary";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const crimsonText = Crimson_Text({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: "Meche's Handmade Crafts - Unique Handcrafted Jewelry & Wooden Designs",
  description: "Discover unique, handcrafted jewelry and laser-cut wooden designs made with love and attention to detail. Shop beautiful earrings, cowgirl style accessories, and custom handmade crafts.",
  keywords: ["handmade jewelry", "handcrafted earrings", "laser cut wooden designs", "custom jewelry", "cowgirl accessories", "handmade crafts", "unique jewelry"],
  authors: [{ name: "Meche's Crafts" }],
  creator: "Meche's Crafts",
  publisher: "Meche's Crafts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.mechescreations.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Meche's Handmade Crafts - Unique Handcrafted Jewelry",
    description: "Discover unique, handcrafted jewelry and laser-cut wooden designs made with love and attention to detail.",
    url: 'https://www.mechescreations.com',
    siteName: "Meche's Handmade Crafts",
    images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: "Meche's Handmade Crafts Logo",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Meche's Handmade Crafts - Unique Handcrafted Jewelry",
    description: "Discover unique, handcrafted jewelry and laser-cut wooden designs made with love.",
    images: ['/logo.webp'],
    creator: '@mechescrafts',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/webp',
        sizes: '512x512',
        url: '/favicon-512.webp',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        {/* Preload critical logo image */}
        <link rel="preload" as="image" href="/meche-logo.webp" />
      </head>
      <body className={`${crimsonText.variable} font-serif min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <ReCaptchaProvider>
            <SeasonProvider>
              <CartProvider>
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </SeasonProvider>
          </ReCaptchaProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
