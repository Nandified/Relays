import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  rounded?: "md" | "lg" | "xl" | "full";
}

export function Avatar({ src, alt, size = 44, rounded = "xl" }: AvatarProps) {
  const roundedMap = {
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full",
  };

  return (
    <div
      className={`overflow-hidden border border-[var(--border)] bg-slate-50 flex-shrink-0 ${roundedMap[rounded]}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} width={size} height={size} className="object-cover" />
    </div>
  );
}
