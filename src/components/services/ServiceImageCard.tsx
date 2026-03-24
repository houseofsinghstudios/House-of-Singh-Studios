import Image from "next/image";

interface ServiceImageCardProps {
  src: string;
  alt: string;
  projectName: string;
  projectCategory: string;
  priority?: boolean;
}

export default function ServiceImageCard({
  src,
  alt,
  projectName,
  projectCategory,
  priority = false,
}: ServiceImageCardProps) {
  return (
    <div className="svc-theater-image-block">
      <div className="svc-theater-image-wrap reveal-clip" data-service-image>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 45vw"
          style={{ objectFit: "cover" }}
          priority={priority}
        />
      </div>
      <div className="svc-theater-image-label">
        <p className="svc-theater-image-name">{projectName}</p>
        <p className="svc-theater-image-cat">{projectCategory}</p>
      </div>
    </div>
  );
}
