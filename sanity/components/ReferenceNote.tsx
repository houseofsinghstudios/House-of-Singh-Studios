// The read only note at the top of every service document: the site reads services from the code,
// so editors know a change here does not appear on the site yet. It replaces the whole field, so
// the note stores nothing. Plain elements with Studio's own colour variables, so it reads in light
// and dark mode without a UI dependency.

export const REFERENCE_NOTE =
  "Reference copy. The website currently reads services from the code (src/data/services.ts). Changes made here will not appear on the site until services are switched to Sanity.";

export function ReferenceNote() {
  return (
    <div
      role="note"
      style={{
        border: "1px solid #c99a2e",
        background: "rgba(232, 182, 64, 0.16)",
        color: "var(--card-fg-color, inherit)",
        padding: "16px 20px",
        fontSize: 15,
        lineHeight: 1.5,
        fontWeight: 600,
      }}
    >
      {REFERENCE_NOTE}
    </div>
  );
}
