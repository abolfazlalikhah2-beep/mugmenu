import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getTagsWithCount } from "@/features/blog/services/blog-service";
import { createTagAction, updateTagAction, deleteTagAction } from "@/features/blog/routes/actions";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { BlogTaxonomyView } from "@/components/superadmin/blog-taxonomy-view";

export default async function SuperAdminBlogTagsPage() {
  const { session } = await requireSuperAdmin();
  const [agent, tags] = await Promise.all([findUserByPhone(session.phone), getTagsWithCount()]);

  return (
    <>
      <Topbar title="برچسب‌های بلاگ" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <BlogTaxonomyView
          label="برچسب"
          items={tags.map((t) => ({ id: t.id, name: t.name, slug: t.slug, count: t._count.posts }))}
          createAction={createTagAction}
          updateAction={updateTagAction}
          deleteAction={deleteTagAction}
        />
      </PanelContent>
    </>
  );
}
