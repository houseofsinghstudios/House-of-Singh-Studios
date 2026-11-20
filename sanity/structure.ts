import type { StructureResolver } from "sanity/structure";

// Service Pricing is a singleton: one document with the fixed id "servicePricing", opened directly
// instead of listed. Services (a reference copy of the code) and network members are listed under
// their own titles, by their order. Everything else is listed as before.
export const SINGLETONS = ["servicePricing"];

// Types the site never reads: hidden from the desk and from every "create new" menu. Their schemas
// and any existing documents stay (nothing is deleted). Package timelines live in the code
// (src/data/packages.ts). Testimonials are listed again since the homepage Proof reads them.
export const HIDDEN_TYPES = ["teamMember", "package"];

const ORDERED_LISTS: Record<string, string> = {
  service: "Services (reference copy)",
  networkMember: "Network members",
};

// Listed under a plural title of their own.
const TITLED_LISTS: Record<string, string> = {
  testimonial: "Testimonials",
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Service Pricing")
        .id("servicePricing")
        .child(S.document().schemaType("servicePricing").documentId("servicePricing").title("Service Pricing")),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((item) => ![...SINGLETONS, ...HIDDEN_TYPES].includes(item.getId() ?? ""))
        .map((item) => {
          const id = item.getId() ?? "";
          const ordered = ORDERED_LISTS[id];
          if (ordered) return item.title(ordered).child(S.documentTypeList(id).title(ordered).defaultOrdering([{ field: "order", direction: "asc" }]));
          const titled = TITLED_LISTS[id];
          return titled ? item.title(titled).child(S.documentTypeList(id).title(titled)) : item;
        }),
    ]);
