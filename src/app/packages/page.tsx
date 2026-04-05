import type { Metadata } from "next";
import PackagesClient from "@/components/packages/PackagesClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: 'Packages',
  description: 'Clear scope. Defined deliverables. No surprises. Brand identity packages starting at $4,000 CAD for established businesses.',
  alternates: { canonical: 'https://studios.houseofsingh.com/packages' },
  openGraph: {
    title: 'Packages — House of Singh Studios',
    description: 'Clear scope. Defined deliverables. No surprises. Brand identity packages starting at $4,000 CAD.',
    url: 'https://studios.houseofsingh.com/packages',
  },
};

export default function PackagesPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Packages', url: 'https://studios.houseofsingh.com/packages' },
      ]} />
      <PackagesClient />
    </>
  );
}
