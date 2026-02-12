import Image from "next/image";

export function Avatar({
  src,
  alt,
  size = 44,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} width={size} height={size} priority />
    </div>
  );
}
