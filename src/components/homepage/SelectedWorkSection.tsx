// (01) Selected work: a short Living Index of six projects (HomeWorkIndex). Server rendered: the page
// source carries the sentence (the section's h2) and the six project names (h3 links) in the default
// order; the client island only reorders them after a choice. Nothing in it is priority or loads with
// the hero image (the LCP).
import EditorialLabel from "@/components/ui/EditorialLabel";
import HomeWorkIndex from "@/components/work/index/HomeWorkIndex";
import { toWorkItem } from "@/components/work/index/work-items";
import type { WorkItem } from "@/components/work/index/types";
import { homeOrders, type IndexProject } from "@/lib/work-index";

// As on /work, without the blurred placeholders: the window here waits for intent, so they would only
// add weight to the page's first download, which carries the hero image.
function homeItem(project: IndexProject, index: number): WorkItem {
  const item = toWorkItem(project, index);
  return { ...item, images: item.images.map((image) => ({ ...image, lqip: undefined })) };
}

// The section is named by its h2, "See our work for your kind of business." (homepage audit H-19).
const HEADING_ID = "selected-work-heading";

export default function SelectedWorkSection({ projects }: { projects: IndexProject[] }) {
  const orders = homeOrders(projects);
  if (orders.all.length === 0) return null;
  return (
    <section className="hw-section css-reveal" aria-labelledby={HEADING_ID}>
      <HomeWorkIndex items={projects.map(homeItem)} orders={orders} label={<EditorialLabel number="01" text="Selected work" />} headingId={HEADING_ID} />
    </section>
  );
}
