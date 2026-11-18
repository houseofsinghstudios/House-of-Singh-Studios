import { permanentRedirect } from "next/navigation";

// /insights/page on its own is not a page: the archive starts at /insights (page 1), then
// /insights/page/2. Sent to /insights so the address never shows an empty page or an article 404.
export default function InsightsPageIndex() {
  permanentRedirect("/insights");
}
