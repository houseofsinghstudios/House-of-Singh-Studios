import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";

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
          <link
            rel="preload"
            href="/fonts/CormorantGaramond-Variable.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Inter-Variable.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </head>
        <body>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ViewTransitions>
  );
}
