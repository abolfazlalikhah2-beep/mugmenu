import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { BlogHero } from "@/components/marketing/blog-hero";
import { BlogSection } from "@/components/marketing/blog-section";
import { getPublishedPosts, getPublicCategories, getPublicTags } from "@/features/blog/services/blog-service";
import type { BlogGridPost } from "@/components/marketing/blog-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "بلاگ ماگ‌منو — راهنمای منوی دیجیتال و مدیریت رستوران",
  description:
    "مقاله‌ها و راهنماهای کاربردی ماگ‌منو درباره‌ی منوی دیجیتال QR، مدیریت سفارش رستوران و کافه، و رشد کسب‌وکار غذایی.",
  keywords: "بلاگ منوی دیجیتال, آموزش مدیریت رستوران, منوی QR, ماگ‌منو",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "بلاگ ماگ‌منو",
    description: "مقاله‌ها و راهنماهای کاربردی درباره‌ی منوی دیجیتال و مدیریت رستوران",
    locale: "fa_IR",
    type: "website",
  },
};

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([getPublishedPosts(), getPublicCategories(), getPublicTags()]);

  const gridPosts: BlogGridPost[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    categoryName: post.categories[0]?.category.name ?? null,
  }));

  return (
    <>
      <SiteHeader />
      <main>
        <BlogHero />
        <BlogSection
          posts={gridPosts}
          latestPosts={gridPosts.slice(0, 3)}
          categories={categories.map((c) => ({ name: c.name, count: c._count.posts }))}
          tags={tags.map((t) => t.name)}
        />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
