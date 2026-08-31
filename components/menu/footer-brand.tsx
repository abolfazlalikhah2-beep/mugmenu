export function FooterBrand() {
  return (
    <div className="mt-auto flex flex-col items-center gap-3 py-6">
      <span className="h-px w-3/5 bg-border-line" />
      {/* Same domain-credit line as the printed receipt (components/dashboard/kitchen-receipt.tsx) */}
      <span dir="ltr" className="font-mont text-[10px] text-text-3">
        Powered by{" "}
        <a href="https://serwapp.com/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
          serwapp.com
        </a>
      </span>
    </div>
  );
}
