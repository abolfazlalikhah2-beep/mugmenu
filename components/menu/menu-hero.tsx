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
  priority?: boolean;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-[#2A2A2A]", className)}
      style={background.type === "css" ? { background: background.css } : undefined}
    >
      {background.type === "image" && (
        // eslint-disable-next-line @next/next/no-img-element -- Liara's proxy 400s /_next/image
        <img src={background.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />
      {children}
    </div>
  );
}
