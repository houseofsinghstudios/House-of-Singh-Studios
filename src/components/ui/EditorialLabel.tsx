interface EditorialLabelProps {
  // The label text. Pass it without brackets: the label adds them.
  text: string;
  // Optional section number, bracketed on its own before the text: "(01) Featured Work".
  number?: string;
  className?: string;
}

export default function EditorialLabel({ text, number, className = "" }: EditorialLabelProps) {
  return (
    <p className={`editorial-label${className ? ` ${className}` : ""}`}>
      {number ? <>({number}) {text}</> : <>({text})</>}
    </p>
  );
}
