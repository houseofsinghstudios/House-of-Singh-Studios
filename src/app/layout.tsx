import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import "@/styles/scroll-animations.css";
import "lenis/dist/lenis.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import GrainCanvas from "@/components/GrainCanvas";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
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
        <body>
          <SmoothScroll />
          <CustomCursor />
          <GrainCanvas />
          <PageTransition />
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ViewTransitions>
  );
}
