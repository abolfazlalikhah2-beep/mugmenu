"use client";

import { forwardRef } from "react";
import { MapPin, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export interface QrCardBusiness {
  name: string;
  address: string | null;
  openingHoursStart: string | null;
  openingHoursEnd: string | null;
}

export const QrCard = forwardRef<
  HTMLDivElement,
  {
    business: QrCardBusiness;
    publicUrl: string;
    showInfo: boolean;
    showHours: boolean;
    showLogo: boolean;
    size?: number;
  }
>(function QrCard({ business, publicUrl, showInfo, showHours, showLogo, size = 210 }, ref) {
  return (
    <div
      ref={ref}
      dir="rtl"
      className="flex w-[320px] flex-col items-center gap-5 rounded-[28px] border border-[#F0F0F0] bg-white px-6 pb-6 pt-8 text-center shadow-[0px_20px_44px_rgba(0,0,0,0.10)]"
    >
      {showInfo && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-[22px] font-bold">{business.name}</div>
          {business.address && (
            <div className="flex items-center gap-1.5 text-text-3">
              <MapPin size={14} />
              <span className="text-xs font-light">{business.address}</span>
            </div>
          )}
        </div>
      )}

      <div className="rounded-[20px] border border-[#F0F0F0] p-4">
        <QRCodeSVG value={publicUrl} size={size} level="M" />
      </div>

      {showHours && business.openingHoursStart && business.openingHoursEnd && (
        <div className="flex items-center gap-2 rounded-xl bg-[#EAF3EB] px-4 py-2 text-brand">
          <Clock size={16} />
          <span className="text-[13px] font-medium">
            همه‌روزه {business.openingHoursStart} تا {business.openingHoursEnd}
          </span>
        </div>
      )}

      {showLogo && (
        <div className="flex w-full flex-col items-center gap-5">
          <div className="h-px w-[70%] bg-[#F0F0F0]" />
          <div className="flex items-center gap-1.5 opacity-90">
            <span className="text-[11px] font-light text-text-3">قدرت‌گرفته از</span>
            {/* plain img (not next/image) so html-to-image can reliably rasterize it on export */}
            <img
              src="/brand/wordmark-faded.png"
              alt="ماگ‌منو"
              className="h-[18px] w-auto [filter:invert(38%)_sepia(50%)_saturate(700%)_hue-rotate(80deg)]"
            />
          </div>
        </div>
      )}
    </div>
  );
});
