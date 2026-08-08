import Image from "next/image";

export function LogoBox({ size = 64 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[18px] bg-card shadow-float"
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo-magmenu-white.png"
        alt=""
        width={132}
        height={82}
        style={{ width: size * 0.68, height: "auto" }}
        className="[filter:invert(35%)_sepia(60%)_saturate(600%)_hue-rotate(80deg)]"
      />
    </div>
  );
}
