import { Receipt } from "lucide-react";

export function BillingPlaceholderCard() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[22px] bg-card p-[28px_26px] text-center shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F5F4]">
        <Receipt size={20} className="text-[#9A9A9A]" />
      </div>
      <div className="text-[15px] font-semibold">صورتحساب‌ها</div>
      <p className="text-xs font-light leading-7 text-text-3">
        پس از فعال‌سازی درگاه پرداخت، سابقه صورتحساب‌های شما اینجا نمایش داده می‌شود.
      </p>
    </div>
  );
}
