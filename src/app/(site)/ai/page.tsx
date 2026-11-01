import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import AILabClient from "@/components/ai/AILabClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { PAGE_DESCRIPTIONS } from "@/lib/page-descriptions";

export const metadata: Metadata = {
  title: 'AI Lab',
  description: PAGE_DESCRIPTIONS.ai,
  alternates: { canonical: 'https://studios.houseofsingh.com/ai' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'AI Lab — House of Singh Studios',
    description: PAGE_DESCRIPTIONS.ai,
    url: 'https://studios.houseofsingh.com/ai',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

export default function AILabPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'AI Lab', url: 'https://studios.houseofsingh.com/ai' },
      ]} />
      <AILabClient />
    </>
  );
}
