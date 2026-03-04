import Link from "next/link";

type Variant = "primary" | "secondary" | "primary-inverted";

interface ButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  "primary-inverted": "btn-primary-inverted",
};

export default function Button({
  href,
  variant = "primary",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${variantClass[variant]}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
