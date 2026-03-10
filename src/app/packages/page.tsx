import type { Metadata } from "next";
import PackagesClient from "@/components/packages/PackagesClient";

export const metadata: Metadata = {
  title: "Packages — House of Singh Studios",
  description:
    "Brand identity packages starting at $4,000 CAD. Clear scope, defined deliverables, no surprises. View pricing for Brand Foundation, Brand Identity System, and Brand Ecosystem.",
};

export default function PackagesPage() {
  return <PackagesClient />;
}
