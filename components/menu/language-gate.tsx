"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuImage } from "@/components/menu/menu-image";
import { LogoBox } from "@/components/menu/logo-box";
import { setMenuLanguageAction } from "@/features/menu/routes/actions";
import type { MenuLang } from "@/features/menu/utils/menu-language";

function LangOption({
  code,
  title,
  sub,
  dirNote,
  selected,
  onClick,
}: {
  code: MenuLang;
  title: string;
  sub: string;
  dirNote: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3.5 rounded-card-sm border p-4 text-right",
        selected ? "border-brand bg-brand/[0.06]" : "border-border-line bg-card"
      )}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl font-mont text-[13px] font-bold",
            selected ? "bg-brand text-white" : "bg-chip text-text-2"
          )}
        >
          {code.toUpperCase()}
        </span>
        <span className={cn("flex flex-col gap-0.5", code === "en" ? "text-left" : "text-right")}>
          <span className={cn("text-base font-semibold", code === "en" && "font-mont")}>{title}</span>
          <span className={cn("text-xs font-light text-text-3", code === "en" && "font-mont")}>{sub}</span>
        </span>
      </div>
      {selected ? (
        <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-brand">
          <Check size={15} className="text-white" />
        </span>
      ) : (
        <span className="font-mont text-[11px] tracking-[0.2em] text-text-4">{dirNote}</span>
      )}
    </button>
  );
}

export function LanguageGate({
  slug,
  name,
  nameEn,
}: {
  slug: string;
  name: string;
  nameEn?: string | null;
}) {
  const [picked, setPicked] = useState<MenuLang>("fa");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function proceed() {
    startTransition(async () => {
      await setMenuLanguageAction(slug, picked);
      router.refresh();
    });
  }

  return (
    <div dir="rtl" className="flex min-h-full flex-col">
      <div className="relative">
        <MenuImage label="تصویر فضای رستوران" className="h-[230px] w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55" />
        <div className="absolute inset-x-4.5 bottom-4.5 flex items-center gap-3">
          <LogoBox size={52} />
          <div className="text-right">
            <div className="text-[17px] font-medium text-white">{name}</div>
            {nameEn && <div className="font-mont text-xs text-white/75">{nameEn}</div>}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4.5 pt-6.5 pb-5 md:p-8">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-brand/10">
            <Globe size={24} className="text-brand" />
          </span>
          <span className="mt-1.5 text-[17px] font-semibold">زبان منو را انتخاب کنید</span>
          <span className="font-mont text-[13px] font-medium text-text-3">Please choose your language</span>
        </div>

        <div className="flex flex-col gap-3">
          <LangOption
            code="fa"
            title="فارسی"
            sub="منوی راست‌چین"
            dirNote="RTL"
            selected={picked === "fa"}
            onClick={() => setPicked("fa")}
          />
          <LangOption
            code="en"
            title="English"
            sub="Left-to-right menu"
            dirNote="LTR"
            selected={picked === "en"}
            onClick={() => setPicked("en")}
          />
        </div>

        <button
          type="button"
          onClick={proceed}
          disabled={pending}
          className="flex h-[52px] items-center justify-center rounded-btn bg-brand text-base text-white disabled:opacity-60"
        >
          {pending ? "…" : "ورود به منو / Continue"}
        </button>

        <p className="text-center text-xs leading-[1.9] font-light text-text-3">
          انتخاب شما ذخیره می‌شود و دفعه بعد مستقیم وارد همان زبان می‌شوید؛ از تاگل FA/EN در هدر هم قابل تغییر
          است.
        </p>
      </div>
    </div>
  );
}
