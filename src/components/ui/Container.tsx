interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  narrow?: boolean;
}

export default function Container({
  children,
  className = "",
  as: Component = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Component
      className={className}
      style={{
        maxWidth: narrow ? 680 : 1280,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
    >
      {children}
    </Component>
  );
}
