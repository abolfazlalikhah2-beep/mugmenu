import { cn } from "@/lib/utils";

export function MenuImage({
  imageUrl,
  alt = "",
  label,
  className,
}: {
  imageUrl?: string | null;
  alt?: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (imageUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-[#F2F2F2]", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Liara's proxy 400s /_next/image */}
        <img src={imageUrl} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-[#F2F2F2] text-center text-[11px] font-light text-text-3",
        className
      )}
    >
      {label}
    </div>
  );
}
