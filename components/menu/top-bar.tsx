import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function TopBar({ title, backHref }: { title: string; backHref: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F0F0F0] px-5 py-3.5 md:px-6 md:py-4.5">
      <div className="w-9" />
      <span className="text-[17px] font-medium md:text-[19px]">{title}</span>
      <Link
        href={backHref}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-chip"
      >
        <ChevronRight size={22} className="text-[#4A4A4A]" />
      </Link>
    </div>
  );
}
