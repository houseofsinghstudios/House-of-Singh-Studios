interface DividerProps {
  className?: string;
  spacing?: "sm" | "md" | "lg";
}

const spacingMap = {
  sm: "24px",
  md: "clamp(40px, 5vw, 64px)",
  lg: "clamp(64px, 8vw, 120px)",
};

export default function Divider({ className = "", spacing = "md" }: DividerProps) {
  return (
    <hr
      className={`hos-divider${className ? ` ${className}` : ""}`}
      style={{
        marginTop: spacingMap[spacing],
        marginBottom: spacingMap[spacing],
      }}
    />
  );
}
