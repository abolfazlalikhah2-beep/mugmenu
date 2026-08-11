"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";
import { ProfileEditModal } from "@/components/customer-account/profile-edit-modal";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function AccountHeroHeader({
  slug,
  fullName,
  phone,
  lang = "fa",
}: {
  slug: string;
  fullName: string;
  phone: string;
  lang?: MenuLang;
}) {
  const [editing, setEditing] = useState(false);
  const t = menuCopy(lang);

  return (
    <div className="bg-gradient-to-br from-brand to-[#245F2B] px-4.5 pt-4.5 pb-[58px] text-white">
      <div className="flex items-center justify-between">
        <span className="text-[17px] font-medium">{t.myAccount}</span>
        <Link
          href={`/${slug}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/16"
        >
          <ChevronLeft size={20} />
        </Link>
      </div>
      <div className="mt-5 flex items-center gap-3.5">
        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[18px] bg-white/18 text-xl font-semibold">
          {fullName.slice(0, 1)}
        </div>
        <div>
          <div className="text-[17px] font-medium">{fullName}</div>
          <div dir="ltr" className="mt-0.5 text-right text-[12.5px] font-light opacity-80">
            {phone}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mr-auto flex items-center gap-1.5 rounded-xl bg-white/16 px-3 py-1.5"
        >
          <Pencil size={16} />
          <span className="text-[12.5px]">{t.editProfile}</span>
        </button>
      </div>
      {editing && <ProfileEditModal slug={slug} fullName={fullName} onClose={() => setEditing(false)} lang={lang} />}
    </div>
  );
}
