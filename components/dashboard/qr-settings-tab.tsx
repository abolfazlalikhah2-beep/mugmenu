"use client";

import { useActionState, useRef, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Toggle } from "@/components/dashboard/toggle";
import { QrCard, type QrCardBusiness } from "@/components/dashboard/qr-card";
import { updateQrSettingsAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface QrSettingsFormValue extends QrCardBusiness {
  slug: string;
  qrShowInfo: boolean;
  qrShowHours: boolean;
  qrShowLogo: boolean;
}

const initialState: ActionState = {};

function ToggleRow({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm font-light text-[#666]">{label}</span>
      <input type="hidden" name={name} value={checked ? "on" : ""} />
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export function QrSettingsTab({ business }: { business: QrSettingsFormValue }) {
  const [state, formAction, pending] = useActionState(updateQrSettingsAction, initialState);
  const [showInfo, setShowInfo] = useState(business.qrShowInfo);
  const [showHours, setShowHours] = useState(business.qrShowHours);
  const [showLogo, setShowLogo] = useState(business.qrShowLogo);
  const [downloading, setDownloading] = useState<"png" | "pdf" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${business.slug}` : `/${business.slug}`;

  async function handleDownloadPng() {
    if (!cardRef.current) return;
    setDownloading("png");
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `qr-${business.slug}.png`;
      a.click();
    } finally {
      setDownloading(null);
    }
  }

  async function handleDownloadPdf() {
    if (!cardRef.current) return;
    setDownloading("pdf");
    try {
      const [{ toPng }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const { width, height } = cardRef.current.getBoundingClientRect();
      const pdf = new jsPDF({
        orientation: width >= height ? "landscape" : "portrait",
        unit: "px",
        format: [width, height],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`qr-${business.slug}.pdf`);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="flex flex-col gap-[22px] lg:flex-row lg:items-start">
      <div className="flex justify-center lg:w-[360px] lg:shrink-0">
        <QrCard
          ref={cardRef}
          business={business}
          publicUrl={publicUrl}
          showInfo={showInfo}
          showHours={showHours}
          showLogo={showLogo}
        />
      </div>

      <form action={formAction} className="flex flex-1 flex-col gap-[18px]">
        <div className="flex flex-col gap-1 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="pb-3 text-right text-base font-semibold">محتوای کارت QR</div>
          <ToggleRow name="qrShowInfo" label="نمایش نام و آدرس" checked={showInfo} onChange={setShowInfo} />
          <div className="h-px bg-[#F4F4F4]" />
          <ToggleRow name="qrShowHours" label="نمایش ساعت کاری" checked={showHours} onChange={setShowHours} />
          <div className="h-px bg-[#F4F4F4]" />
          <ToggleRow name="qrShowLogo" label="نمایش لوگوی ماگ‌منو" checked={showLogo} onChange={setShowLogo} />
        </div>

        <div className="flex flex-col gap-3.5 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="text-right text-base font-semibold">خروجی</div>
          <p className="-mt-1 text-right text-xs font-light leading-7 text-text-3">
            کارت QR را برای چاپ روی میز یا اشتراک‌گذاری دانلود کن.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={downloading !== null}
              className="flex h-[52px] flex-1 items-center justify-center gap-2.5 rounded-2xl bg-brand text-[15px] font-medium text-white disabled:opacity-60"
            >
              <Download size={18} />
              {downloading === "png" ? "در حال آماده‌سازی…" : "دانلود عکس"}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading !== null}
              className="flex h-[52px] flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#DDD] bg-card text-[15px] font-medium text-brand disabled:opacity-60"
            >
              <FileText size={18} />
              {downloading === "pdf" ? "در حال آماده‌سازی…" : "دانلود PDF"}
            </button>
          </div>
        </div>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
        <button
          type="submit"
          disabled={pending}
          className="flex h-[50px] items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60 md:w-fit md:self-start md:px-10"
        >
          {pending ? "در حال ذخیره…" : "ذخیره تنظیمات"}
        </button>
      </form>
    </div>
  );
}
