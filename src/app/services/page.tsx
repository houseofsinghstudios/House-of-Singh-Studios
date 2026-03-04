import type { Metadata } from "next";
import ServicesOverviewClient from "@/components/services/ServicesOverviewClient";

export const metadata: Metadata = {
  title: "Services — House of Singh Studios",
  description:
    "Four capabilities. One studio. Brand identity, visual media, digital design, and creative strategy built to solve business problems.",
};

export default function ServicesPage() {
  return <ServicesOverviewClient />;
}
