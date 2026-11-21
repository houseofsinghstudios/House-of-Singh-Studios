"use client";
// A client component: the four services as accordion rows. Each row is an h3 holding a button; one
// row is open at a time. A closed panel stays in the page source but is inert. The panel holds a
// desktop layout (tagline, description and detail link; the lit words in the field beside it show the
// disciplines) and a phone layout (tagline, the service's own disciplines as tappable words, then the
// detail link); CSS shows one.

import { Link } from "next-view-transitions";
import { track } from "@/lib/analytics";
import { countLabel, detailLinkText, serviceHref, type WwdService, type WwdWork } from "@/lib/what-we-do";
import WwdPhoneWords from "./WwdPhoneWords";

interface Props {
  services: WwdService[];
  work: Record<string, WwdWork>;
  topics: Record<string, string>;
  open: number | null;
  onToggle: (index: number) => void;
  // A field word pointed at: the other services' names turn Accessible Ash.
  litWord: string | null;
  onRowLight: (slug: string) => void;
  onRowsLeave: () => void;
}

const isMouse = (e: React.PointerEvent) => e.pointerType === "mouse";

// "Brand Identity and Visual Design in detail", then the service's topic as hidden text, so the
// link's name starts with what it shows (protected: moved here from the old Capabilities rows).
function DetailLink({ service, topic }: { service: WwdService; topic: string }) {
  return (
    <Link href={serviceHref(service.slug)} className="wwd-detail" data-cursor="link" onClick={() => track("home_service_click", { service: service.slug })}>
      {detailLinkText(service.name)}
      {topic && <span className="sr-only">: {topic}</span>}
    </Link>
  );
}

function DesktopPanel({ service, topic }: { service: WwdService; topic: string }) {
  return (
    <div className="wwd-panel-desktop">
      <p className="wwd-tagline">{service.tagline}</p>
      <p className="wwd-desc">{service.description}</p>
      <DetailLink service={service} topic={topic} />
    </div>
  );
}

export default function WwdRows({ services, work, topics, open, onToggle, litWord, onRowLight, onRowsLeave }: Props) {
  return (
    <div className="wwd-rows" onPointerLeave={(e) => isMouse(e) && onRowsLeave()}>
      {services.map((s, i) => {
        const isOpen = open === i;
        const panelId = `wwd-panel-${s.slug}`;
        return (
          <div key={s.slug} className="wwd-row" data-dim={litWord !== null && litWord !== s.slug ? true : undefined} onPointerEnter={(e) => isMouse(e) && onRowLight(s.slug)}>
            <h3 className="wwd-row-h">
              <button
                type="button"
                className="wwd-row-btn"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(i)}
                onFocus={() => onRowLight(s.slug)}
                onBlur={onRowsLeave}
              >
                <span className="wwd-num">{s.number}</span>
                <span className="wwd-name">{s.name}</span>
                <span className="wwd-count">
                  {countLabel(s.disciplines.length)}
                  <span className="sr-only"> disciplines</span>
                  <span className="wwd-plus" aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div id={panelId} className="wwd-panel" data-open={isOpen} inert={!isOpen}>
              <div className="wwd-panel-clip">
                <div className="wwd-panel-body">
                  <DesktopPanel service={s} topic={topics[s.slug] ?? ""} />
                  <div className="wwd-panel-phone">
                    <p className="wwd-tagline">{s.tagline}</p>
                    {/* Keyed by the open state: closing the row also closes its word card. */}
                    <WwdPhoneWords key={`${s.slug}-${isOpen}`} service={s} work={work} />
                    <DetailLink service={s} topic={topics[s.slug] ?? ""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
