export const metadata = {
  title: "Studio — House of Singh Studios CMS",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="sanity-studio-root">
      <style>{`
        /* Hide ALL site chrome in Sanity Studio */
        .site-header,
        header,
        footer,
        .footer-reveal,
        .scroll-progress,
        .custom-cursor-dot,
        .custom-cursor-ring,
        [data-cursor],
        .page-transition-overlay,
        .scroll-indicator-pulse {
          display: none !important;
        }
        /* Reset body for studio */
        body {
          overflow: auto !important;
        }
        /* Make studio take full viewport */
        #sanity-studio-root {
          min-height: 100vh;
          position: relative;
          z-index: 9999;
          background: #101112;
        }
        /* Hide any main wrapper padding */
        main {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}
