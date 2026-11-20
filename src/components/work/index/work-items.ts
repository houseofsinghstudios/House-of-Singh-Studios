// What the browser gets for each project in a Living Index (/work and the homepage's Selected work):
// finished image URLs (the Studio crop applied), cropped proportions and focal points, and the words
// already chosen. No case study text. Server only: the image URL builder stays on the server.
import { heroImageUrl } from "@/lib/sanity/image";
import { heroObjectPosition } from "@/lib/homepage-hero";
import { projectTypeLabel } from "@/lib/initiatives/types";
import { projectMeta, workKindLabel, type IndexProject } from "@/lib/work-index";
import type { WorkItem } from "./types";

export function toWorkItem(project: IndexProject, index: number): WorkItem {
  return {
    slug: project.slug,
    title: project.title,
    number: index + 1,
    sector: project.sector,
    disciplines: project.disciplines,
    meta: projectMeta(project),
    year: project.year,
    typeLabel: projectTypeLabel(project.projectType),
    kind: workKindLabel(project.projectType),
    line: project.line,
    images: project.images.map((image, i) => {
      const c = image.crop;
      return {
        src: heroImageUrl(image),
        width: Math.round(image.width * (c ? 1 - c.left - c.right : 1)),
        height: Math.round(image.height * (c ? 1 - c.top - c.bottom : 1)),
        alt: image.alt,
        // The blurred placeholder for the first image only: the one the window opens on.
        ...(i === 0 && image.lqip ? { lqip: image.lqip } : {}),
        position: heroObjectPosition(image),
      };
    }),
  };
}
