import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import { AcceptingOrdersStatus } from "@/components/dashboard/accepting-orders-status";

export function ProfileCard({
  name,
  slug,
  address,
}: {
  name: string;
  slug: string;
  address: string | null;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-card p-6 shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3.5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0E6]">
          <Image
            src="/brand/logo-magmenu-white.png"
            alt=""
            width={36}
            height={22}
            className="w-9 [filter:invert(35%)_sepia(60%)_saturate(600%)_hue-rotate(80deg)]"
          />
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="truncate text-[17px] font-semibold">{name}</div>
          <div className="text-right text-[13px] font-light text-text-3" dir="ltr">
            @{slug}
          </div>
        </div>
        <Link
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#E3E3E3] px-3 text-xs font-medium text-text-1 transition-colors hover:bg-[#F6F6F6]"
        >
          <ExternalLink size={14} className="text-brand" />
          مشاهده منو
        </Link>
      </div>
      {address && (
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-text-3" />
          <span className="text-xs font-light text-text-3">{address}</span>
        </div>
      )}
      <div className="h-px bg-[#F0F0F0]" />
      <AcceptingOrdersStatus />
    </div>
  );
}
