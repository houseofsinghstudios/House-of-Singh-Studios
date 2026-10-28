"use client";
// Stores first touch campaign tags (utm_source, utm_medium, utm_campaign) for the visit, on whichever
// public page the visitor lands, and the lead source: where the session began, sent only with an
// enquiry. Client component: it reads the address, the referrer and sessionStorage. Renders nothing.
// The rules live in src/lib/campaign.ts and src/lib/lead-source.ts.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { rememberFirstTouch, sessionStore } from "@/lib/campaign";
import { rememberLeadSource } from "@/lib/lead-source";

export default function CampaignCapture() {
  const pathname = usePathname();
  useEffect(() => {
    rememberFirstTouch(window.location.search, sessionStore());
    rememberLeadSource(window.location.href, document.referrer, sessionStore());
  }, [pathname]);
  return null;
}
