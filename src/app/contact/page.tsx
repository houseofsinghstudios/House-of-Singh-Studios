import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

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

export default function ContactPage() {
  return <ContactClient />;
}
