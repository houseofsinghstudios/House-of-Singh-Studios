// A value read from Sanity or a request as trimmed text: anything that is not a string is empty.
// One copy for every module that reads loose data (audit finding 29, 22 Nov 2026).
export const asText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
