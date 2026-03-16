export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* Hide site header and footer in the Sanity Studio */
        body > header,
        body > footer { display: none !important; }
        body > main { padding-top: 0 !important; }
        .custom-cursor-dot,
        .custom-cursor-ring { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
