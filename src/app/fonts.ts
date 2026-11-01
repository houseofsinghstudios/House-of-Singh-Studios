import { Inter } from "next/font/google";

// The one Inter instance. The root layout and the last resort error page (global-error.tsx) share
// it, so every page loads a single font stylesheet; a second instance in global-error gave a
// second stylesheet that every page preloaded and never used.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});
