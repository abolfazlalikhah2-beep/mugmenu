import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getCategoriesWithCount } from "@/features/blog/services/blog-service";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/features/blog/routes/actions";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { BlogTaxonomyView } from "@/components/superadmin/blog-taxonomy-view";

export default async function SuperAdminBlogCategoriesPage() {
  const { session } = await requireSuperAdmin();
  const [agent, categories] = await Promise.all([findUserByPhone(session.phone), getCategoriesWithCount()]);

  return (
    <>
      <Topbar title="دسته‌بندی‌های بلاگ" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <BlogTaxonomyView
          label="دسته"
          items={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.posts }))}
          createAction={createCategoryAction}
          updateAction={updateCategoryAction}
          deleteAction={deleteCategoryAction}
        />
      </PanelContent>
    </>
  );
}
