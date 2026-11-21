// (02) What we do: the four services and their thirty disciplines, approved on the canvas (desktop
// WWDSideBySide, phone WWDPhoneM1). A server component: the label, the heading and the intro line are in
// the page source as they are; the keyword field and the service rows (WhatWeDo) are a client island,
// server rendered too, so every word, row and panel is in the HTML.
//
// Every word comes from src/data/services.ts; every count is derived from it, so the heading stays
// true when a discipline is added. The real work behind a discipline comes from the Studio "What we
// do" fieldset (getWhatWeDoWork); without it, the word is plain text.
import EditorialLabel from "@/components/ui/EditorialLabel";
import { services } from "@/data/services";
import { serviceTopic } from "@/lib/service-names";
import { interleave, wwdHeading, type WwdService, type WwdWork } from "@/lib/what-we-do";
import WhatWeDo from "./WhatWeDo";
import "./wwd.css";

// Only what the section shows, so the browser gets no other service copy.
function wwdServices(): WwdService[] {
  return services.map((s) => ({
    slug: s.slug,
    number: s.number,
    name: s.name,
    tagline: s.tagline,
    description: s.description,
    disciplines: s.deliverables.map((d) => ({ name: d.name, description: d.description })),
  }));
}

export default function WhatWeDoSection({ work }: { work: Record<string, WwdWork> }) {
  const list = wwdServices();
  const topics = Object.fromEntries(list.map((s) => [s.slug, serviceTopic(s.slug) ?? ""]));
  return (
    <section className="wwd" aria-labelledby="wwd-heading">
      <div className="wwd-head">
        <EditorialLabel number="02" text="What we do" className="wwd-label" />
        <div className="wwd-intro">
          <h2 id="wwd-heading" className="wwd-heading">{wwdHeading(list)}</h2>
          <p className="wwd-line wwd-line--desktop">
            Everything we make is built to work as one system, from the strategy to the last business card.
          </p>
          <p className="wwd-line wwd-line--phone">Everything we make is built to work as one system.</p>
        </div>
      </div>
      <WhatWeDo services={list} terms={interleave(list)} work={work} topics={topics} />
    </section>
  );
}
