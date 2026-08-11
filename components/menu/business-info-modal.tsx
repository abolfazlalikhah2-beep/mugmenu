"use client";

import { X, Clock, Phone, MapPin } from "lucide-react";
import { LogoBox } from "@/components/menu/logo-box";
import { AcceptingOrdersLine } from "@/components/menu/status-line";
import { MenuImage } from "@/components/menu/menu-image";
import { StarIcon } from "@/components/ui/rating";

export interface BusinessInfoModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  isAcceptingOrders: boolean;
  reviews: { customerName: string; rating: number; comment: string | null }[];
  logoUrl?: string | null;
}

function InfoRow({
  icon,
  label,
  value,
  valueDir,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueDir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex h-11 items-center justify-between rounded-pill border border-[#E3E3E3] px-4.5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-xs font-light" dir={valueDir}>
        {value}
      </span>
    </div>
  );
}

export function BusinessInfoModal({
  open,
  onClose,
  name,
  address,
  phone,
  openingHours,
  isAcceptingOrders,
  reviews,
  logoUrl,
}: BusinessInfoModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center md:bg-black/16">
      <div className="relative h-full w-full overflow-y-auto bg-card md:h-auto md:max-h-[85vh] md:w-[640px] md:rounded-card md:shadow-modal">
        <div className="flex flex-col gap-4.5 p-6 pt-11 md:p-8">
          <button
            onClick={onClose}
            aria-label="بستن"
            className="absolute top-6 left-5 text-[#969696] md:top-7 md:left-7"
          >
            <X size={26} strokeWidth={1.6} />
          </button>

          <div className="flex flex-wrap items-start justify-between gap-3.5">
            <div className="flex gap-3.5">
              <LogoBox size={64} logoUrl={logoUrl} />
              <div className="flex flex-col gap-1.5 text-right">
                <div className="text-lg font-normal">{name}</div>
                {address && (
                  <div className="flex items-center gap-1.5 text-xs font-light text-text-3">
                    <MapPin size={13} />
                    {address}
                  </div>
                )}
                <AcceptingOrdersLine isAcceptingOrders={isAcceptingOrders} />
              </div>
            </div>
            <MenuImage
              label="نقشه"
              className="h-[88px] w-[150px] shrink-0 rounded-[14px]"
            />
          </div>

          <div className="flex flex-col gap-3">
            {openingHours && (
              <InfoRow icon={<Clock size={16} className="text-brand" />} label="ساعت کاری" value={openingHours} />
            )}
            {phone && (
              <InfoRow
                icon={<Phone size={15} className="text-brand" />}
                label="شماره تماس"
                value={phone}
                valueDir="ltr"
              />
            )}
          </div>

          <div className="text-right">
            <div className="mb-2 text-sm">درباره رستوران</div>
            <p className="m-0 text-justify text-xs leading-[1.9] font-light text-text-1">
              رستوران ما با الهام از طعم‌های اصیل و مواد اولیه تازه، تلاش می‌کند لحظاتی
              خوشمزه و به‌یادماندنی برای شما بسازد. غذا فقط یک وعده نیست، بلکه تجربه‌ای
              دلنشین است که با عشق، کیفیت و احترام همراه است.
            </p>
          </div>

          {reviews.length > 0 && (
            <div className="flex flex-col gap-3 pt-1">
              <span className="text-sm">نظرات کاربران</span>
              {reviews.slice(0, 2).map((r, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="flex shrink-0 flex-col gap-0.5 text-right">
                    <div className="flex items-center gap-1 text-sm font-bold text-[#0F0F0F]">
                      {r.customerName}
                      <StarIcon size={11} />
                      <span className="font-normal text-text-2">{r.rating}</span>
                    </div>
                  </div>
                  {r.comment && (
                    <p className="m-0 flex-1 text-justify text-xs leading-[1.7] text-text-1">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
