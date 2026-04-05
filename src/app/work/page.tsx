import type { Metadata } from "next";
import WorkPageClient from "@/components/work/WorkPageClient";

export const metadata: Metadata = {
  title: 'Work',
  description: 'Brand identities, visual narratives, and digital experiences for businesses ready to show up differently. View our portfolio.',
  alternates: { canonical: 'https://studios.houseofsingh.com/work' },
  openGraph: {
    title: 'Work — House of Singh Studios',
    description: 'Brand identities, visual narratives, and digital experiences. View our portfolio.',
    url: 'https://studios.houseofsingh.com/work',
  },
};

export default function WorkPage() {
  return <WorkPageClient />;
}
