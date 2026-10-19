import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Old /journal addresses moved to /insights: permanent 301s (permanent: true would send 308).
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://core.sanity-cdn.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://cdn.sanity.io https://*.vercel-scripts.com https://*.google-analytics.com https://*.googletagmanager.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.sanity.io https://va.vercel-scripts.com https://*.n8n.cloud https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
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
