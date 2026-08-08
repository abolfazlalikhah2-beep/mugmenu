import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function OrderTypeRow({
  label,
  icon,
  href,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-14 items-center justify-between rounded-btn bg-chip px-5"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[15px] font-light">{label}</span>
      </div>
      <ChevronDown size={20} className="text-text-2" />
    </Link>
  );
}
