import { BlogGrid, type BlogGridPost } from "@/components/marketing/blog-grid";
import { BlogSidebar, type BlogSidebarCategory } from "@/components/marketing/blog-sidebar";

export function BlogSection({
  posts,
  latestPosts,
  categories,
  tags,
}: {
  posts: BlogGridPost[];
  latestPosts: BlogGridPost[];
  categories: BlogSidebarCategory[];
  tags: string[];
}) {
  return (
    <section aria-label="مقالات بلاگ" className="mx-auto max-w-[1200px] px-5 pb-13 pt-6">
      <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
        <BlogGrid posts={posts} />
        <BlogSidebar latestPosts={latestPosts} categories={categories} tags={tags} />
      </div>
    </section>
  );
}
