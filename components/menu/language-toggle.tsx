"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { setMenuLanguageAction } from "@/features/menu/routes/actions";
import type { MenuLang } from "@/features/menu/utils/menu-language";

export function LanguageToggle({
  slug,
  lang,
  className,
}: {
  slug: string;
  lang: MenuLang;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function pick(next: MenuLang) {
    if (next === lang || pending) return;
    startTransition(async () => {
      await setMenuLanguageAction(slug, next);
      router.refresh();
    });
  }

  return (
    <div
      dir="ltr"
      className={cn(
        "inline-flex items-center gap-1 rounded-pill bg-white/94 p-1 shadow-modal",
        pending && "opacity-70",
        className
      )}
    >
      <span className="flex items-center px-1 text-text-4">
        <Globe size={15} />
      </span>
      {(["fa", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => pick(code)}
          disabled={pending}
          className={cn(
            "flex h-7 min-w-[34px] items-center justify-center rounded-pill px-2.5 font-mont text-xs font-semibold tracking-[0.04em]",
            lang === code ? "bg-brand text-white shadow-[0_2px_8px_rgba(50,140,61,0.32)]" : "text-[#8A8A8A]"
          )}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
