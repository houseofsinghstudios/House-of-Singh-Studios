// Numbered rows on a program page: the service page deliverable rows (01, name, one line), 1px Marble
// rules, each revealing 80ms after the one before. Parallel's edition parts and Commons' criteria.
import ServiceDeliverableRow from "@/components/services/ServiceDeliverableRow";

export default function NumberedRows({ rows }: { rows: { name: string; description: string }[] }) {
  return (
    <div className="init-steps">
      {rows.map((row, i) => (
        <div key={row.name} className="css-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
          <ServiceDeliverableRow number={String(i + 1).padStart(2, "0")} name={row.name} description={row.description} titleAs="h3" />
        </div>
      ))}
    </div>
  );
}
