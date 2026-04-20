import type { Metadata } from "next";
import ServicesClient from "@/components/services/ServicesClient";
import NextPageLink from "@/components/layout/NextPageLink";
import Button from "@/components/ui/Button";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { getAllProjectsGroupedByService } from "@/lib/sanity/projects";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Services',
  description: 'Brand identity, visual media, digital design, and creative strategy. Four capabilities built to solve business problems for established businesses.',
  alternates: { canonical: 'https://studios.houseofsingh.com/services' },
  openGraph: {
    title: 'Services — House of Singh Studios',
    description: 'Brand identity, visual media, digital design, and creative strategy. Four capabilities built to solve business problems.',
    url: 'https://studios.houseofsingh.com/services',
  },
};

export default async function ServicesPage() {
  const projectsByCategory = await getAllProjectsGroupedByService();
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Services', url: 'https://studios.houseofsingh.com/services' },
      ]} />
      <ServicesClient projectsByCategory={projectsByCategory} />
      <NextPageLink />
      <section
        className="css-reveal"
        style={{
          background: "var(--text-secondary)",
          color: "var(--bg)",
          padding: "clamp(100px, 12vw, 160px) var(--page-px)",
        }}
      >
        <div className="cta-centered">
          <h2 className="cta-heading">Ready to start a conversation?</h2>
          <div className="cta-buttons">
            <Button href="https://cal.com/houseofsinghstudios/hr" variant="primary-inverted" data-cursor="link" target="_blank" rel="noopener noreferrer">
              Book a Discovery Call
            </Button>
            <Button href="/packages" variant="secondary-inverted" data-cursor="link">
              View Packages
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
