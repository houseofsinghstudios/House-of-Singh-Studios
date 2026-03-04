import type { Metadata } from "next";
import { getAllRoles } from "@/lib/sanity/queries";
import CareersClient from "@/components/careers/CareersClient";

export const metadata: Metadata = {
  title: "Careers — House of Singh Studios",
  description:
    "Open roles at House of Singh Studios. We are looking for designers, strategists, and producers who build brands that hold up.",
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

export default async function CareersPage() {
  const roles: Role[] = (await getAllRoles()) || [];

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
      <CareersClient roles={roles} />
    </>
  );
}
