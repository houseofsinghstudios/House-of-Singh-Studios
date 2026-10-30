"use client";

// Client component: Next.js requires error boundaries to be client components.
// The last resort: shown only when a failure happens outside the site layout (the root layout
// itself). It replaces the whole document, so it has its own html and body, no site CSS, and
// inline styles with the site's colour values. Same wording as (site)/error.tsx. Never indexed.
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const OBSIDIAN = "#22211F";
const GUNMETAL = "#5C5B58";
const SILVER_MIST = "#F7F6F5";

const button = {
  display: "inline-block",
  padding: "14px 28px",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.2,
  textDecoration: "none",
  border: `1px solid ${OBSIDIAN}`,
  cursor: "pointer",
  fontFamily: "inherit",
} as const;

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en-CA">
      <body className={inter.className} style={{ margin: 0, background: SILVER_MIST, color: OBSIDIAN }}>
        <title>House of Singh Studios</title>
        <meta name="robots" content="noindex" />
        <main style={{ padding: "clamp(120px, 20vw, 240px) max(40px, 8vw) 64px" }}>
          <h1 style={{ margin: 0, fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.03em" }}>
            This page could not load right now.
          </h1>
          <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.6, color: GUNMETAL }}>Please try again in a moment.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 48 }}>
            <button type="button" onClick={retry} style={{ ...button, background: OBSIDIAN, color: SILVER_MIST }}>
              Try Again
            </button>
            {/* Plain next/link: the site's own Button lives inside the layout that failed. */}
            <Link href="/" style={{ ...button, background: "transparent", color: OBSIDIAN }}>
              Go to the Homepage
            </Link>
            <Link href="/contact" style={{ ...button, background: "transparent", color: OBSIDIAN }}>
              Contact the Studio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
