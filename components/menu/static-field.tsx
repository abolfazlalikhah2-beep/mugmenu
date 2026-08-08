export function StaticField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label className="text-right text-[13px] font-light text-text-4">{label}</label>
      <div className="flex h-12 items-center rounded-input border border-border-input px-4">
        <span className="w-full text-right text-sm text-ink">{value}</span>
      </div>
    </div>
  );
}
