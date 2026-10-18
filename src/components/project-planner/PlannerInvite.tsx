// The Services page invitation to the planner, placed before the final contact block. Server rendered.
import Link from "next/link";
import Button from "@/components/ui/Button";
import { PLACEMENTS } from "@/lib/project-planner/content";
import { startHref } from "@/lib/project-planner/start-links";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import "./planner.css";

export default function PlannerInvite() {
  return (
    <section className="pp-invite" aria-labelledby="pp-invite-heading">
      <div className="pp-invite-inner">
        <h2 id="pp-invite-heading" className="pp-question">{PLACEMENTS.servicesHeading}</h2>
        <p className="pp-text">{PLACEMENTS.servicesText}</p>
        <div className="pp-btn">
          <Button href={startHref("services")} variant="primary" data-cursor="link">{PLACEMENTS.servicesButton}</Button>
        </div>
        <p className="pp-small">
          <Link href={DISCOVERY_CALL_URL} className="pp-link" target="_blank" rel="noopener noreferrer">{PLACEMENTS.servicesTalk}</Link>
        </p>
      </div>
    </section>
  );
}
