import { dataset, type BidangMeta, type PerangkatDaerah } from '../data/dataset';

/* ------------------------------------------------------------------
 * Semua angka di aplikasi berasal dari modul ini, yang menghitung
 * ulang dari record `perangkat_daerah` di JSON. Ringkasan dan
 * distribusi bawaan JSON dipakai hanya untuk validasi (runChecks).
 * ------------------------------------------------------------------ */

export const KATEGORI = ['Kecamatan', 'Dinas', 'Badan', 'Lainnya'] as const;
export type Kategori = (typeof KATEGORI)[number];

/**
 * Pemetaan jenis asli dari data ke kategori agregat. Ini sesuai dengan
 * distribusi_jenis di JSON: Lainnya = Inspektorat + Satpol PP + Sekretariat.
 */
const JENIS_KE_KATEGORI: Record<string, Kategori> = {
  Kecamatan: 'Kecamatan',
  Dinas: 'Dinas',
  Badan: 'Badan',
  Inspektorat: 'Lainnya',
  'Satpol PP': 'Lainnya',
  Sekretariat: 'Lainnya',
};

export function toKategori(jenis: string): Kategori {
  return JENIS_KE_KATEGORI[jenis] ?? 'Lainnya';
}

export interface RowView extends PerangkatDaerah {
  kategori: Kategori;
}

export const records: PerangkatDaerah[] = dataset.perangkat_daerah;
export const rows: RowView[] = records.map((r) => ({ ...r, kategori: toKategori(r.jenis) }));
export const TOTAL = records.length;
export const BIDANG_META: BidangMeta[] = dataset.bidang;

/** Persentase dibulatkan satu desimal. */
const pct = (n: number, total: number): number => Math.round((n / total) * 1000) / 10;

/* ---------- Distribusi jenis (kategori agregat) ---------- */

export interface KategoriStat {
  kategori: Kategori;
  frekuensi: number;
  persen: number;
  kumulatif: number;
}

export function distribusiKategori(list: PerangkatDaerah[] = records): KategoriStat[] {
  let kumulatif = 0;
  return KATEGORI.map((k) => {
    const frekuensi = list.filter((r) => toKategori(r.jenis) === k).length;
    kumulatif += frekuensi;
    return { kategori: k, frekuensi, persen: pct(frekuensi, list.length), kumulatif };
  });
}

export const KATEGORI_STATS = distribusiKategori();

export function statKategori(k: Kategori): KategoriStat {
  return KATEGORI_STATS.find((s) => s.kategori === k) as KategoriStat;
}

export const TOP_KATEGORI: KategoriStat = KATEGORI_STATS.reduce((a, b) =>
  b.frekuensi > a.frekuensi ? b : a,
);

export const KECAMATAN_DINAS = (() => {
  const unit = statKategori('Kecamatan').frekuensi + statKategori('Dinas').frekuensi;
  return { unit, persen: pct(unit, TOTAL) };
})();

/* ---------- Rincian kelompok Lainnya ---------- */

export interface RincianLainnya {
  jenis: string;
  jumlah: number;
  anggota: string[];
}

export const RINCIAN_LAINNYA: RincianLainnya[] = (() => {
  const map = new Map<string, string[]>();
  for (const r of records) {
    if (toKategori(r.jenis) !== 'Lainnya') continue;
    map.set(r.jenis, [...(map.get(r.jenis) ?? []), r.nama]);
  }
  return [...map.entries()]
    .map(([jenis, anggota]) => ({ jenis, jumlah: anggota.length, anggota }))
    .sort((a, b) => b.jumlah - a.jumlah || a.jenis.localeCompare('id'));
})();

/* ---------- Analisis bidang (A–F) ---------- */

export interface BidangStat {
  kode: string;
  nama: string;
  deskripsi: string;
  jumlah: number;
  persen: number;
}

export const BIDANG_STATS: BidangStat[] = BIDANG_META.map((b) => {
  const jumlah = records.filter((r) => r.bidang === b.kode).length;
  return { kode: b.kode, nama: b.nama, deskripsi: b.deskripsi, jumlah, persen: pct(jumlah, TOTAL) };
});

/* ---------- Jumlah kata ---------- */

export interface FrekuensiKata {
  jumlah_kata: number;
  frekuensi: number;
}

export function frekuensiKata(list: PerangkatDaerah[] = records): FrekuensiKata[] {
  const m = new Map<number, number>();
  for (const r of list) m.set(r.jumlah_kata, (m.get(r.jumlah_kata) ?? 0) + 1);
  return [...m.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([jumlah_kata, frekuensi]) => ({ jumlah_kata, frekuensi }));
}

export interface StatistikKata {
  n: number;
  rata: number;
  median: number;
  modus: number;
  simpanganBaku: number;
  min: number;
  max: number;
}

export function statistikKata(list: PerangkatDaerah[] = records): StatistikKata {
  const xs = list.map((r) => r.jumlah_kata);
  const n = xs.length;
  const rata = xs.reduce((a, b) => a + b, 0) / n;
  const sorted = [...xs].sort((a, b) => a - b);
  const median = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const freq = frekuensiKata(list);
  const maxF = Math.max(...freq.map((f) => f.frekuensi));
  const modus = Math.min(...freq.filter((f) => f.frekuensi === maxF).map((f) => f.jumlah_kata));
  // Simpangan baku sampel: pembagi n - 1
  const varians = xs.reduce((a, x) => a + (x - rata) ** 2, 0) / (n - 1);
  return {
    n,
    rata,
    median,
    modus,
    simpanganBaku: Math.sqrt(varians),
    min: sorted[0],
    max: sorted[n - 1],
  };
}

