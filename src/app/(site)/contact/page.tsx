import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { serviceFromQuery } from "@/lib/initiatives/nominations";

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a conversation with House of Singh Studios. Book a discovery call or send us a message about your project.',
  alternates: { canonical: 'https://studios.houseofsingh.com/contact' },
  openGraph: {
    title: 'Contact — House of Singh Studios',
    description: 'Start a conversation. Book a discovery call or send us a message about your project.',
    url: 'https://studios.houseofsingh.com/contact',
  },
};

type Props = { searchParams: Promise<{ service?: string | string[] }> };

// ?service=parallel or ?service=commons preselects a nomination; anything else is ignored.
export default async function ContactPage({ searchParams }: Props) {
  const { service } = await searchParams;
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Contact', url: 'https://studios.houseofsingh.com/contact' },
      ]} />
      <ContactClient initialService={serviceFromQuery(service)} />
    </>
  );
}
