import Image from "next/image";

export function LogoBox({ size = 64, logoUrl }: { size?: number; logoUrl?: string | null }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-card shadow-float"
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- Liara's proxy 400s /_next/image
        <img src={logoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <Image
          src="/brand/logo-magmenu-white.png"
          alt=""
          width={132}
          height={82}
          style={{ width: size * 0.68, height: "auto" }}
          className="[filter:invert(35%)_sepia(60%)_saturate(600%)_hue-rotate(80deg)]"
        />
      )}
    </div>
  );
}
