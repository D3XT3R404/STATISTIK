export interface SectionLink {
  id: string;
  label: string;
}

/** Urutan dan label navigasi. Setiap id harus sesuai dengan elemen <section id="..."> */
export const SECTIONS: SectionLink[] = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'distribusi-jenis', label: 'Distribusi Jenis' },
  { id: 'analisis-bidang', label: 'Analisis Bidang' },
  { id: 'panjang-nama', label: 'Panjang Nama' },
  { id: 'data-lengkap', label: 'Data Lengkap' },
  { id: 'kesimpulan', label: 'Kesimpulan' },
  { id: 'sumber', label: 'Sumber' },
];
