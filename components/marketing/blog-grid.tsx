type Post = {
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  gradient: string;
};

const posts: Post[] = [
  {
    category: "منوی دیجیتال",
    date: "۱۴ مرداد ۱۴۰۴",
    readTime: "۶ دقیقه مطالعه",
    title: "چرا رستوران شما به منوی QR نیاز دارد؟",
    excerpt: "منوی کاغذی جای خود را به منوی دیجیتال داده؛ مزایای منوی QR برای رستوران‌ها را مرور می‌کنیم.",
    gradient: "from-[#cfe6d2] to-[#8fc998]",
  },
  {
    category: "رشد کسب‌وکار",
    date: "۷ مرداد ۱۴۰۴",
    readTime: "۸ دقیقه مطالعه",
    title: "کدام رستوران‌ها بیشترین سود را از منوی دیجیتال می‌برند؟",
    excerpt: "بررسی چند الگوی واقعی از کافه و رستوران‌هایی که با منوی دیجیتال، سرعت سرویس‌دهی خود را بالا برده‌اند.",
    gradient: "from-[#bfe0f0] to-[#8ec3e0]",
  },
  {
    category: "آموزش پنل",
    date: "۱ مرداد ۱۴۰۴",
    readTime: "۵ دقیقه مطالعه",
    title: "راهنمای راه‌اندازی منوی دیجیتال در ۵ دقیقه",
    excerpt: "قدم‌به‌قدم یاد بگیرید چطور در کمتر از پنج دقیقه منوی دیجیتال رستوران‌تان را بسازید و منتشر کنید.",
    gradient: "from-[#e8d3b8] to-[#cdae86]",
  },
  {
    category: "مدیریت سفارش",
    date: "۲۴ تیر ۱۴۰۴",
    readTime: "۷ دقیقه مطالعه",
    title: "سه حالت سفارش؛ کدام برای رستوران شما مناسب است؟",
    excerpt: "تفاوت سفارش روی میز، بیرون‌بر و ارسال با پیک و بهترین ترکیب برای انواع کسب‌وکار غذایی.",
    gradient: "from-[#e8d3b8] to-[#cdae86]",
  },
  {
    category: "رشد کسب‌وکار",
    date: "۱۵ تیر ۱۴۰۴",
    readTime: "۹ دقیقه مطالعه",
    title: "چطور با گزارش فروش تصمیم بهتری بگیریم؟",
    excerpt: "با تحلیل پرفروش‌ترین آیتم‌ها و ساعات اوج، منو و موجودی رستوران را هوشمندانه مدیریت کنید.",
    gradient: "from-[#bfe0f0] to-[#8ec3e0]",
  },
  {
    category: "منوی دیجیتال",
    date: "۶ تیر ۱۴۰۴",
    readTime: "۴ دقیقه مطالعه",
    title: "۷ نکته برای طراحی منوی دیجیتال جذاب",
    excerpt: "از عکس خوب تا دسته‌بندی درست؛ نکاتی که فروش منوی دیجیتال شما را بیشتر می‌کند.",
    gradient: "from-[#cfe6d2] to-[#8fc998]",
  },
];

export function BlogGrid() {
  return (
    <div className="grid gap-5.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
      {posts.map((post) => (
        <BlogCard key={post.title} post={post} />
      ))}
    </div>
  );
}

function BlogCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-card-sm border border-border-line bg-card shadow-float transition-shadow hover:shadow-modal">
      <div aria-hidden="true" className={`relative flex h-42.5 items-center justify-center bg-gradient-to-br ${post.gradient}`}>
        <span className="absolute end-3.5 top-3.5 rounded-pill bg-white/92 px-3 py-1.25 text-xs font-medium text-brand">
          {post.category}
        </span>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/85">
          <path d="M6 3h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8 9h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-1 flex-col p-5.5">
        <div className="flex items-center gap-2.5 text-xs font-light text-text-3">
          <span>{post.date}</span>
          <span aria-hidden="true" className="h-0.75 w-0.75 rounded-full bg-text-4" />
          <span>{post.readTime}</span>
        </div>
        <h3 className="mt-2.5 text-[17px] font-medium leading-[1.7] text-ink">{post.title}</h3>
        <p className="mt-2.25 flex-1 text-sm font-light leading-[1.9] text-text-1">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
          ادامه مطلب
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </article>
  );
}
