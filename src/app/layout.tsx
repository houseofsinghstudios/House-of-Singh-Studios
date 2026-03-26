import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@/styles/scroll-animations.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import ScrollObserver from "@/components/ScrollObserver";
import FooterReveal from "@/components/layout/FooterReveal";

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
      <html lang="en">
        <head>
          <link rel="preload" href="/hos-studios-logo.svg" as="image" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap"
            as="style"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
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
