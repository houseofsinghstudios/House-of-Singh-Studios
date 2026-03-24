"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "next-view-transitions";

type Variant = "primary" | "secondary" | "primary-inverted" | "secondary-inverted" | "text";

interface ButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  magnetic?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  "primary-inverted": "btn-primary-inverted",
  "secondary-inverted": "btn-secondary-inverted",
  text: "btn-text",
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  magnetic = true,
  type = "button",
  disabled = false,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0,0,0)");
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = !window.matchMedia("(pointer: fine)").matches;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!magnetic || !ref.current || isTouch.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) * 0.15;
      const y = (e.clientY - centerY) * 0.15;
      setTransform(`translate3d(${x}px,${y}px,0)`);
    },
    [magnetic]
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouch.current) return;
    setTransform("translate3d(0,0,0)");
  }, []);

  const magneticStyle = {
    transform,
    transition: "transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
    display: "inline-block",
  };

  const combinedClass = `${variantClass[variant]}${className ? ` ${className}` : ""}`;

  if (variant === "text") {
    const inner = (
      <span className="btn-text-inner">
        {children}
        <span className="btn-text-line" />
      </span>
    );

    if (href) {
      return (
        <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={magneticStyle}>
          <Link href={href} className={combinedClass} {...rest}>{inner}</Link>
        </div>
      );
    }

    return (
      <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={magneticStyle}>
        <button type={type} onClick={onClick} disabled={disabled} className={combinedClass}>{inner}</button>
      </div>
    );
  }

  if (href) {
    return (
      <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={magneticStyle}>
        <Link href={href} className={combinedClass} {...rest}>{children}</Link>
      </div>
    );
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={magneticStyle}>
      <button type={type} onClick={onClick} disabled={disabled} className={combinedClass}>{children}</button>
    </div>
  );
}
