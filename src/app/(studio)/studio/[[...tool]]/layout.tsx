// Sanity Studio runs in its own route group: no site chrome, no site CSS, no site scripts.
// The wrapper hands the Studio the whole viewport so its own panes do the scrolling,
// with the normal system cursor.
export const metadata = {
  // absolute: already names the studio, so the root title template must not append it again.
  title: { absolute: "Studio — House of Singh Studios CMS" },
  // The same as next-sanity's studio metadata: never indexed, and the Studio's address is not sent
  // to other sites as a referrer.
  robots: "noindex",
  referrer: "same-origin",
};

const studioStyles = `
  body { margin: 0; }
  #sanity-studio-root { position: fixed; inset: 0; height: 100dvh; overflow: hidden; }
`;

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{studioStyles}</style>
      <div id="sanity-studio-root">{children}</div>
    </>
  );
}
