"use client";

import { X, Phone, MapPin, ExternalLink } from "lucide-react";
import { LogoBox } from "@/components/menu/logo-box";
import { AcceptingOrdersLine } from "@/components/menu/status-line";
import { MenuImage } from "@/components/menu/menu-image";
import { BusinessHoursAccordion } from "@/components/menu/business-hours-accordion";
import { StarIcon } from "@/components/ui/rating";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";
import type { DayHours } from "@/features/menu/utils/business-hours";
import { cn } from "@/lib/utils";

export interface BusinessInfoModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  address: string | null;
  phone: string | null;
  hours: DayHours[];
  isAcceptingOrders: boolean;
  reviews: { customerName: string; rating: number; comment: string | null }[];
  logoUrl?: string | null;
  lang?: MenuLang;
  latitude?: number | null;
  longitude?: number | null;
}

function LocationPreview({ latitude, longitude }: { latitude: number; longitude: number }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  if (apiKey) {
    return (
      <iframe
        title="موقعیت روی نقشه"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}`}
        className="h-[88px] w-[150px] shrink-0 rounded-[14px] border-0"
        loading="lazy"
      />
    );
  }

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-[88px] w-[150px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[14px] bg-[#F2F2F2] text-xs font-medium text-brand"
    >
      <ExternalLink size={16} />
      مشاهده در نقشه
    </a>
  );
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
  hours,
  isAcceptingOrders,
  reviews,
  logoUrl,
  lang = "fa",
  latitude,
  longitude,
}: BusinessInfoModalProps) {
  if (!open) return null;
  const t = menuCopy(lang);
  const align = lang === "en" ? "text-left" : "text-right";

  return (
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center md:bg-black/16">
      <div className="relative h-full w-full overflow-y-auto bg-card md:h-auto md:max-h-[85vh] md:w-[640px] md:rounded-card md:shadow-modal">
        {/* Top padding is set explicitly per-side (not via `p-*`) and sized to
            clear the absolutely-positioned close button below at both
            breakpoints — the map preview that follows used to be a plain
            gray placeholder, but now that it's live map content it visibly
            collided with the button without this clearance. */}
        <div className="flex flex-col gap-4.5 px-6 pb-6 pt-16 md:px-8 md:pb-8 md:pt-[76px]">
          <button
            onClick={onClose}
            aria-label={t.close}
            className="absolute top-5 left-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#6B6B6B] shadow-float md:top-6 md:left-6"
          >
            <X size={20} strokeWidth={1.8} />
          </button>

          <div className="flex flex-wrap items-start justify-between gap-3.5">
            <div className="flex gap-3.5">
              <LogoBox size={64} logoUrl={logoUrl} />
              <div className={cn("flex flex-col gap-1.5", align, lang === "en" && "font-mont")}>
                <div className="text-lg font-normal">{name}</div>
                {address && (
                  <div className="flex items-center gap-1.5 text-xs font-light text-text-3">
                    <MapPin size={13} />
                    {address}
                  </div>
                )}
                <AcceptingOrdersLine isAcceptingOrders={isAcceptingOrders} lang={lang} />
              </div>
            </div>
            {latitude != null && longitude != null ? (
              <LocationPreview latitude={latitude} longitude={longitude} />
            ) : (
              <MenuImage label="نقشه" className="h-[88px] w-[150px] shrink-0 rounded-[14px]" />
            )}
          </div>

          <div className="flex flex-col gap-3">
            {hours.length > 0 && <BusinessHoursAccordion hours={hours} lang={lang} />}
            {phone && (
              <InfoRow
                icon={<Phone size={15} className="text-brand" />}
                label={t.infoPhone}
                value={phone}
                valueDir="ltr"
              />
            )}
          </div>

          <div className={cn(align, lang === "en" && "font-mont")}>
            <div className="mb-2 text-sm">{t.infoAbout}</div>
            <p className="m-0 text-justify text-xs leading-[1.9] font-light text-text-1">{t.infoAboutText}</p>
          </div>

          {reviews.length > 0 && (
            <div className="flex flex-col gap-3 pt-1">
              <span className={cn("text-sm", lang === "en" && "font-mont")}>{t.infoReviews}</span>
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
