import Link from "next/link";
import { User } from "lucide-react";

export function MenuEntryBadge({
  slug,
  loggedIn,
  initial,
  label,
}: {
  slug: string;
  loggedIn: boolean;
  initial?: string;
  label?: string;
}) {
  return (
    <Link
      href={loggedIn ? `/${slug}/account` : `/${slug}/account/login`}
      className="absolute right-3.5 top-3.5 z-10 flex h-11 items-center gap-2 rounded-full bg-white/94 px-3.5 shadow-modal"
    >
      {loggedIn ? (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/12 text-xs font-semibold text-brand">
          {initial}
        </span>
      ) : (
        <User size={20} className="text-brand" />
      )}
      <span className={loggedIn ? "text-[13.5px] font-medium text-ink" : "text-[13.5px] font-medium text-brand"}>
        {label ?? (loggedIn ? "حساب من" : "ورود / ثبت‌نام")}
      </span>
    </Link>
  );
}
