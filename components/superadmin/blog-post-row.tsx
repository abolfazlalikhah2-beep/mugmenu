"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deletePostAction } from "@/features/blog/routes/actions";

const STATUS_META: Record<"DRAFT" | "PUBLISHED", { label: string; fg: string; bg: string }> = {
  DRAFT: { label: "پیش‌نویس", fg: "#8A8A8A", bg: "#F4F5F4" },
  PUBLISHED: { label: "منتشرشده", fg: "#0F7A3B", bg: "#E5F0E6" },
};

export interface BlogPostRowData {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  categoryNames: string[];
  publishedAtLabel: string | null;
}

export function BlogPostRow({ post, isFirst }: { post: BlogPostRowData; isFirst: boolean }) {
  const [pending, startTransition] = useTransition();
  const meta = STATUS_META[post.status];

  function handleDelete() {
    if (!confirm(`مقاله «${post.title}» حذف شود؟`)) return;
    startTransition(async () => {
      await deletePostAction(post.id);
    });
  }

  return (
    <div
      className="grid items-center gap-3 py-3.5 text-sm"
      style={{ gridTemplateColumns: "2.4fr 1fr 1.4fr 1fr 1fr", borderTop: isFirst ? "none" : "1px solid #F4F4F4" }}
    >
      <Link href={`/superadmin/blog/${post.id}`} className="truncate text-right font-medium hover:text-brand">
        {post.title}
      </Link>
      <span
        className="justify-self-end whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium"
        style={{ color: meta.fg, background: meta.bg }}
      >
        {meta.label}
      </span>
      <span className="truncate text-right text-xs font-light text-text-3">{post.categoryNames.join("، ") || "—"}</span>
      <span className="text-right text-xs font-light text-text-3">{post.publishedAtLabel ?? "—"}</span>
      <div className="flex justify-end gap-2">
        <Link
          href={`/superadmin/blog/${post.id}`}
          aria-label={`ویرایش ${post.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4E4E4] text-[#5F5F5F]"
        >
          <Pencil size={15} />
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label={`حذف ${post.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F0DADA] text-[#C15656] disabled:opacity-60"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
