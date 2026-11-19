// The homepage hero. A server component: it builds each image's URL with the Studio crop (the
// Sanity image builder stays on the server) and hands plain data to HeroInteractive, which owns
// everything that moves: the rotating images, the caption and the cycling word in the value line.
//
// With no hero projects the hero shows the text column only, beside an empty Cloudy White column.

import EditorialLabel from "@/components/ui/EditorialLabel";
import { heroImageUrl } from "@/lib/sanity/image";
import { heroObjectPosition, type HeroEntry, type HeroProject } from "@/lib/homepage-hero";
import HeroInteractive from "./HeroInteractive";
import "./hero.css";

// One image per project: its first hero image (the query keeps only projects that have one).
function heroEntry(project: HeroProject): HeroEntry {
  const image = project.heroImages[0];
  return {
    slug: project.slug,
    heroName: project.heroName,
    heroLine: project.heroLine,
    heroFit: project.heroFit,
    image: {
      src: heroImageUrl(image),
      alt: image.alt,
      ...(image.lqip ? { lqip: image.lqip } : {}),
      position: heroObjectPosition(image),
    },
  };
}

export default function HeroSection({ projects }: { projects: HeroProject[] }) {
  const entries = projects.map(heroEntry);
  return (
    <section className={`hero${entries.length === 0 ? " hero--empty" : ""}`}>
      <h1 className="sr-only">
        House of Singh Studios, Toronto: brand identity, visual design and creative direction
      </h1>
      <div className="hero-eyebrow">
        <EditorialLabel text="Brand identity studio, Toronto" />
      </div>
      <HeroInteractive entries={entries} />
    </section>
  );
}
