import Link from "next/link";

export function BlogPagination({
  page,
  pageCount,
  categorySlug,
  search,
}: {
  page: number;
  pageCount: number;
  categorySlug?: string;
  search?: string;
}) {
  if (pageCount <= 1) return null;

  function href(target: number) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (categorySlug) params.set("category", categorySlug);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  }

  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1].filter((p) => p >= 1 && p <= pageCount));
  const sorted = Array.from(pages).sort((a, b) => a - b);

  return (
    <nav aria-label="صفحه‌بندی مقالات" className="flex items-center justify-center gap-1.5">
      <Link
        href={href(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`flex size-10 items-center justify-center rounded-input border border-border-line bg-white ${
          page === 1 ? "pointer-events-none opacity-40" : "hover:border-brand/40"
        }`}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {sorted.map((p, i) => {
        const prev = sorted[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showEllipsis && <span className="flex size-10 items-center justify-center text-sm text-text-3">…</span>}
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={`flex size-10 items-center justify-center rounded-input border text-sm font-bold ${
                p === page ? "border-brand bg-brand text-white" : "border-border-line bg-white text-text-1 hover:border-brand/40"
              }`}
            >
              {p.toLocaleString("fa-IR")}
            </Link>
          </span>
        );
      })}

      <Link
        href={href(Math.min(pageCount, page + 1))}
        aria-disabled={page === pageCount}
        className={`flex size-10 items-center justify-center rounded-input border border-border-line bg-white ${
          page === pageCount ? "pointer-events-none opacity-40" : "hover:border-brand/40"
        }`}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </nav>
  );
}
