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
        /* Hide site chrome in Sanity Studio */
        .site-header,
        header,
        footer,
        .ft-footer,
        .ft-reveal,
        .next-page-link,
        .scroll-progress,
        .custom-cursor-dot,
        .custom-cursor-ring,
        .page-transition-overlay,
        .scroll-indicator-pulse,
        .site-content-wrap > footer {
          display: none !important;
        }
        /* Reset body */
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
        /* Ensure main is visible for studio */
        main {
          padding: 0 !important;
          margin: 0 !important;
        }
        .site-content-wrap {
          display: block !important;
        }
      `}</style>
      {children}
    </div>
  );
}
