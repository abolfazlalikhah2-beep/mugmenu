import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { BlogPostHeader } from "@/components/marketing/blog-post-header";
import { BlogPostContent } from "@/components/marketing/blog-post-content";
import { BlogPostRelated } from "@/components/marketing/blog-post-related";
import { getPublishedPostBySlug, getRelatedPosts } from "@/features/blog/services/blog-service";
import type { BlogGridPost } from "@/components/marketing/blog-grid";

export const dynamic = "force-dynamic";

function estimateReadMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const canonical = post.canonicalUrl || `/blog/${post.slug}`;

  return {
    title: `${title} — بلاگ ماگ‌منو`,
    description,
    keywords: post.tags.map((t) => t.tag.name).join(", "),
    alternates: {
      canonical,
    },
    robots: post.seoNoIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      locale: "fa_IR",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      tags: post.tags.map((t) => t.tag.name),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.categories.map((c) => c.categoryId),
    3,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: { "@type": "Organization", name: "ماگ‌منو" },
    keywords: post.tags.map((t) => t.tag.name).join(", "),
  };

  const readMinutes = estimateReadMinutes(post.content);

  const relatedGridPosts: BlogGridPost[] = relatedPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    publishedAt: p.publishedAt,
    categoryName: p.categories[0]?.category.name ?? null,
    readMinutes: estimateReadMinutes(p.content),
  }));

  return (
    <>
      {/* Post content is authored by trusted super-admin staff (requireSuperAdmin-gated), not public user input. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main>
        <BlogPostHeader
          post={{
            title: post.title,
            coverImage: post.coverImage,
            publishedAt: post.publishedAt,
            readMinutes,
            categoryName: post.categories[0]?.category.name ?? null,
          }}
        />
        <BlogPostContent
          post={{
            content: post.content,
            tagNames: post.tags.map((t) => t.tag.name),
          }}
        />
        <BlogPostRelated posts={relatedGridPosts} />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
