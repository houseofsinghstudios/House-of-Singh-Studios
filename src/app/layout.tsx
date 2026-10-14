import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Root layout shared by the website and the Studio: the document, the font and the default
// metadata only. Site chrome and site CSS live in (site)/layout.tsx so they never reach /studio.

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>{children}</body>
    </html>
  );
}
