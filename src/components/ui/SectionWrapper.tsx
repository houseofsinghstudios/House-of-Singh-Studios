interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  bg?: "mist" | "cloudy" | "obsidian" | "white";
  spacing?: "sm" | "md" | "lg";
  as?: React.ElementType;
  animate?: boolean;
  id?: string;
}

const bgStyles: Record<string, React.CSSProperties> = {
  mist: { background: "var(--bg)" },
  cloudy: { background: "var(--bg-shift)" },
  obsidian: { background: "var(--text-primary)", color: "var(--bg)" },
  white: { background: "#FFFFFF" },
};

const spacingClass: Record<string, string> = {
  sm: "section-wrapper-sm",
  md: "section-wrapper",
  lg: "section-wrapper-lg",
};

export default function SectionWrapper({
  children,
  className = "",
  index = 0,
  bg,
  spacing = "md",
  as: Component = "section",
  animate = true,
  id,
}: SectionWrapperProps) {
  const resolvedBg = bg ?? (index % 2 === 0 ? "mist" : "cloudy");

  const classes = [
    spacingClass[spacing],
    animate ? "css-reveal" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component id={id} className={classes} style={bgStyles[resolvedBg]}>
      {children}
    </Component>
  );
}
