"use client";

import * as React from "react";
import { Menu, X, Info } from "lucide-react";
import { LogoBox } from "@/components/menu/logo-box";
import { LanguageToggle } from "@/components/menu/language-toggle";
import { BusinessInfoModal } from "@/components/menu/business-info-modal";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";
import type { DayHours } from "@/features/menu/utils/business-hours";

/**
 * Entry screen's hamburger (☰) button over the hero (Menu Flow.dc.html
 * screen 1) — the design doesn't specify what it opens, so this is a
 * judgment call: a lightweight drawer holding the two things that make
 * sense to tuck behind a menu icon rather than leave as page furniture —
 * business info (duplicating RestaurantHeader's own info button/modal, kept
 * as a separate instance so the two don't have to share state) and the
 * language toggle, which used to float over the hero on its own and now
 * lives here instead so the hero only ever shows one icon button.
 */
export function EntryDrawer({
  slug,
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
  bilingualEnabled,
}: {
  slug: string;
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
  bilingualEnabled: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [infoOpen, setInfoOpen] = React.useState(false);
  const t = menuCopy(lang);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t.menuButtonLabel}
        className="absolute top-3.5 left-3.5 z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-black/22 text-white backdrop-blur-sm"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div
            dir={t.dir}
            className="relative flex h-full w-[280px] flex-col gap-1 bg-card p-4 shadow-modal"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <LogoBox size={40} logoUrl={logoUrl} />
                <span className="text-sm font-semibold">{name}</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-chip text-[#6B6B6B]"
              >
                <X size={18} />
              </button>
            </div>

            <button
              onClick={() => setInfoOpen(true)}
              className="flex h-12 items-center gap-2.5 rounded-xl px-3 text-sm text-ink"
            >
              <Info size={18} className="text-brand" />
              <span>{t.infoButton}</span>
            </button>

            {bilingualEnabled && (
              <div className="flex items-center gap-2.5 px-3 py-2">
                <LanguageToggle slug={slug} lang={lang} />
              </div>
            )}
          </div>
        </div>
      )}

      <BusinessInfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        name={name}
        address={address}
        phone={phone}
        hours={hours}
        isAcceptingOrders={isAcceptingOrders}
        reviews={reviews}
        logoUrl={logoUrl}
        lang={lang}
        latitude={latitude}
        longitude={longitude}
      />
    </>
  );
}
