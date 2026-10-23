// Parallel suggestions and Commons nominations through the contact form. ?service=parallel and
// ?service=commons preselect the matching service option; any other value is ignored. Values equal labels, so they reach n8n and Airtable as
// plain text like every other service.
export const NOMINATION_SERVICES = {
  parallel: "Parallel suggestion",
  commons: "Commons nomination (pro bono)",
} as const;

export const NOMINATION_PLACEHOLDER = "Tell us about the brand or organization, and why.";

const values: readonly string[] = Object.values(NOMINATION_SERVICES);

// The service option to preselect for a ?service= value, or "" for none.
export function serviceFromQuery(value: unknown): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" && Object.hasOwn(NOMINATION_SERVICES, raw) ? NOMINATION_SERVICES[raw as keyof typeof NOMINATION_SERVICES] : "";
}

export const isNomination = (service: string) => values.includes(service);
