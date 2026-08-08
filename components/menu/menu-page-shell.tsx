export function MenuPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#EDEEED] md:py-10">
      <div className="mx-auto max-w-[880px] overflow-hidden bg-card md:rounded-card md:shadow-modal">
        {children}
      </div>
    </div>
  );
}
