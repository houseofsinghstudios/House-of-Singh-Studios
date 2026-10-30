import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import ContactClient from "@/components/contact/ContactClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { contactServiceFromQuery } from "@/lib/partners/forms";
import { PAGE_DESCRIPTIONS } from "@/lib/page-descriptions";

export const metadata: Metadata = {
  title: 'Contact',
  description: PAGE_DESCRIPTIONS.contact,
  alternates: { canonical: 'https://studios.houseofsingh.com/contact' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'Contact — House of Singh Studios',
    description: 'Start a conversation. Book a discovery call or send us a message about your project.',
    url: 'https://studios.houseofsingh.com/contact',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

type Props = { searchParams: Promise<{ service?: string | string[] }> };

// ?service=parallel or ?service=commons preselects a nomination, ?service=introduction or
// ?service=partnership a partner enquiry; anything else is ignored.
export default async function ContactPage({ searchParams }: Props) {
  const { service } = await searchParams;
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Contact', url: 'https://studios.houseofsingh.com/contact' },
      ]} />
      <ContactClient initialService={contactServiceFromQuery(service)} />
    </>
  );
}
