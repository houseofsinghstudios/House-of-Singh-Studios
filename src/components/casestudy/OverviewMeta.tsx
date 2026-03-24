interface MetaItem {
  label: string;
  value: string;
}

export default function OverviewMeta({ items }: { items: MetaItem[] }) {
  return (
    <div className="cs-meta-list">
      {items.map((item, i) => (
        <div key={i} className="cs-meta-item">
          <span className="cs-meta-label">{item.label}</span>
          <span className="cs-meta-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
