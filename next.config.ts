import type { NextConfig } from "next";

// Content Security Policy for the site's pages and API routes. 'unsafe-inline' stays for scripts
// and styles: Next streams inline scripts on every page, and nonces would make every page render on
// request. No 'unsafe-eval': nothing on the site needs it in production. Hosts allowed are the ones
// the browser really uses: Google Analytics 4, Microsoft Clarity, Vercel Speed Insights and Sanity
// images. Forms post only to the site's own API routes (form-action and connect-src 'self'); nothing
// is ever framed (Cal.com is linked, not embedded).
const SITE_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.vercel-scripts.com https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// The embedded Sanity Studio at /studio: exactly what it ran with before the split, minus the
// site's analytics hosts (the Studio has no analytics): Sanity's API, images, its bridge script
// from core.sanity-cdn.com, its version check against sanity-cdn.com (that one host, nothing under
// it), and its live updates over the project's own socket (wss://00iree4d.api.sanity.io).
// 'unsafe-eval' stays here only (see the verification notes in the commit).
const STUDIO_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io https://sanity-cdn.com wss://00iree4d.api.sanity.io",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // No "X-Powered-By: Next.js" header: it only tells visitors and scanners which framework runs here.
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Permanent 301s (permanent: true would send 308). Old /journal addresses moved to /insights.
  // The specific article comes first: its slug changed too.
  async redirects() {
    return [
      {
        source: "/journal/rebrand-or-refresh-how-established-businesses-decide",
        destination: "/insights/rebrand-or-refresh-how-established-businesses-should-decide",
        statusCode: 301,
      },
      { source: "/journal/:slug", destination: "/insights/:slug", statusCode: 301 },
      { source: "/journal", destination: "/insights", statusCode: 301 },
      // Short links for bios and print. The query string (UTM tags) carries over unchanged.
      // Not in the sitemap: they are addresses to share, not pages.
      { source: "/pulse", destination: "/brand-pulse", statusCode: 301 },
      { source: "/plan", destination: "/start", statusCode: 301 },
      // The Packages page is retired: pricing now lives in the Project Planner's price guide.
      { source: "/packages", destination: "/start", statusCode: 301 },
      // Case studies that were removed but are still indexed. Query strings carry over.
      { source: "/work/meridian", destination: "/work", statusCode: 301 },
      { source: "/work/soulbound", destination: "/work", statusCode: 301 },
      { source: "/work/test", destination: "/work", statusCode: 301 },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: SITE_CSP },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      // The Studio replaces the site policy with its own (a later match wins for the same header).
      {
        source: "/studio/:path*",
        headers: [{ key: "Content-Security-Policy", value: STUDIO_CSP }],
      },
    ];
  },
};

export default nextConfig;
