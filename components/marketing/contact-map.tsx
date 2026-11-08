export function ContactMap() {
  return (
    <div className="relative flex h-80 w-full flex-none flex-col items-center justify-end overflow-hidden rounded-card-sm border border-[#e4e6e4] bg-[#eaf0ea] p-4 sm:h-full sm:w-[380px]">
      <div aria-hidden="true" className="absolute inset-0">
        {[-10, 110, 230, 350, 470].map((left) => (
          <span
            key={left}
            className="absolute top-1/2 h-[900px] w-4 -translate-y-1/2 -rotate-[25deg] bg-white/70"
            style={{ left }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-1">
        <span className="flex h-12 w-12 items-center justify-center rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] text-brand">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </span>
        <span className="text-xs font-extrabold text-[#1f5c26]">ماگ‌منو</span>
      </div>

      <div className="relative mt-5 flex items-center gap-1.5 rounded-input bg-white px-3 py-2.5 text-xs font-semibold text-ink shadow-float">
        قم، بلوار جمهوری، گلستان ۸، ساختمان حافظ
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-brand">
          <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </div>
    </div>
  );
}
