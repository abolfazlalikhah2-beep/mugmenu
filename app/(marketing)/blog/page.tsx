import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { BlogHero } from "@/components/marketing/blog-hero";
import { BlogSection } from "@/components/marketing/blog-section";
import { getPublishedPostsPage, getPublicCategories } from "@/features/blog/services/blog-service";
import type { BlogGridPost } from "@/components/marketing/blog-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "بلاگ سِرو — راهنمای منوی دیجیتال و مدیریت رستوران",
  description:
    "مقاله‌ها و راهنماهای کاربردی سِرو درباره‌ی منوی دیجیتال QR، مدیریت سفارش رستوران و کافه، و رشد کسب‌وکار غذایی.",
  keywords: "بلاگ منوی دیجیتال, آموزش مدیریت رستوران, منوی QR, سِرو",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "بلاگ سِرو",
    description: "مقاله‌ها و راهنماهای کاربردی درباره‌ی منوی دیجیتال و مدیریت رستوران",
    locale: "fa_IR",
    type: "website",
  },
};

function estimateReadMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ posts, pageCount }, categories] = await Promise.all([
    getPublishedPostsPage({ categorySlug: category, search: q, page }),
    getPublicCategories(),
  ]);

  const toGridPost = (post: (typeof posts)[number]): BlogGridPost => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    categoryName: post.categories[0]?.category.name ?? null,
    readMinutes: estimateReadMinutes(post.content),
  });

  const showFeatured = page === 1 && !category && !q;
  const featuredPost = showFeatured && posts.length > 0 ? toGridPost(posts[0]) : null;
  const restPosts = (featuredPost ? posts.slice(1) : posts).map(toGridPost);

  return (
    <>
      <SiteHeader />
      <main>
        <BlogHero defaultSearch={q} />
        <BlogSection
          featuredPost={featuredPost}
          posts={restPosts}
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          activeCategorySlug={category}
          search={q}
          page={page}
          pageCount={pageCount}
        />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
