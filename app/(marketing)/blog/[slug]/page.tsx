import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { BlogPostArticle } from "@/components/marketing/blog-post-article";
import { BlogPostFaq } from "@/components/marketing/blog-post-faq";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/components/marketing/blog-posts-data";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — بلاگ ماگ‌منو`,
    description: post.description,
    keywords: post.tags.join(", "),
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      locale: "fa_IR",
      type: "article",
      publishedTime: post.publishedAtIso,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAtIso,
    author: { "@type": "Organization", name: post.authorName },
    publisher: { "@type": "Organization", name: "ماگ‌منو" },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      {/* JSON-LD is static, code-generated mock content — no user input reaches this tag. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main>
        <BlogPostArticle post={post} />
        <BlogPostFaq faqs={post.faqs} />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
