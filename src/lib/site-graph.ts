// The studio and its founder as structured data, on every site page (src/app/(site)/layout.tsx).
// Other nodes reference them by @id. The founder's and the parent brand's @ids are shared with
// houseofsingh.com, the founder's own site, which owns those entities; this site describes the
// same person and brand.
import { STUDIO_EMAIL } from "@/lib/constants/contact";
import { FOUNDER_PROFILES, STUDIO_PROFILES, profileUrls } from "@/lib/constants/profiles";
import { AREA_SERVED, ORG_ID, PARENT_ORG_ID, PERSON_ID, orgRef, personRef } from "@/lib/schema";

// The parent brand, described briefly; houseofsingh.com carries its full node under the same @id.
const PARENT_ORG = {
  "@type": "Organization",
  "@id": PARENT_ORG_ID,
  name: "House of Singh",
  url: "https://houseofsingh.com",
  foundingDate: "2014",
  founder: personRef,
};

// The founder's professional body and fields, as stated on houseofsingh.com.
const RGD = { "@type": "Organization", name: "RGD (Registered Graphic Designers of Canada)", url: "https://rgd.ca" };
const FOUNDER_KNOWS_ABOUT = ["Brand identity", "Creative direction", "Art direction", "Photography", "Packaging design", "Web design"];

// No telephone: the studio publishes no phone number.
// founderImage: the About page founder portrait from Site Settings, as an absolute Sanity CDN URL.
// Without it (Sanity unreachable, or no portrait set) the Person node has no image.
export function siteGraph({ founderImage }: { founderImage?: string } = {}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": ORG_ID,
        name: "House of Singh Studios",
        url: "https://studios.houseofsingh.com",
        logo: "https://studios.houseofsingh.com/hos-studios-logo.svg",
        image: "https://studios.houseofsingh.com/share-image.png",
        description:
          "Brand identity and design studio in Toronto. We change how businesses are seen, chosen and valued through strategy, identity, digital design and visual media, led by creative direction, with AI built into how the studio works.",
        email: STUDIO_EMAIL,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Toronto",
          addressRegion: "ON",
          addressCountry: "CA",
        },
        areaServed: AREA_SERVED,
        knowsAbout: ["brand identity design", "rebranding", "brand strategy", "website design", "brand photography", "video production", "packaging design"],
        sameAs: profileUrls(STUDIO_PROFILES),
        founder: personRef,
        parentOrganization: PARENT_ORG,
        numberOfEmployees: { "@type": "QuantitativeValue", value: "1-10" },
        foundingDate: "2023",
        priceRange: "$$$$",
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Maninder Singh",
        url: "https://houseofsingh.com",
        description: "Creative director, photographer and multidisciplinary designer based in Toronto, Canada.",
        jobTitle: "Founder and Creative Director",
        honorificSuffix: "RGD",
        ...(founderImage ? { image: founderImage } : {}),
        worksFor: orgRef,
        memberOf: RGD,
        knowsAbout: FOUNDER_KNOWS_ABOUT,
        sameAs: profileUrls(FOUNDER_PROFILES),
      },
    ],
  };
}
