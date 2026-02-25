import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  /** Square size (px). Use width/height for non-square avatars. */
  size?: number;
  /** Width (px). Overrides size when provided. */
  width?: number;
  /** Height (px). Overrides size when provided. */
  height?: number;
  rounded?: "md" | "lg" | "xl" | "full";
  className?: string;
}

export function Avatar({
  src,
  alt,
  size = 44,
  width,
  height,
  rounded = "xl",
  className = "",
}: AvatarProps) {
  const roundedMap = {
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full",
  };

  const w = width ?? size;
  const h = height ?? size;

  return (
    <div
      className={`overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)] flex-shrink-0 ${roundedMap[rounded]} ${className}`}
      style={{ width: w, height: h }}
    >
      <Image src={src} alt={alt} width={w} height={h} className="h-full w-full object-cover" />
    </div>
  );
}
