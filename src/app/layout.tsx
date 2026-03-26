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

export const metadata: Metadata = {
  title: "House of Singh Studios",
  description: "Design studio. AI powered. Brand focused.",
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
