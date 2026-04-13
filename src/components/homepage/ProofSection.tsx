const ITEMS = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 12, suffix: "+", label: "Years of Practice" },
  { value: 8, suffix: "+", label: "Industries Served" },
];

export default function ProofSection() {
  return (
    <>
      <style>{`
        .proof-section {
          padding: clamp(40px, 5vw, 64px) var(--page-px, clamp(24px, 6vw, 80px));
        }
        .proof-label {
          font-family: var(--sans, Inter, sans-serif);
          font-size: 11px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted, #A9A6A2);
          margin: 0 0 24px;
        }
        .proof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }
        .proof-col {
          padding: clamp(24px, 3vw, 40px) 0;
        }
        .proof-col:not(:first-child) {
          border-left: 1px solid var(--border, #E5E3E0);
          padding-left: clamp(20px, 2.5vw, 32px);
        }
        .proof-value {
          font-family: var(--sans, Inter, sans-serif);
          font-weight: 500;
          font-size: clamp(36px, 5vw, 56px);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.03em;
          line-height: 1;
          color: var(--text-primary, #22211F);
          margin: 0;
        }
        .proof-value-label {
          font-family: var(--sans, Inter, sans-serif);
          font-size: 13px;
          font-weight: 400;
          color: var(--text-secondary, #5C5B58);
          margin: 8px 0 0;
          line-height: 1.4;
        }
        @media (max-width: 767px) {
          .proof-grid {
            grid-template-columns: 1fr;
          }
          .proof-col {
            padding: 20px 0;
          }
          .proof-col:not(:first-child) {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border, #E5E3E0);
          }
          .proof-value {
            font-size: clamp(32px, 8vw, 44px);
          }
        }
      `}</style>

      <section className="proof-section">
        <p className="proof-label">(07) Proof</p>

        <div className="proof-grid">
          {ITEMS.map((item, i) => (
            <div key={i} className="proof-col">
              <p className="proof-value">
                {item.value}{item.suffix}
              </p>
              <p className="proof-value-label">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
