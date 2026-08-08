import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function AuthFooterLink({
  icon: Icon,
  prompt,
  linkLabel,
  href,
}: {
  icon: LucideIcon;
  prompt?: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-text-2">
      {prompt && <span>{prompt}</span>}
      <Link href={href} className="font-medium text-brand hover:text-brand-hover">
        {linkLabel}
      </Link>
      <Icon size={15} className="text-text-3" />
    </div>
  );
}

export function AuthFooterRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      {children}
    </div>
  );
}
