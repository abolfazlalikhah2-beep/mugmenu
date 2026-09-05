import Link from "next/link";
import { getPublishedPosts } from "@/features/blog/services/blog-service";
import { BlogGrid, type BlogGridPost } from "@/components/marketing/blog-grid";

export async function AboutBlogPreview() {
  const posts = await getPublishedPosts();
  const latestPosts: BlogGridPost[] = posts.slice(0, 3).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    categoryName: post.categories[0]?.category.name ?? null,
  }));

  return (
    <section aria-labelledby="about-blog-heading" className="mx-auto max-w-[1200px] px-5 py-11.5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 3h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M8 9h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            بلاگ سِرو
          </span>
          <h2
            id="about-blog-heading"
            className="mt-4 text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            آخرین مقالات ما
          </h2>
        </div>
        <Link
          href="/blog"
          className="whitespace-nowrap rounded-input border-[1.5px] border-brand/22 bg-white px-6 py-3 text-[15px] font-medium text-brand transition-colors hover:bg-brand/5"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="mt-9">
        <BlogGrid posts={latestPosts} />
      </div>
    </section>
  );
}
