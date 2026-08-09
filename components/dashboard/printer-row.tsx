"use client";

import { useTransition } from "react";
import { Printer as PrinterIcon, Pencil } from "lucide-react";
import { testPrinterAction } from "@/features/dashboard/routes/actions";

export interface PrinterRowData {
  id: string;
  name: string;
  model: string | null;
  connectionLabel: string;
  isConnected: boolean;
}

function Dot({ on }: { on: boolean }) {
  return (
    <span className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: on ? "rgba(16,211,123,0.22)" : "rgba(229,72,77,0.16)" }}
      />
      <span className="h-[7px] w-[7px] rounded-full" style={{ background: on ? "#10D37B" : "#E5484D" }} />
    </span>
  );
}

export function PrinterRow({
  printer,
  onEdit,
}: {
  printer: PrinterRowData;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleTest() {
    startTransition(async () => {
      await testPrinterAction(printer.id);
    });
  }

  return (
    <div
      className="flex items-center gap-3 border-t border-[#F4F4F4] py-3.5 px-2 first:border-t-0 sm:gap-4 sm:px-3.5 sm:py-4"
      style={{ opacity: printer.isConnected ? 1 : 0.85 }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] sm:h-12 sm:w-12"
        style={{ background: printer.isConnected ? "#E5F0E6" : "#F1F1F1" }}
      >
        <PrinterIcon size={22} className={printer.isConnected ? "text-brand" : "text-[#9A9A9A]"} />
      </div>
      <div className="min-w-0 flex-1 text-right">
        <div className="flex items-center gap-2">
          <Dot on={printer.isConnected} />
          <span className="truncate text-sm font-medium sm:text-[15px]">{printer.name}</span>
        </div>
        <div dir="rtl" className="mt-1 truncate text-xs font-light text-text-3">
          {[printer.model, printer.connectionLabel].filter(Boolean).join(" · ")}
        </div>
      </div>
      <span
        className="hidden shrink-0 rounded-[9px] px-3 py-[5px] text-xs font-medium sm:block"
        style={{
          color: printer.isConnected ? "#1E8E4E" : "#B0403F",
          background: printer.isConnected ? "#E5F0E6" : "#FBECEC",
        }}
      >
        {printer.isConnected ? "متصل" : "قطع"}
      </span>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleTest}
          disabled={pending}
          aria-label={`تست ${printer.name}`}
          className="flex h-9 items-center gap-1.5 rounded-[11px] bg-[#F4F5F4] px-3.5 text-[13px] text-[#5A5A5A] disabled:opacity-60"
        >
          <PrinterIcon size={16} />
          <span className="hidden sm:inline">{pending ? "در حال تست…" : "تست"}</span>
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`ویرایش ${printer.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#F4F5F4]"
        >
          <Pencil size={18} className="text-[#5A5A5A]" />
        </button>
      </div>
    </div>
  );
}
