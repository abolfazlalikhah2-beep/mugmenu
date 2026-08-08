import Image from "next/image";

export function FooterBrand() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <span className="h-px w-3/5 bg-border-line" />
      <Image
        src="/brand/footer-brand.png"
        alt="طراحی و پیاده‌سازی شده توسط ماگ‌منو"
        width={509}
        height={42}
        className="h-auto w-[180px] opacity-60"
      />
    </div>
  );
}
