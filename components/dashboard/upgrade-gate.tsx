import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Wraps a plan-gated section: renders children when allowed, otherwise a
 * locked placeholder with an upgrade CTA. Use for a whole page/tab; for a
 * single inline control, use <UpgradeLockBadge> instead.
 */
export function UpgradeGate({
  allowed,
  children,
  title = "این امکان در پلن شما موجود نیست",
  className,
}: {
  allowed: boolean;
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  if (allowed) return <>{children}</>;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[22px] border border-dashed border-[#DDD] bg-card p-[46px_24px] text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F5F4]">
        <Lock size={22} className="text-[#9A9A9A]" />
      </div>
      <p className="text-sm font-medium text-text-1">{title}</p>
      <Link
        href="/dashboard/account"
        className="rounded-xl bg-brand px-4 py-2 text-xs font-medium text-white"
      >
        برای ارتقا کلیک کنید
      </Link>
    </div>
  );
}

/** Small inline badge for a locked nav item / button — links straight to the upgrade prompt. */
export function UpgradeLockBadge({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard/account"
      title="این امکان در پلن شما موجود نیست، برای ارتقا کلیک کنید"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-[#9A9A9A]",
        className
      )}
    >
      <Lock size={11} />
    </Link>
  );
}
