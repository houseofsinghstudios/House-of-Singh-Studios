interface Deliverable {
  title: string;
  description: string;
}

export default function DeliverableGrid({
  deliverables,
}: {
  deliverables: Deliverable[];
}) {
  return (
    <div className="cs-del-grid">
      {deliverables.map((d, i) => (
        <div
          key={i}
          className="cs-del-item css-reveal"
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <span className="cs-del-num">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="cs-del-title">{d.title}</p>
          <p className="cs-del-desc">{d.description}</p>
        </div>
      ))}
    </div>
  );
}
