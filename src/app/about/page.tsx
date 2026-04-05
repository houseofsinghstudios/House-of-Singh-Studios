import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import AboutClient from "@/components/about/AboutClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About',
  description: 'A multidisciplinary design studio built by Maninder Singh. Design should be structured, intentional, and commercially effective.',
  alternates: { canonical: 'https://studios.houseofsingh.com/about' },
  openGraph: {
    title: 'About — House of Singh Studios',
    description: 'A multidisciplinary design studio built by Maninder Singh. Design should be structured, intentional, and commercially effective.',
    url: 'https://studios.houseofsingh.com/about',
  },
};

export default async function AboutPage() {
  const aboutData = await client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } });
  return <AboutClient aboutData={aboutData} />;
}
