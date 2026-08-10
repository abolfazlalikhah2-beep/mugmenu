"use client";

import { Download } from "lucide-react";
import { downloadCsv } from "@/features/dashboard/utils/csv-export";
import type { TransactionStatus } from "@/lib/generated/prisma/enums";
import type { FinanceTransactionRow } from "@/features/superadmin/services/finance-service";

const STATUS_LABEL: Record<TransactionStatus, string> = {
  PAID: "موفق",
  PENDING: "در انتظار",
  FAILED: "ناموفق",
  REFUNDED: "بازگشت وجه",
};

export function ExportTransactionsButton({ transactions }: { transactions: FinanceTransactionRow[] }) {
  function handleExport() {
    downloadCsv(
      "تراکنش‌های-اشتراک.csv",
      ["پرداخت‌کننده", "رستوران", "مبلغ (تومان)", "پلن", "تاریخ", "وضعیت"],
      transactions.map((t) => [
        t.payerName,
        t.storeName,
        t.amount,
        t.planName,
        t.createdAt.toLocaleDateString("fa-IR"),
        STATUS_LABEL[t.status],
      ])
    );
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex h-11 items-center gap-2 rounded-[13px] border border-[#DDD] bg-card px-5 text-sm font-medium text-brand"
    >
      <Download size={18} />
      خروجی اکسل
    </button>
  );
}
