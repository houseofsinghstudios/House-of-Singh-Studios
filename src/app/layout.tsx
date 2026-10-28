import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";

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
    default: 'House of Singh Studios | Brand Identity and Design, Toronto',
    template: '%s — House of Singh Studios',
  },
  description: 'A design studio powered by AI systems and led by creative direction. Brand identity, visual media, digital design, and creative strategy for businesses that have outgrown their brand.',
  // No default og or twitter title and description: each page's own title and description
  // fill them, and Next copies a page's openGraph title into its twitter card. Defaults set here
  // would make every page share the homepage's social title.
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: siteUrl,
    siteName: 'House of Singh Studios',
    // The default share image, for pages that set no openGraph of their own (such as the 404).
    // The twitter card takes its image from here.
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@hosdesignstudio',
  },
  // No default canonical: every page sets its own. A root canonical would be inherited by
  // 404s and the Studio, pointing them at the homepage.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA" className={inter.variable}>
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
