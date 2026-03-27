import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import AboutClient from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "About — House of Singh Studios",
  description:
    "A multidisciplinary design studio built on structured process, creative direction, and AI-powered production. Founded by Maninder Singh. Based in Toronto.",
};

export default async function AboutPage() {
  const aboutData = await client.fetch(aboutPageQuery);
  return <AboutClient aboutData={aboutData} />;
}
