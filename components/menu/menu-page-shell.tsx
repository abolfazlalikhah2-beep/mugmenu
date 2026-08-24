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
        // Fixed width on desktop (the 880px frame from Menu Flow.dc.html),
        // not a max-width — with `w-full` alone the card could size down to
        // its content on short/empty pages instead of staying constant; only
        // height should ever depend on content.
        className="mx-auto flex min-h-screen w-full min-w-0 flex-col overflow-hidden bg-card md:min-h-0 md:w-[880px] md:rounded-card md:shadow-modal"
      >
        {children}
      </div>
    </div>
  );
}
