// Placeholder slots for real client logos/names — content to be added later
// (see CLAUDE.md-adjacent task notes). Keeping a fixed count of empty slots
// so the grid doesn't look broken before real customers are added.
const PLACEHOLDER_SLOTS = Array.from({ length: 8 }, (_, i) => i);

export function CustomersGrid() {
  return (
    <section aria-label="نمونه کسب‌وکارهای مشتری" className="px-5 py-9">
      <div className="mx-auto grid max-w-[1200px] gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        {PLACEHOLDER_SLOTS.map((i) => (
          <div
            key={i}
            className="flex h-28 flex-col items-center justify-center gap-2 rounded-card-sm border border-dashed border-border-input bg-card text-text-3"
          >
            <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 15l3-3.5 2.5 2.5L18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-light">به‌زودی</span>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-[56ch] text-center text-[12.5px] font-light text-text-2">
        لوگو و نام کسب‌وکارهای مشتری سِرو به‌زودی در این صفحه اضافه می‌شود.
      </p>
    </section>
  );
}
