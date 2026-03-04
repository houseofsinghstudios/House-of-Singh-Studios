import type { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "About — House of Singh Studios",
  description:
    "A system-led design studio built on creative direction, structured processes, and AI-powered infrastructure. Toronto.",
};

export default function AboutPage() {
  return <AboutClient />;
}
