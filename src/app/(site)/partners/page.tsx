import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import PartnersPage from "@/components/partners/PartnersPage";
import { PARTNERS } from "@/lib/partners/content";
import { DEFAULT_SHARE_IMAGE, studioTitle } from "@/lib/seo";

const URL = "https://studios.houseofsingh.com/partners";

export const metadata: Metadata = {
  title: PARTNERS.title,
  description: PARTNERS.description,
  alternates: { canonical: URL },
  openGraph: { title: studioTitle(PARTNERS.title), description: PARTNERS.description, url: URL, images: [DEFAULT_SHARE_IMAGE] },
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://studios.houseofsingh.com" },
        { name: "Partners", url: URL },
      ]} />
      <PartnersPage />
    </>
  );
}
