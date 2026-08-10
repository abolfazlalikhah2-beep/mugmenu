import { Calendar } from "lucide-react";
import { PayStatusBadge } from "@/components/superadmin/transaction-row";
import type { TransactionStatus } from "@/lib/generated/prisma/enums";

export interface PaymentHistoryRowData {
  id: string;
  amount: number;
  planName: string;
  status: TransactionStatus;
  createdAt: Date;
}

export function PaymentHistoryRow({ payment, index }: { payment: PaymentHistoryRowData; index: number }) {
  return (
    <div
      className="grid items-center gap-3 px-4 py-3.5 text-[13px]"
      style={{
        gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
        borderTop: index > 0 ? "1px solid #F4F4F4" : "none",
      }}
    >
      <div className="flex items-center gap-1.5 text-text-3">
        <Calendar size={15} className="text-[#9A9A9A]" />
        <span className="font-light">{payment.createdAt.toLocaleDateString("fa-IR")}</span>
      </div>
      <span className="font-medium">{payment.amount.toLocaleString("fa-IR")} تومان</span>
      <span className="font-light text-[#777]">{payment.planName}</span>
      <div className="flex justify-end">
        <PayStatusBadge status={payment.status} />
      </div>
    </div>
  );
}
