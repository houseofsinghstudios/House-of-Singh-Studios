import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
}

export default function ImageGallery({
  images,
}: {
  images: GalleryImage[];
}) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="cs-gallery" style={{ padding: "clamp(32px, 4vw, 48px) var(--page-px)" }}>
        <div className="cs-gallery-full reveal-clip">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="cs-gallery" style={{ padding: "clamp(32px, 4vw, 48px) var(--page-px)" }}>
        <div className="cs-gallery-pair">
          {images.map((img, i) => (
            <div
              key={i}
              className="cs-gallery-pair-item reveal-clip"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3 images: full-width first, then 2-up
  return (
    <div className="cs-gallery" style={{ padding: "clamp(32px, 4vw, 48px) var(--page-px)" }}>
      <div className="cs-gallery-full reveal-clip" style={{ marginBottom: 16 }}>
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="cs-gallery-pair">
        {images.slice(1, 3).map((img, i) => (
          <div
            key={i}
            className="cs-gallery-pair-item reveal-clip"
            style={{ transitionDelay: `${(i + 1) * 100}ms` }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
