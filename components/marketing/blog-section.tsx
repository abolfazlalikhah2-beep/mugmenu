import { BlogGrid, BlogFeaturedCard, type BlogGridPost } from "@/components/marketing/blog-grid";
import { BlogCategoryChips, type BlogChipCategory } from "@/components/marketing/blog-category-chips";
import { BlogPagination } from "@/components/marketing/blog-pagination";

export function BlogSection({
  featuredPost,
  posts,
  categories,
  activeCategorySlug,
  search,
  page,
  pageCount,
}: {
  featuredPost: BlogGridPost | null;
  posts: BlogGridPost[];
  categories: BlogChipCategory[];
  activeCategorySlug?: string;
  search?: string;
  page: number;
  pageCount: number;
}) {
  return (
    <section aria-label="مقالات بلاگ" className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 px-5 pb-16">
      <BlogCategoryChips categories={categories} activeSlug={activeCategorySlug} search={search} />
      {featuredPost && <BlogFeaturedCard post={featuredPost} />}
      <BlogGrid posts={posts} />
      <BlogPagination page={page} pageCount={pageCount} categorySlug={activeCategorySlug} search={search} />
    </section>
  );
}
