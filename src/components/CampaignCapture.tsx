"use client";
// Stores first touch campaign tags (utm_source, utm_medium, utm_campaign) for the visit, on whichever
// public page the visitor lands. Client component: it reads the address and sessionStorage.
// Renders nothing. The rules live in src/lib/campaign.ts.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { rememberFirstTouch, sessionStore } from "@/lib/campaign";

export default function CampaignCapture() {
  const pathname = usePathname();
  useEffect(() => {
    rememberFirstTouch(window.location.search, sessionStore());
  }, [pathname]);
  return null;
}
