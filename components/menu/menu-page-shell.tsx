export function MenuPageShell({ children, dir }: { children: React.ReactNode; dir?: "rtl" | "ltr" }) {
  return (
    <div className="min-h-screen bg-[#EDEEED] md:py-10">
      <div dir={dir} className="mx-auto max-w-[880px] overflow-hidden bg-card md:rounded-card md:shadow-modal">
        {children}
      </div>
    </div>
  );
}
