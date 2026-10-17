// Display names for discipline ids stored on projects. Shared by the filter bar and every tag list.

export const DISCIPLINE_LABELS: Record<string, string> = {
  "brand-identity": "Brand Identity",
  packaging: "Packaging",
  publication: "Publication",
  "art-direction": "Art Direction",
  website: "Website",
  video: "Video",
  photography: "Photography",
  "social-content": "Social Content",
  strategy: "Strategy",
};

export function disciplineLabel(id: string): string {
  return DISCIPLINE_LABELS[id] || id;
}
