// What the /work index sends to the browser for each project: built on the server (src/app/(site)/
// work/page.tsx) from getIndexProjects, with finished image URLs and focal points, so the client
// island needs no Sanity code.
import type { BuyerDisciplineId, SectorId } from "@/lib/work-index";

export interface WorkImage {
  // The Studio crop already applied (heroImageUrl); width and height are the cropped proportions.
  src: string;
  width: number;
  height: number;
  alt: string;
  lqip?: string;
  // The hotspot as CSS object-position (heroObjectPosition).
  position: string;
}

export interface WorkItem {
  slug: string;
  title: string;
  // The project's place in the default order, 1 based: the number in the margin and the frame code.
  number: number;
  sector: SectorId;
  disciplines: BuyerDisciplineId[];
  // "Food and drink. Identity, packaging and photography."
  meta: string;
  year: number | null;
  // "Exploration", "Parallel" or "Commons" after the year; null for client work.
  typeLabel: string | null;
  // "Client work" or "Studio exploration" under the image window.
  kind: string;
  line: string;
  images: WorkImage[];
}
