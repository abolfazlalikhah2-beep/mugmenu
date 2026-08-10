import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { WalletTransactionType } from "@/lib/generated/prisma/enums";

const TYPE_LABEL: Record<WalletTransactionType, string> = {
  CASHBACK_EARNED: "کش‌بک سفارش",
  ADJUSTMENT: "اصلاح موجودی",
};

export function WalletLedgerRow({
  transaction,
  isFirst,
}: {
  transaction: { id: string; type: WalletTransactionType; amount: number; note: string | null; createdAt: Date };
  isFirst: boolean;
}) {
  const positive = transaction.amount >= 0;

  return (
    <div className={`flex items-center gap-3 py-3.5 ${isFirst ? "" : "border-t border-[#F4F4F4]"}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${positive ? "bg-brand/10" : "bg-[#FBECEC]"}`}>
        {positive ? (
          <ArrowDownLeft size={18} className="text-brand" />
        ) : (
          <ArrowUpRight size={18} className="text-[#C15656]" />
        )}
      </div>
      <div className="min-w-0 flex-1 text-right">
        <div className="text-sm font-medium">{transaction.note ?? TYPE_LABEL[transaction.type]}</div>
        <div className="mt-0.5 text-[11.5px] font-light text-text-3">
          {transaction.createdAt.toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" })}
        </div>
      </div>
      <span className={`text-sm font-semibold ${positive ? "text-brand" : "text-[#C15656]"}`}>
        {positive ? "+" : ""}
        {transaction.amount.toLocaleString("fa-IR")} ت
      </span>
    </div>
  );
}
