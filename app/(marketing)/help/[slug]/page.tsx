import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { HelpArticleHeader } from "@/components/marketing/help-article-header";
import { HelpArticleContent } from "@/components/marketing/help-article-content";
import { getArticleBySlug, getArticlesByCategory, getCategoryBySlug, helpArticles } from "@/components/marketing/help-data";

export function generateStaticParams() {
  return helpArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} — مرکز راهنما سِرو`,
    description: article.intro,
    alternates: {
      canonical: `/help/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.intro,
      locale: "fa_IR",
      type: "article",
    },
  };
}

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategoryBySlug(article.categorySlug);
  const categoryArticles = getArticlesByCategory(article.categorySlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.intro,
    author: { "@type": "Organization", name: "ماگ‌منو" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main>
        <HelpArticleHeader article={article} category={category} />
        <HelpArticleContent article={article} category={category} categoryArticles={categoryArticles} />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
