import Image from "next/image";

/**
 * Shows the whole image (never cropped) while still filling its card edge to edge:
 * a blurred, cover-scaled copy of the same image fills the frame, and the full
 * image sits on top with object-contain. Landscape photos that match the card
 * look exactly like object-cover; portrait/odd-ratio photos show fully with a
 * soft matching backdrop instead of empty bars or cut-off heads.
 * Parent must be `relative` + `overflow-hidden` with a defined size/aspect ratio.
 */
export default function FitImage({
  src,
  alt,
  sizes,
  className = "",
  preload,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="object-cover object-center scale-110 blur-sm brightness-90"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-contain object-center ${className}`}
      />
    </>
  );
}
