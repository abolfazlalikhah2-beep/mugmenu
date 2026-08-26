import { BlogGrid } from "@/components/marketing/blog-grid";
import { BlogSidebar } from "@/components/marketing/blog-sidebar";

export function BlogSection() {
  return (
    <section aria-label="مقالات بلاگ" className="mx-auto max-w-[1200px] px-5 pb-13 pt-6">
      <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
        <BlogGrid />
        <BlogSidebar />
      </div>
    </section>
  );
}
