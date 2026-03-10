import type { Metadata } from "next";
import WorkPageClient from "@/components/work/WorkPageClient";

export const metadata: Metadata = {
  title: "Work — House of Singh Studios",
  description:
    "Selected work across brand identity, visual media, and digital design. Case studies from House of Singh Studios.",
};

export default function WorkPage() {
  return <WorkPageClient />;
}
