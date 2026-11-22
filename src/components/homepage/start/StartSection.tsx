// The homepage (04) Start: "Tell us about your business. We come to the call prepared." Approved on the
// canvas (desktop HomeStart2, phone HomeStart2Phone). It closes the homepage and replaced both "Two ways
// to start" and the dark call to action. A server component: the label, heading, line and the two door
// links are in the page source; the call brief (StartSheet) is a small client island, server rendered too.
//
// The discovery call link is tracked by the site wide discovery_call_click listener
// (src/components/GoogleAnalytics.tsx); nothing else is added here.
import IntentLink from "@/components/IntentLink";
import EditorialLabel from "@/components/ui/EditorialLabel";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { PULSE_HREF, START_COPY } from "@/lib/home-start";
import StartSheet from "./StartSheet";
import "./start.css";

export default function StartSection() {
  return (
    <section className="hs" aria-labelledby="hs-heading">
      <div className="hs-head">
        <EditorialLabel number={START_COPY.number} text={START_COPY.label} className="hs-label" />
        <h2 id="hs-heading" className="hs-heading">
          {START_COPY.heading}
        </h2>
        <p className="hs-sub">{START_COPY.sub}</p>
      </div>
      <StartSheet />
      <div className="hs-doors">
        <p className="hs-door">
          {START_COPY.pulseLead}{" "}
          <IntentLink href={PULSE_HREF} className="hs-door-link" data-cursor="link">
            {START_COPY.pulseLink}
          </IntentLink>
          . {START_COPY.pulseTail}
        </p>
        <p className="hs-door">
          {START_COPY.callLead}{" "}
          <a href={DISCOVERY_CALL_URL} className="hs-door-link" data-cursor="link" target="_blank" rel="noopener noreferrer">
            {START_COPY.callLink}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
