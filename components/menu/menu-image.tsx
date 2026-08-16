import Image from "next/image";
import { cn } from "@/lib/utils";

export function MenuImage({
  imageUrl,
  alt = "",
  label,
  className,
  sizes = "100vw",
  priority = false,
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
        <Image src={imageUrl} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
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
