import Link from "next/link";

export interface BlogChipCategory {
  slug: string;
  name: string;
}

export function BlogCategoryChips({
  categories,
  activeSlug,
  search,
}: {
  categories: BlogChipCategory[];
  activeSlug?: string;
  search?: string;
}) {
  function href(slug?: string) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (slug) params.set("category", slug);
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2" role="list" aria-label="فیلتر دسته‌بندی مقالات">
      <Link
        href={href(undefined)}
        className={`rounded-pill border px-4 py-2 text-[13px] font-semibold transition-colors ${
          !activeSlug ? "border-brand bg-brand text-white" : "border-border-line bg-white text-text-1 hover:border-brand/40"
        }`}
      >
        همه
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={href(category.slug)}
          className={`rounded-pill border px-4 py-2 text-[13px] font-semibold transition-colors ${
            activeSlug === category.slug
              ? "border-brand bg-brand text-white"
              : "border-border-line bg-white text-text-1 hover:border-brand/40"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
