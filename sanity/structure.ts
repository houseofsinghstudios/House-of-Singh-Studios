import type { StructureResolver } from "sanity/structure";

// Service Pricing is a singleton: one document with the fixed id "servicePricing", opened directly
// instead of listed. Services are a reference copy of the code, listed by their order. Everything
// else is listed as before.
export const SINGLETONS = ["servicePricing"];

const SERVICES_TITLE = "Services (reference copy)";

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
        .filter((item) => !SINGLETONS.includes(item.getId() ?? ""))
        .map((item) =>
          item.getId() === "service"
            ? item
                .title(SERVICES_TITLE)
                .child(S.documentTypeList("service").title(SERVICES_TITLE).defaultOrdering([{ field: "order", direction: "asc" }]))
            : item
        ),
    ]);
