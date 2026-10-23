interface ServiceDeliverableRowProps {
  number: string;
  name: string;
  description: string;
  // The name's element: a paragraph on service pages, a heading for the Parallel steps.
  titleAs?: "p" | "h3";
}

export default function ServiceDeliverableRow({
  number,
  name,
  description,
  titleAs: Title = "p",
}: ServiceDeliverableRowProps) {
  return (
    <div className="svc-del-row">
      <span className="svc-del-num">{number}</span>
      <div className="svc-del-content">
        <Title className="svc-del-name">{name}</Title>
        <p className="svc-del-desc">{description}</p>
      </div>
    </div>
  );
}
