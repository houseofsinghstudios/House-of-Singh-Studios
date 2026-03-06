interface EditorialLabelProps {
  text: string;
  className?: string;
}

export default function EditorialLabel({ text, className = "" }: EditorialLabelProps) {
  return (
    <p className={`editorial-label${className ? ` ${className}` : ""}`}>
      ({text})
    </p>
  );
}
