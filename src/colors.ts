import type { Kategori } from './lib/stats';

/** Warna kategori dipakai konsisten di semua grafik dan tag tabel. */
export const KATEGORI_COLOR: Record<Kategori, string> = {
  Kecamatan: '#0f766e',
  Dinas: '#2563eb',
  Badan: '#b45309',
  Lainnya: '#64748b',
};

/** Bidang F (Wilayah/Kecamatan) disorot dengan warna Kecamatan agar maknanya konsisten. */
export const BIDANG_HIGHLIGHT = KATEGORI_COLOR.Kecamatan;
export const BIDANG_BASE = '#94a3b8';