export const KATA_FREQ = frekuensiKata();
export const KATA_STATS = statistikKata();

/** Jumlah nama yang berisi 2–5 kata, dan yang berisi 8 kata atau lebih. */
export const KATA_SEBARAN = {
  dua_sampai_lima: records.filter((r) => r.jumlah_kata >= 2 && r.jumlah_kata <= 5).length,
  delapan_ke_atas: records.filter((r) => r.jumlah_kata >= 8).length,
};

/* ---------- Validasi internal: JSON (ringkasan & distribusi) vs hasil hitung ---------- */

export interface Check {
  label: string;
  ok: boolean;
}

const to2 = (x: number) => Number(x.toFixed(2));

export function runChecks(): Check[] {
  const d = dataset;
  const rs = d.ringkasan;
  const checks: Check[] = [];
  const add = (label: string, ok: boolean) => checks.push({ label, ok });

  add('Jumlah record sama dengan total_perangkat_daerah (50)', TOTAL === rs.total_perangkat_daerah);
  add('Nama perangkat daerah unik', new Set(records.map((r) => r.nama)).size === TOTAL);
  add('Nomor urut 1–50 lengkap dan berurutan', records.every((r, i) => r.no === i + 1));
  add(
    'jumlah_kata sama dengan jumlah kata pada nama',
    records.every((r) => r.nama.trim().split(/\s+/).length === r.jumlah_kata),
  );
  add('Jumlah jenis dan bidang sesuai ringkasan', KATEGORI.length === rs.jumlah_jenis && BIDANG_META.length === rs.jumlah_bidang);
  add(
    'Total frekuensi kategori = 50',
    KATEGORI_STATS.reduce((a, b) => a + b.frekuensi, 0) === TOTAL,
  );
  add(
    'Total persentase kategori = 100%',
    Math.round(KATEGORI_STATS.reduce((a, b) => a + b.persen, 0)) === 100,
  );
  add(
    'Frekuensi kumulatif berakhir di 50',
    KATEGORI_STATS[KATEGORI_STATS.length - 1].kumulatif === TOTAL,
  );
  add(
    'Distribusi kategori sama dengan distribusi_jenis di JSON',
    d.distribusi_jenis.every((j) => {
      const s = KATEGORI_STATS.find((k) => k.kategori === j.jenis);
      return !!s && s.frekuensi === j.frekuensi && s.persen === j.persen && s.kumulatif === j.frekuensi_kumulatif;
    }),
  );
  add(
    'Kecamatan + Dinas sama dengan ringkasan (39 unit, 78%)',
    KECAMATAN_DINAS.unit === rs.kecamatan_dan_dinas && KECAMATAN_DINAS.persen === rs.persen_kecamatan_dan_dinas,
  );
  add(
    'Rincian Lainnya sama dengan rincian_lainnya di JSON',
    d.rincian_lainnya.every((j) => RINCIAN_LAINNYA.find((r) => r.jenis === j.jenis)?.jumlah === j.jumlah),
  );
  add(
    'Nama bidang di record konsisten dengan daftar bidang',
    records.every((r) => BIDANG_META.find((b) => b.kode === r.bidang)?.nama === r.bidang_nama),
  );
  add(
    'Jumlah per bidang A–F sama dengan JSON',
    d.bidang.every((b) => {
      const s = BIDANG_STATS.find((x) => x.kode === b.kode);
      return !!s && s.jumlah === b.jumlah && s.persen === b.persen;
    }),
  );
  add(
    'Total bidang A–F = 50',
    BIDANG_STATS.reduce((a, b) => a + b.jumlah, 0) === TOTAL,
  );
  add(
    'Frekuensi jumlah kata sama dengan JSON',
    d.frekuensi_jumlah_kata.length === KATA_FREQ.length &&
      d.frekuensi_jumlah_kata.every((f, i) => f.jumlah_kata === KATA_FREQ[i].jumlah_kata && f.frekuensi === KATA_FREQ[i].frekuensi),
  );
  add(
    'Total frekuensi jumlah kata = 50',
    KATA_FREQ.reduce((a, b) => a + b.frekuensi, 0) === TOTAL,
  );
  add('Rata-rata jumlah kata sama dengan ringkasan', to2(KATA_STATS.rata) === rs.rata_rata_jumlah_kata);
  add('Median jumlah kata sama dengan ringkasan', KATA_STATS.median === rs.median_jumlah_kata);
  add('Modus jumlah kata sama dengan ringkasan', KATA_STATS.modus === rs.modus_jumlah_kata);
  add(
    'Simpangan baku sampel sama dengan ringkasan',
    to2(KATA_STATS.simpanganBaku) === rs.simpangan_baku_sampel_jumlah_kata,
  );
  add(
    'Rentang jumlah kata sama dengan ringkasan',
    KATA_STATS.min === rs.rentang_jumlah_kata[0] && KATA_STATS.max === rs.rentang_jumlah_kata[1],
  );
  return checks;
}

export const CHECKS = runChecks();
