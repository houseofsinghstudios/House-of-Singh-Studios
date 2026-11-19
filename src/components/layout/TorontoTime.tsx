"use client";
// A client component: it shows the live time, which only the browser can know. Rendered after
// mount only (the server and the first render show a blank of the same width), so the server and
// the browser never disagree. Refreshes every 15 seconds while "active" (the drawer is open).

import { useEffect, useState } from "react";
import { torontoTime, type TorontoTime as Parts } from "@/lib/toronto-time";

const REFRESH_MS = 15_000;

export default function TorontoTime({ active }: { active: boolean }) {
  const [time, setTime] = useState<Parts | null>(null);

  useEffect(() => {
    if (!active) return;
    const tick = () => setTime(torontoTime(new Date()));
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, REFRESH_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [active]);

  if (!time) return <span className="menu-drawer-value menu-drawer-time">&nbsp;</span>;
  return (
    <span className="menu-drawer-value menu-drawer-time">
      {time.hour}
      {/* Dims once every 2 seconds (opacity only, so screen readers still read the colon). */}
      <span className="menu-drawer-colon">:</span>
      {time.minute} {time.dayPeriod} {time.zone}
    </span>
  );
}
