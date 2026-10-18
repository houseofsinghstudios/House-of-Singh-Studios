import type { StructureResolver } from "sanity/structure";

// Service Pricing is a singleton: one document with the fixed id "servicePricing", opened directly
// instead of listed. Everything else is listed as before.
export const SINGLETONS = ["servicePricing"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Service Pricing")
        .id("servicePricing")
        .child(S.document().schemaType("servicePricing").documentId("servicePricing").title("Service Pricing")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() ?? "")),
    ]);
