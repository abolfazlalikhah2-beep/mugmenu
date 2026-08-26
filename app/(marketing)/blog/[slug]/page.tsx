import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { BlogPostArticle } from "@/components/marketing/blog-post-article";
import { getPublishedPostBySlug } from "@/features/blog/services/blog-service";

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

  return (
    <>
      {/* Post content is authored by trusted super-admin staff (requireSuperAdmin-gated), not public user input. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main>
        <BlogPostArticle
          post={{
            title: post.title,
            content: post.content,
            coverImage: post.coverImage,
            publishedAt: post.publishedAt,
            categoryNames: post.categories.map((c) => c.category.name),
            tagNames: post.tags.map((t) => t.tag.name),
          }}
        />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
