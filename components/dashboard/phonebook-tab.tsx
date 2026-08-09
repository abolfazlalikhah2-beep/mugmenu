"use client";

import { useMemo, useRef, useState } from "react";
import { Search, FileSpreadsheet, FileText } from "lucide-react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { ContactRow, type ContactRowData } from "@/components/dashboard/contact-row";
import { ContactModal } from "@/components/dashboard/contact-modal";
import { downloadCsv } from "@/features/dashboard/utils/csv-export";

export function PhonebookTab({ contacts }: { contacts: ContactRowData[] }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [downloading, setDownloading] = useState<"pdf" | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [contacts, search]);

  function handleExportCsv() {
    downloadCsv(
      "دفترچه-شماره.csv",
      ["نام", "شماره تلفن"],
      filtered.map((c) => [c.name, c.phone])
    );
  }

  async function handleExportPdf() {
    if (!printRef.current) return;
    setDownloading("pdf");
    try {
      const [{ toPng }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      const dataUrl = await toPng(printRef.current, { pixelRatio: 2 });
      const { width, height } = printRef.current.getBoundingClientRect();
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [width, height] });
      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save("دفترچه-شماره.pdf");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex h-[44px] w-full items-center gap-2.5 rounded-[13px] bg-card px-4 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] sm:w-[300px]">
          <Search size={18} className="text-[#B0B0B0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام یا شماره…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex h-11 items-center gap-2 rounded-xl border border-[#DDD] bg-card px-4 text-sm font-medium text-[#1E7C3A]"
          >
            <FileSpreadsheet size={18} />
            خروجی اکسل
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={downloading !== null}
            className="flex h-11 items-center gap-2 rounded-xl border border-[#DDD] bg-card px-4 text-sm font-medium text-[#C0392B] disabled:opacity-60"
          >
            <FileText size={18} />
            {downloading === "pdf" ? "در حال آماده‌سازی…" : "خروجی PDF"}
          </button>
          <PrimaryButton onClick={() => setModal(true)}>افزودن شماره</PrimaryButton>
        </div>
      </div>

      <div className="flex flex-col gap-1 rounded-[22px] bg-card p-[8px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[8px_20px]">
        <div className="p-[10px_6px] text-right text-[13px] font-light text-text-3 sm:p-[12px_14px]">
          {filtered.length.toLocaleString("fa-IR")} مخاطب در دفترچه
        </div>
        {filtered.length === 0 && (
          <div className="p-6 text-center text-sm text-text-3">مخاطبی یافت نشد.</div>
        )}
        {filtered.map((c, i) => (
          <ContactRow key={c.id} contact={c} index={i} />
        ))}
      </div>

      {modal && <ContactModal onClose={() => setModal(false)} />}

      <div
        ref={printRef}
        style={{
          position: "fixed",
          top: -99999,
          left: -99999,
          width: 480,
          background: "#fff",
          padding: 24,
          direction: "rtl",
          fontFamily: "Vazirmatn, sans-serif",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, textAlign: "right" }}>دفترچه شماره</div>
        {filtered.map((c, i) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderTop: i > 0 ? "1px solid #eee" : "none",
              fontSize: 13,
            }}
          >
            <span dir="ltr">{c.phone}</span>
            <span>{c.name}</span>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ fontSize: 13, color: "#999" }}>مخاطبی ثبت نشده است.</div>}
      </div>
    </div>
  );
}
