import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import { getAllRoles } from "@/lib/sanity/queries";
import CareersClient from "@/components/careers/CareersClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Freelance and contract roles in brand design, photography, video and editing with House of Singh Studios, in Toronto, the GTA or remotely.',
  alternates: { canonical: 'https://studios.houseofsingh.com/careers' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'Careers — House of Singh Studios',
    description: 'Freelance and contract roles in brand design, photography, video and editing with House of Singh Studios, in Toronto, the GTA or remotely.',
    url: 'https://studios.houseofsingh.com/careers',
    images: [DEFAULT_SHARE_IMAGE],
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

// A failed read follows readSanity (in getAllRoles): while building the page renders its "No open
// roles" state; at runtime the last good page stays until Sanity is back.
async function getRoles(): Promise<Role[]> {
  // Titles are trimmed here so a stray space typed in Studio never shows on the card
  // or in the apply form.
  const roles: Role[] = (await getAllRoles()) || [];
  return roles.map((role) => ({ ...role, title: (role.title || "").trim() }));
}

// No JobPosting structured data: Google requires one posting per page, and roles have no pages
// of their own. Add it back only with a page per role.
export default async function CareersPage() {
  const roles = await getRoles();

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Careers', url: 'https://studios.houseofsingh.com/careers' },
      ]} />
      <CareersClient roles={roles} />
    </>
  );
}
