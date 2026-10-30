import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import { client } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import { getNetworkMembers } from "@/lib/sanity/network";
import { readSanity } from "@/lib/sanity/resilience";
import AboutClient from "@/components/about/AboutClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { PAGE_DESCRIPTIONS } from "@/lib/page-descriptions";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About',
  description: PAGE_DESCRIPTIONS.about,
  alternates: { canonical: 'https://studios.houseofsingh.com/about' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'About — House of Singh Studios',
    description: 'A multidisciplinary design studio built by Maninder Singh. Design should be structured, intentional, and commercially effective.',
    url: 'https://studios.houseofsingh.com/about',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

// A failed read follows readSanity: while building (or without Sanity) the page renders with
// AboutClient's built-in copy; at runtime the last good page stays until Sanity is back.
async function getAboutData() {
  return readSanity("about page", () => client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } }), () => undefined);
}

export default async function AboutPage() {
  const [aboutData, networkMembers] = await Promise.all([getAboutData(), getNetworkMembers()]);
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'About', url: 'https://studios.houseofsingh.com/about' },
      ]} />
      <AboutClient aboutData={aboutData} networkMembers={networkMembers} />
    </>
  );
}
