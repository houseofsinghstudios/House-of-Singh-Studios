interface ServiceDeliverableRowProps {
  number: string;
  name: string;
  description: string;
}

export default function ServiceDeliverableRow({
  number,
  name,
  description,
}: ServiceDeliverableRowProps) {
  return (
    <div className="svc-del-row">
      <span className="svc-del-num">{number}</span>
      <div className="svc-del-content">
        <p className="svc-del-name">{name}</p>
        <p className="svc-del-desc">{description}</p>
      </div>
    </div>
  );
}
