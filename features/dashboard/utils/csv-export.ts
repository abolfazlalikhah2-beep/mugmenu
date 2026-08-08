const BOM = String.fromCharCode(0xfeff);

function escapeCsvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Downloads a UTF-8 CSV (BOM-prefixed so Excel detects Persian text correctly). */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const lines = [header, ...rows].map((row) => row.map(escapeCsvCell).join(","));
  const csv = BOM + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
