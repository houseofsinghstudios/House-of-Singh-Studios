import type { Metadata } from "next";
import ServicesOverviewClient from "@/components/services/ServicesOverviewClient";

export const metadata: Metadata = {
  title: "Services — House of Singh Studios",
  description:
    "Brand identity, visual media, digital design, and creative strategy for established businesses. Every service solves a business problem.",
};

export default function ServicesPage() {
  return <ServicesOverviewClient />;
}
