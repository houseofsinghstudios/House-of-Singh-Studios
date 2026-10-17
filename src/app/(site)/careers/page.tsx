import type { Metadata } from "next";
import { getAllRoles } from "@/lib/sanity/queries";
import CareersClient from "@/components/careers/CareersClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join House of Singh Studios. We work with specialists who raise the standard.',
  alternates: { canonical: 'https://studios.houseofsingh.com/careers' },
  openGraph: {
    title: 'Careers — House of Singh Studios',
    description: 'Join House of Singh Studios. We work with specialists who raise the standard.',
    url: 'https://studios.houseofsingh.com/careers',
  },
};

interface Role {
  _id: string;
  title: string;
  slug: { current: string };
  department: string;
  type: string;
  location?: string;
  summary: string;
  publishedAt?: string;
}

// If Sanity is unreachable the page renders its "No open roles" state instead of failing
// the build or the request, and refreshes once Sanity is back.
async function getRoles(): Promise<Role[]> {
  try {
    // Titles are trimmed here so a stray space typed in Studio never shows on the card,
    // the apply form or the job posting data.
    const roles: Role[] = (await getAllRoles()) || [];
    return roles.map((role) => ({ ...role, title: (role.title || "").trim() }));
  } catch (error) {
    console.warn("[careers] Sanity fetch failed, rendering with no roles:", error instanceof Error ? error.name : "unknown error");
    return [];
  }
}

export default async function CareersPage() {
  const roles = await getRoles();

  return (
    <>
      {roles.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              roles.map((role) => ({
                "@context": "https://schema.org",
                "@type": "JobPosting",
                title: role.title,
                description: role.summary,
                datePosted: role.publishedAt,
                employmentType:
                  role.type === "full-time"
                    ? "FULL_TIME"
                    : role.type === "part-time"
                      ? "PART_TIME"
                      : "CONTRACTOR",
                hiringOrganization: {
                  "@type": "Organization",
                  name: "House of Singh Studios",
                  sameAs: "https://studios.houseofsingh.com",
                },
                jobLocation: {
                  "@type": "Place",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Toronto",
                    addressRegion: "ON",
                    addressCountry: "CA",
                  },
                },
                jobLocationType: "TELECOMMUTE",
              }))
            ),
          }}
        />
      )}
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Careers', url: 'https://studios.houseofsingh.com/careers' },
      ]} />
      <CareersClient roles={roles} />
    </>
  );
}
