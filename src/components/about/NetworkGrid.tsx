// "The right people for every brief": one card per network member from Sanity, with the photo in
// black and white, the role and the Network label. With no members (none yet, or Sanity
// unreachable) it shows the six placeholder cards. Rendered inside AboutClient.
import Image from "next/image";
import type { NetworkCard } from "@/lib/about/network";

/* ── Team roles: the placeholder cards ── */
const TEAM_ROLES = [
  "Brand Strategist",
  "Visual Designer",
  "Developer",
  "Photographer",
  "Content Strategist",
  "Motion Designer",
];

// The grid is three columns from 900px, two below, inside a 1280px column with the page padding.
const SIZES = "(max-width: 599px) 45vw, (max-width: 899px) 42vw, (max-width: 1440px) 28vw, 410px";

export default function NetworkGrid({ members }: { members: NetworkCard[] }) {
  if (members.length === 0) {
    return (
      <div className="about-team-grid reveal-stagger-parent">
        {TEAM_ROLES.map((role) => (
          <div key={role} className="about-team-card scroll-reveal-up">
            <div className="about-team-card-square" />
            <p className="about-team-card-role">{role}</p>
            <p className="about-team-card-label">Network</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="about-team-grid reveal-stagger-parent">
      {members.map((member, i) => (
        <div key={`${i}-${member.src}`} className="about-team-card scroll-reveal-up">
          <div className="about-team-card-square about-team-card-photo">
            <Image
              src={member.src}
              alt={member.alt}
              fill
              sizes={SIZES}
              loading="lazy"
              className="about-team-photo"
              placeholder={member.lqip ? "blur" : "empty"}
              blurDataURL={member.lqip}
            />
          </div>
          <p className="about-team-card-role">{member.role}</p>
          <p className="about-team-card-label">Network</p>
        </div>
      ))}
    </div>
  );
}
