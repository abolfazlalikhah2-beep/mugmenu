"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Printer as PrinterIcon, Wifi, Lock } from "lucide-react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { PrinterRow } from "@/components/dashboard/printer-row";
import { PrinterModal, type PrinterFormValue } from "@/components/dashboard/printer-modal";

const CONN_LABEL: Record<string, string> = { NETWORK: "شبکه", USB: "USB", BLUETOOTH: "بلوتوث" };

function connectionLabel(p: PrinterFormValue) {
  const detail = p.connectionType === "USB" ? p.port : p.ipAddress;
  return detail ? `${CONN_LABEL[p.connectionType]} · ${detail}` : CONN_LABEL[p.connectionType];
}

function lastTestedShort(d: Date | null) {
  if (!d) return "هنوز تست نشده";
  return `آخرین تست: ${new Date(d).toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" })}`;
}

export function PrinterSettingsTab({ printers, limit }: { printers: PrinterFormValue[]; limit: string | null }) {
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");

  const primary = useMemo(() => printers.find((p) => p.isConnected) ?? null, [printers]);
  const editing = modal !== "closed" && modal !== "create" ? printers.find((p) => p.id === modal) ?? null : null;
  const maxPrinters = limit && limit !== "unlimited" ? Number(limit) : null;
  const limitReached = maxPrinters !== null && printers.length >= maxPrinters;

  return (
    <div className="flex flex-col gap-[18px] sm:gap-[22px]">
      {primary ? (
        <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-[18px] border border-[#CDE6D0] bg-[#F3FAF4] p-[16px_18px] sm:p-[18px_24px]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px] bg-[#E5F0E6]">
              <PrinterIcon size={26} className="text-brand" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-[rgba(16,211,123,0.22)]" />
                  <span className="h-[7px] w-[7px] rounded-full bg-[#10D37B]" />
                </span>
                <span className="text-[15px] font-semibold text-[#1E8E4E]">متصل</span>
              </div>
              <div className="mt-0.5 text-xs font-light text-[#5B8C68]">
                {primary.name} · {lastTestedShort(primary.lastTestedAt)}
              </div>
            </div>
          </div>
          <div className="flex h-[38px] items-center gap-2 rounded-[11px] bg-white px-3.5">
            <Wifi size={18} className="text-brand" />
            <span className="text-[13px] font-medium text-brand">شبکه محلی</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3.5 rounded-[18px] border border-[#F0F0F0] bg-[#FAFBFA] p-[16px_18px] sm:p-[18px_24px]">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px] bg-[#F1F1F1]">
            <PrinterIcon size={26} className="text-[#9A9A9A]" />
          </div>
          <div className="text-right">
            <div className="text-[15px] font-semibold text-[#8A8A8A]">پرینتری متصل نیست</div>
            <div className="mt-0.5 text-xs font-light text-text-3">
              یک پرینتر اضافه کن و برای بررسی اتصال، تست چاپ بگیر.
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-right">
          <div className="text-[15px] font-semibold sm:text-base">پرینترهای متصل</div>
          <div className="mt-0.5 text-xs font-light text-text-3">
            {printers.length.toLocaleString("fa-IR")} دستگاه ثبت‌شده
          </div>
        </div>
        {limitReached ? (
          <Link
            href="/dashboard/account"
            title={`پلن شما حداکثر ${maxPrinters?.toLocaleString("fa-IR")} پرینتر را پشتیبانی می‌کند`}
            className="flex h-[42px] items-center gap-2 rounded-[13px] bg-[#F0F0F0] px-[18px] text-sm font-medium text-[#8A8A8A]"
          >
            <Lock size={15} />
            افزودن پرینتر جدید
          </Link>
        ) : (
          <PrimaryButton onClick={() => setModal("create")}>افزودن پرینتر جدید</PrimaryButton>
        )}
      </div>

      <div className="flex flex-col gap-1 rounded-[22px] bg-card p-[8px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[8px_20px]">
        {printers.length === 0 && (
          <div className="p-6 text-center text-sm text-text-3">هنوز پرینتری ثبت نشده است.</div>
        )}
        {printers.map((p) => (
          <PrinterRow
            key={p.id}
            printer={{
              id: p.id,
              name: p.name,
              model: p.model,
              connectionLabel: connectionLabel(p),
              isConnected: p.isConnected,
            }}
            onEdit={() => setModal(p.id)}
          />
        ))}
      </div>

      {modal === "create" && <PrinterModal printer={null} onClose={() => setModal("closed")} />}
      {editing && <PrinterModal printer={editing} onClose={() => setModal("closed")} />}
    </div>
  );
}
