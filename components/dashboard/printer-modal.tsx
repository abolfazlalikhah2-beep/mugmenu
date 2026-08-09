"use client";

import { useActionState, useEffect, useState } from "react";
import { Wifi, Usb, Bluetooth, Printer as PrinterIcon } from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import {
  createPrinterAction,
  updatePrinterAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";
import { cn } from "@/lib/utils";

export type PrinterConnectionType = "NETWORK" | "USB" | "BLUETOOTH";

export interface PrinterFormValue {
  id: string;
  name: string;
  model: string | null;
  connectionType: PrinterConnectionType;
  ipAddress: string | null;
  port: string | null;
  paperSize: string;
  copies: number;
  isConnected: boolean;
  lastTestedAt: Date | null;
}

const CONN_OPTIONS: { value: PrinterConnectionType; label: string; icon: typeof Wifi }[] = [
  { value: "NETWORK", label: "شبکه / IP", icon: Wifi },
  { value: "USB", label: "USB", icon: Usb },
  { value: "BLUETOOTH", label: "بلوتوث", icon: Bluetooth },
];

const initialState: ActionState = {};

function selectClass() {
  return "h-[50px] rounded-input border border-border-input px-[18px] text-right text-sm text-[#333] outline-none focus:border-brand";
}

function lastTestedLabel(d: Date | null) {
  if (!d) return "هرگز تست نشده";
  return new Date(d).toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" });
}

export function PrinterModal({
  printer,
  onClose,
}: {
  printer: PrinterFormValue | null;
  onClose: () => void;
}) {
  const action = printer ? updatePrinterAction.bind(null, printer.id) : createPrinterAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [connectionType, setConnectionType] = useState<PrinterConnectionType>(
    printer?.connectionType ?? "NETWORK"
  );

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title={printer ? "ویرایش پرینتر" : "افزودن پرینتر جدید"}
      subtitle={printer ? "اطلاعات اتصال دستگاه را ویرایش کنید" : "یک دستگاه چاپ رسید جدید متصل کنید"}
      maxWidth={600}
      onClose={onClose}
      footer={
        <>
          <button
            type="submit"
            form="printer-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
          >
            <PrinterIcon size={18} />
            {pending ? "در حال تست…" : "تست و ذخیره"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[50px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
          >
            انصراف
          </button>
        </>
      }
    >
      <form id="printer-form" action={formAction} className="flex flex-col gap-[18px]">
        <input type="hidden" name="connectionType" value={connectionType} />

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">نوع اتصال</label>
          <div className="flex gap-2.5">
            {CONN_OPTIONS.map((t) => {
              const active = t.value === connectionType;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setConnectionType(t.value)}
                  className={cn(
                    "flex h-12 flex-1 items-center justify-center gap-2 rounded-[13px] text-sm",
                    active
                      ? "bg-brand font-medium text-white"
                      : "border-[0.3px] border-border-chip bg-chip text-[#666]"
                  )}
                >
                  <t.icon size={18} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            name="name"
            label="نام دستگاه"
            placeholder="مثلاً پرینتر آشپزخانه"
            defaultValue={printer?.name}
            required
            className="flex-1"
          />
          <Input
            name="model"
            label="مدل دستگاه"
            placeholder="مثلاً Epson TM-T20III"
            dir="ltr"
            defaultValue={printer?.model ?? ""}
            className="flex-1 text-right"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            name="ipAddress"
            label="آدرس IP یا شناسه اتصال"
            placeholder="192.168.1.42"
            dir="ltr"
            defaultValue={printer?.ipAddress ?? ""}
            className="flex-1 text-right"
          />
          <Input
            name="port"
            label="پورت"
            placeholder="9100"
            dir="ltr"
            defaultValue={printer?.port ?? ""}
            className="flex-1 text-right"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">اندازه کاغذ</label>
            <select name="paperSize" defaultValue={printer?.paperSize ?? "80mm"} className={selectClass()}>
              <option value="58mm">۵۸ میلی‌متر</option>
              <option value="80mm">۸۰ میلی‌متر</option>
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">تعداد کپی رسید</label>
            <select name="copies" defaultValue={String(printer?.copies ?? 1)} className={selectClass()}>
              <option value="1">۱ نسخه</option>
              <option value="2">۲ نسخه</option>
              <option value="3">۳ نسخه</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_16px]">
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#EAF3EB]">
            <PrinterIcon size={18} className="text-brand" />
          </div>
          <div className="flex-1 text-right">
            <div className="text-[13px] font-medium">وضعیت اتصال</div>
            <div className="mt-0.5 text-[11px] font-light text-text-3">
              {printer ? lastTestedLabel(printer.lastTestedAt) : "برای بررسی اتصال، تست چاپ بگیرید"}
            </div>
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: printer ? (printer.isConnected ? "#1E8E4E" : "#B0403F") : "#9F9F9F" }}
          >
            {printer ? (printer.isConnected ? "متصل" : "قطع") : "بررسی نشده"}
          </span>
        </div>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
