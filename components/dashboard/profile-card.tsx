import Image from "next/image";
import { MapPin } from "lucide-react";
import { ServerToggle } from "@/components/dashboard/server-toggle";
import { toggleAcceptingOrdersAction } from "@/features/dashboard/routes/actions";

export function ProfileCard({
  name,
  slug,
  address,
  isAcceptingOrders,
}: {
  name: string;
  slug: string;
  address: string | null;
  isAcceptingOrders: boolean;
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
        <div className="text-right">
          <div className="text-[17px] font-semibold">{name}</div>
          <div className="text-right text-[13px] font-light text-text-3" dir="ltr">
            @{slug}
          </div>
        </div>
      </div>
      {address && (
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-text-3" />
          <span className="text-xs font-light text-text-3">{address}</span>
        </div>
      )}
      <div className="h-px bg-[#F0F0F0]" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={"h-2 w-2 rounded-full " + (isAcceptingOrders ? "bg-success" : "bg-text-3")} />
          <span className={"text-sm font-medium " + (isAcceptingOrders ? "text-brand" : "text-text-3")}>
            {isAcceptingOrders ? "مجموعه فعال است" : "سفارش‌گیری بسته است"}
          </span>
        </div>
        <ServerToggle initial={isAcceptingOrders} action={toggleAcceptingOrdersAction} />
      </div>
    </div>
  );
}
