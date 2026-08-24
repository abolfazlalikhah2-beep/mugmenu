import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Back button sits on the physical right corner of the header — RTL reading
// direction, so this is the natural thumb-reach corner (see item/[itemId]
// /page.tsx's overlay back button, which uses the same right-4 convention).
// Positioned with an explicit `absolute right-*` instead of relying on
// flexbox row order flipping under `dir="rtl"` — that works too, but only
// implicitly (via an invisible w-9 spacer balancing the title), which is
// easy to break by accident when editing this header.
export function TopBar({ title, backHref }: { title: string; backHref: string }) {
  return (
    <div className="relative flex items-center justify-center border-b border-[#F0F0F0] px-5 py-3.5 md:px-6 md:py-4.5">
      <span className="text-[17px] font-medium md:text-[19px]">{title}</span>
      <Link
        href={backHref}
        aria-label="بازگشت"
        className="absolute top-1/2 right-5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-chip md:right-6"
      >
        <ChevronRight size={22} className="text-[#4A4A4A]" />
      </Link>
    </div>
  );
}
