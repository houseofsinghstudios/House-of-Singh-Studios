"use client";
// One Google Analytics event per Partners call to action: partner_cta_click with the action
// (introduce or partner) and where it sits (hero or band). Client component: it listens for clicks
// on links marked data-partner-action. Renders nothing.

import { useEffect } from "react";
import { trackPartner } from "./track";

export default function PartnerEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLElement>("[data-partner-action]");
      if (!link) return;
      trackPartner("partner_cta_click", { action: link.dataset.partnerAction || "", location: link.dataset.partnerLocation || "" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
