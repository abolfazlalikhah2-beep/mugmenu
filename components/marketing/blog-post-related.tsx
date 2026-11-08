import { BlogGrid, type BlogGridPost } from "@/components/marketing/blog-grid";

export function BlogPostRelated({ posts }: { posts: BlogGridPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="px-5 pb-14 pt-4">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="related-heading" className="text-center text-2xl font-black text-ink">
          مقالات مرتبط
        </h2>
        <div className="mt-9">
          <BlogGrid posts={posts} />
        </div>
      </div>
    </section>
  );
}
