/** Format angka gaya Indonesia (desimal dengan koma). */
export function fmtAngka(n: number, maxDigits = 2): string {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: maxDigits }).format(n);
}

/** Persentase satu desimal maksimum, mis. 42% atau 3,5%. */
export function fmtPersen(p: number): string {
  return `${fmtAngka(p, 1)}%`;
}
