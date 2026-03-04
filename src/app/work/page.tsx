import type { Metadata } from "next";
import WorkPageClient from "@/components/work/WorkPageClient";

export const metadata: Metadata = {
  title: "Work — House of Singh Studios",
  description:
    "Brand identities, visual narratives, and digital experiences for businesses ready to show up differently.",
};

export default function WorkPage() {
  return <WorkPageClient />;
}
