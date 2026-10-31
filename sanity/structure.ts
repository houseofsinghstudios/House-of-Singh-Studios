import type { StructureResolver } from "sanity/structure";

// Service Pricing is a singleton: one document with the fixed id "servicePricing", opened directly
// instead of listed. Services (a reference copy of the code) and network members are listed under
// their own titles, by their order. Everything else is listed as before.
export const SINGLETONS = ["servicePricing"];

// Types the site never reads: hidden from the desk and from every "create new" menu. Their schemas
// and any existing documents stay (nothing is deleted). Testimonials and package prices live in the
// code (src/lib/constants/homepage-data.ts, src/data/packages.ts).
export const HIDDEN_TYPES = ["testimonial", "teamMember", "package"];

const ORDERED_LISTS: Record<string, string> = {
  service: "Services (reference copy)",
  networkMember: "Network members",
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
          const title = ORDERED_LISTS[id];
          return title
            ? item.title(title).child(S.documentTypeList(id).title(title).defaultOrdering([{ field: "order", direction: "asc" }]))
            : item;
        }),
    ]);
