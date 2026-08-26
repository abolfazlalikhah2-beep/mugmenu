import Link from "next/link";
import { Plus } from "lucide-react";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getPostsForAdmin, getCategoriesWithCount } from "@/features/blog/services/blog-service";
import type { PostStatus } from "@/lib/generated/prisma/enums";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { BlogPostsView } from "@/components/superadmin/blog-posts-view";
import type { BlogPostRowData } from "@/components/superadmin/blog-post-row";

const VALID_STATUSES: PostStatus[] = ["DRAFT", "PUBLISHED"];

export default async function SuperAdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; categoryId?: string }>;
}) {
  const { status, categoryId } = await searchParams;
  const { session } = await requireSuperAdmin();
  const statusFilter = VALID_STATUSES.find((s) => s === status);

  const [agent, posts, categories] = await Promise.all([
    findUserByPhone(session.phone),
    getPostsForAdmin({ status: statusFilter, categoryId }),
    getCategoriesWithCount(),
  ]);

  const rows: BlogPostRowData[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    status: post.status,
    categoryNames: post.categories.map((c) => c.category.name),
    publishedAtLabel: post.publishedAt
      ? post.publishedAt.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" })
      : null,
  }));

  return (
    <>
      <Topbar
        title="مقالات"
        agentName={agent?.fullName ?? "سوپرادمین"}
        action={
          <Link
            href="/superadmin/blog/new"
            className="flex h-[42px] items-center gap-2 rounded-[13px] bg-brand px-[18px] text-sm font-medium text-white"
          >
            <Plus size={17} />
            افزودن مقاله
          </Link>
        }
      />
      <PanelContent>
        <BlogPostsView
          posts={rows}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          status={statusFilter}
          categoryId={categoryId}
        />
      </PanelContent>
    </>
  );
}
