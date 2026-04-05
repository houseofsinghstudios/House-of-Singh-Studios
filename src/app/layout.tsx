import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@/styles/scroll-animations.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FooterReveal from "@/components/layout/FooterReveal";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import ScrollObserver from "@/components/ScrollObserver";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const siteUrl = 'https://studios.houseofsingh.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'House of Singh Studios — AI Powered Design Studio Toronto',
    template: '%s — House of Singh Studios',
  },
  description: 'A design studio powered by AI systems and led by creative direction. Brand identity, visual media, digital design, and creative strategy for established businesses.',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: siteUrl,
    siteName: 'House of Singh Studios',
    title: 'House of Singh Studios — AI Powered Design Studio Toronto',
    description: 'A design studio powered by AI systems and led by creative direction. Brand identity, visual media, digital design, and creative strategy for established businesses.',
    // images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'House of Singh Studios' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Singh Studios — AI Powered Design Studio Toronto',
    description: 'A design studio powered by AI systems and led by creative direction.',
    // images: ['/og-image.jpg'],
    creator: '@hosdesignstudio',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
          <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="preload" href="/hos-studios-logo.svg" as="image" />
        </head>
        <body>
          <div className="scroll-progress" />
          <SmoothScroll />
          <CustomCursor />
          <PageTransition />
          <Header />
          <div className="site-content-wrap">
            <main>{children}</main>
            <Footer />
          </div>
          <FooterReveal />
          <ScrollObserver />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransitions>
  );
}
