import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import AILabClient from "@/components/ai/AILabClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: 'AI Lab',
  description: 'How AI powers House of Singh Studios. Faster delivery, sharper consistency, creative direction that stays human.',
  alternates: { canonical: 'https://studios.houseofsingh.com/ai' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'AI Lab — House of Singh Studios',
    description: 'How AI powers House of Singh Studios. Faster delivery, sharper consistency, creative direction that stays human.',
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
