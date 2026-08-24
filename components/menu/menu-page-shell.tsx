export function MenuPageShell({ children, dir }: { children: React.ReactNode; dir?: "rtl" | "ltr" }) {
  return (
    <div className="min-h-screen bg-[#EDEEED] md:flex md:items-center md:justify-center md:py-10">
      {/* flex-col + min-h-screen on mobile keeps FooterBrand (the last child,
          via mt-auto) pinned to the viewport bottom instead of floating in
          the middle when a page's content is shorter than the screen.
          Desktop drops min-h-screen (min-h-0) so the card sizes to its
          content and the wrapper above centers it vertically instead. */}
      <div
        dir={dir}
        className="mx-auto flex min-h-screen w-full min-w-0 max-w-[880px] flex-col overflow-hidden bg-card md:min-h-0 md:rounded-card md:shadow-modal"
      >
        {children}
      </div>
    </div>
  );
}
