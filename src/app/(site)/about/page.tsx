import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import { client } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import { getNetworkMembers } from "@/lib/sanity/network";
import AboutClient from "@/components/about/AboutClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About',
  description: 'A multidisciplinary design studio built by Maninder Singh. Design should be structured, intentional, and commercially effective.',
  alternates: { canonical: 'https://studios.houseofsingh.com/about' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'About — House of Singh Studios',
    description: 'A multidisciplinary design studio built by Maninder Singh. Design should be structured, intentional, and commercially effective.',
    url: 'https://studios.houseofsingh.com/about',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

// If Sanity is unreachable the page renders with AboutClient's built-in copy instead of
// failing the build or the request, and refreshes once Sanity is back.
async function getAboutData() {
  try {
    return await client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } });
  } catch (error) {
    console.warn("[about] Sanity fetch failed, rendering with fallback content:", error instanceof Error ? error.name : "unknown error");
    return undefined;
  }
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
