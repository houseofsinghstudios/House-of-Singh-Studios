import type { NextConfig } from "next";

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
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://core.sanity-cdn.com https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://cdn.sanity.io https://*.vercel-scripts.com https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.sanity.io https://va.vercel-scripts.com https://*.n8n.cloud https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
              "frame-src 'self' https://cal.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
