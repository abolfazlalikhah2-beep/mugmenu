import Link from "next/link";
import { BlogPostRow, type BlogPostRowData } from "@/components/superadmin/blog-post-row";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; status?: "DRAFT" | "PUBLISHED" }[] = [
  { label: "همه" },
  { label: "پیش‌نویس", status: "DRAFT" },
  { label: "منتشرشده", status: "PUBLISHED" },
];

export function BlogPostsView({
  posts,
  categories,
  status,
  categoryId,
}: {
  posts: BlogPostRowData[];
  categories: { id: string; name: string }[];
  status?: string;
  categoryId?: string;
}) {
  function filterHref(next: { status?: string; categoryId?: string }) {
    const params = new URLSearchParams();
    const nextStatus = "status" in next ? next.status : status;
    const nextCategoryId = "categoryId" in next ? next.categoryId : categoryId;
    if (nextStatus) params.set("status", nextStatus);
    if (nextCategoryId) params.set("categoryId", nextCategoryId);
    const qs = params.toString();
    return qs ? `/superadmin/blog?${qs}` : "/superadmin/blog";
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          {STATUS_FILTERS.map((f) => {
            const active = f.status === status || (!f.status && !status);
            return (
              <Link
                key={f.label}
                href={filterHref({ status: f.status })}
                className={cn(
                  "flex h-10 items-center rounded-xl px-5 text-sm",
                  active ? "bg-brand font-medium text-white" : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={filterHref({ categoryId: undefined })}
              className={cn(
                "flex h-9 items-center rounded-lg border px-3.5 text-xs",
                !categoryId ? "border-brand bg-brand/8 text-brand" : "border-[#E4E4E4] text-text-3"
              )}
            >
              همه دسته‌ها
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={filterHref({ categoryId: c.id })}
                className={cn(
                  "flex h-9 items-center rounded-lg border px-3.5 text-xs",
                  categoryId === c.id ? "border-brand bg-brand/8 text-brand" : "border-[#E4E4E4] text-text-3"
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[22px] bg-card p-[8px_6px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div
          className="grid gap-3 p-[12px_18px] text-[13px] font-light text-[#A0A0A0]"
          style={{ gridTemplateColumns: "2.4fr 1fr 1.4fr 1fr 1fr" }}
        >
          <span className="text-right">عنوان</span>
          <span className="justify-self-end">وضعیت</span>
          <span className="text-right">دسته‌بندی</span>
          <span className="text-right">تاریخ انتشار</span>
          <span />
        </div>
        {posts.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-3">مقاله‌ای یافت نشد.</div>
        ) : (
          posts.map((post, i) => <BlogPostRow key={post.id} post={post} isFirst={i === 0} />)
        )}
      </div>
    </div>
  );
}
