import { Link } from "next-view-transitions";

const SERVICES = [
  {
    service: "Brand Identity and Visual Design",
    problem: "Your business has grown. Your brand has not kept up.",
    solution:
      "Prospects compare you to competitors with sharper visuals and walk away. We build complete visual systems that make your business look as established as it actually is.",
    cta: "Fix your brand identity",
    href: "/services/brand-identity",
  },
  {
    service: "Visual Media and Content Production",
    problem:
      "Your content looks different on every platform. Nothing connects.",
    solution:
      "Photos here, videos there, no visual thread. We direct and produce brand photography, video, and content systems that hold together across every channel.",
    cta: "Build a content system",
    href: "/services/visual-media",
  },
  {
    service: "Digital Design and Experience",
    problem:
      "Your website exists. But it does not work for your business.",
    solution:
      "People browse for 30 seconds and leave. We design digital experiences where every page has a job: build trust, demonstrate capability, and move visitors toward a conversation.",
    cta: "Redesign your digital presence",
    href: "/services/digital-design",
  },
  {
    service: "Creative Strategy and Systems",
    problem: "Your team makes brand decisions without a playbook.",
    solution:
      "Marketing, agencies, freelancers — they all interpret your brand differently. We build the strategic framework that lets your team operate confidently without you.",
    cta: "Get a strategic framework",
    href: "/services/creative-strategy",
  },
];

export default function ServiceRows() {
  return (
    <div className="svc-rows">
      {SERVICES.map((s, i) => (
        <Link key={i} href={s.href} className="svc-row" data-cursor="link">
          <div className="svc-row-left">
            <p className="svc-row-label">{s.service}</p>
            <p className="svc-row-problem">{s.problem}</p>
          </div>
          <div className="svc-row-right">
            <p className="svc-row-solution">{s.solution}</p>
            <span className="svc-row-cta">
              {s.cta} <span className="svc-row-arrow">&rarr;</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
