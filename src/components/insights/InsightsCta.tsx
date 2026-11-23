// The dark call to action at the foot of /insights and /insights/page/N.

import Button from "@/components/ui/Button";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";

export default function InsightsCta() {
  return (
    <section
      className="css-reveal"
      style={{
        background: "var(--text-primary)",
        color: "var(--bg)",
        padding: "120px var(--page-px)",
      }}
    >
      <div className="cta-centered">
        <p className="cta-label">(Next step)</p>
        <h2 className="cta-heading">Have a project in mind?</h2>
        <div className="cta-buttons">
          <Button href={DISCOVERY_CALL_URL} variant="primary-inverted" data-cursor="link" target="_blank" rel="noopener noreferrer">
            Book a discovery call
          </Button>
          <Button href="/start" variant="secondary-inverted" data-cursor="link">
            Plan your project
          </Button>
        </div>
      </div>
    </section>
  );
}
