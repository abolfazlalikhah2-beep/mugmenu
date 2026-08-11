import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroBackground } from "@/features/menu/utils/hero-background";

/** The entry page's top banner — image, gradient, or logo-only fallback (see dashboard "ظاهر منو"). */
export function MenuHero({
  background,
  overlayOpacity,
  className,
  children,
}: {
  background: HeroBackground;
  overlayOpacity: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-[#2A2A2A]", className)}
      style={background.type === "css" ? { background: background.css } : undefined}
    >
      {background.type === "image" && <Image src={background.url} alt="" fill sizes="100vw" className="object-cover" />}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />
      {children}
    </div>
  );
}
