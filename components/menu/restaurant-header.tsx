"use client";

import * as React from "react";
import { MapPin, Info } from "lucide-react";
import { LogoBox } from "@/components/menu/logo-box";
import { AcceptingOrdersLine } from "@/components/menu/status-line";
import { RatingChip } from "@/components/ui/rating";
import { BusinessInfoModal } from "@/components/menu/business-info-modal";

export interface RestaurantHeaderProps {
  name: string;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  isAcceptingOrders: boolean;
  rating: string | null;
  reviews: { customerName: string; rating: number; comment: string | null }[];
}

export function RestaurantHeader({
  name,
  address,
  phone,
  openingHours,
  isAcceptingOrders,
  rating,
  reviews,
}: RestaurantHeaderProps) {
  const [infoOpen, setInfoOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 px-4.5 pt-4 pb-1 md:px-6.5 md:pt-5.5">
        <div className="flex items-start gap-3.5">
          <LogoBox size={54} />
          <div className="flex flex-col gap-1.5 text-right">
            <span className="text-[17px] font-normal md:text-xl">{name}</span>
            <AcceptingOrdersLine isAcceptingOrders={isAcceptingOrders} />
            {address && (
              <div className="flex items-center gap-1.5 text-xs font-light text-text-3">
                <MapPin size={13} />
                {address}
              </div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {rating && <RatingChip rating={rating} />}
          <button
            onClick={() => setInfoOpen(true)}
            className="flex h-[31px] items-center gap-2 rounded-pill bg-card px-3.5 whitespace-nowrap shadow-float"
          >
            <span className="text-xs text-text-2">اطلاعات مجموعه ما</span>
            <Info size={15} className="text-text-2" />
          </button>
        </div>
      </div>

      <BusinessInfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        name={name}
        address={address}
        phone={phone}
        openingHours={openingHours}
        isAcceptingOrders={isAcceptingOrders}
        reviews={reviews}
      />
    </>
  );
}
