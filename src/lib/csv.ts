/** Membungkus satu sel CSV: pakai tanda kutip bila memuat koma, kutip, atau baris baru. */
function escapeCell(value: string | number): string {
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Menghasilkan teks CSV UTF-8 (dengan BOM agar Excel membaca karakter Indonesia dengan benar). */
export function toCsv(header: string[], body: (string | number)[][]): string {
  const lines = [header, ...body].map((row) => row.map(escapeCell).join(','));
  return '\uFEFF' + lines.join('\r\n') + '\r\n';
}

export function downloadTextFile(filename: string, content: string, mime = 'text/csv;charset=utf-8'): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
