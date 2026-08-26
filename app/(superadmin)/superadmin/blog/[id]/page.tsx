import { notFound } from "next/navigation";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getPostForEdit, getCategoriesWithCount, getTagsWithCount } from "@/features/blog/services/blog-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { BlogPostForm, type BlogPostFormValue } from "@/components/superadmin/blog-post-form";

export default async function SuperAdminBlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session } = await requireSuperAdmin();
  const isNew = id === "new";

  const [agent, categories, tags, post] = await Promise.all([
    findUserByPhone(session.phone),
    getCategoriesWithCount(),
    getTagsWithCount(),
    isNew ? Promise.resolve(null) : getPostForEdit(id),
  ]);

  if (!isNew && !post) notFound();

  const formValue: BlogPostFormValue | null = post
    ? {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        status: post.status,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : null,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        seoNoIndex: post.seoNoIndex,
        canonicalUrl: post.canonicalUrl,
        categoryIds: post.categories.map((c) => c.categoryId),
        tagIds: post.tags.map((t) => t.tagId),
      }
    : null;

  return (
    <>
      <Topbar title={isNew ? "مقاله جدید" : "ویرایش مقاله"} agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <BlogPostForm
          post={formValue}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          tags={tags.map((t) => ({ id: t.id, name: t.name }))}
        />
      </PanelContent>
    </>
  );
}
