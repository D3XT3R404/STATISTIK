import raw from './data-perangkat-daerah-medan-2025.json';

export interface PerangkatDaerah {
  no: number;
  nama: string;
  jenis: string;
  bidang: string;
  jumlah_kata: number;
  bidang_nama: string;
}

export interface BidangMeta {
  kode: string;
  nama: string;
  jumlah: number;
  persen: number;
  deskripsi: string;
}

export interface DistribusiJenisMeta {
  jenis: string;
  frekuensi: number;
  persen: number;
  frekuensi_kumulatif: number;
}

export interface RincianLainnyaMeta {
  jenis: string;
  jumlah: number;
  anggota: string[];
}

export interface FrekuensiKataMeta {
  jumlah_kata: number;
  frekuensi: number;
}

export interface Ringkasan {
  total_perangkat_daerah: number;
  jumlah_jenis: number;
  jumlah_bidang: number;
  kecamatan_dan_dinas: number;
  persen_kecamatan_dan_dinas: number;
  rata_rata_jumlah_kata: number;
  median_jumlah_kata: number;
  modus_jumlah_kata: number;
  simpangan_baku_sampel_jumlah_kata: number;
  rentang_jumlah_kata: [number, number];
}

export interface Metadata {
  judul: string;
  jenis_analisis: string;
  penulis_dalam_ppt: string;
  nim_dalam_ppt: string;
  program_studi: string;
  institusi: string;
  tahun_data: number;
  sumber: string;
  catatan_bidang: string;
}

export interface Dataset {
  metadata: Metadata;
  ringkasan: Ringkasan;
  distribusi_jenis: DistribusiJenisMeta[];
  rincian_lainnya: RincianLainnyaMeta[];
  bidang: BidangMeta[];
  frekuensi_jumlah_kata: FrekuensiKataMeta[];
  perangkat_daerah: PerangkatDaerah[];
}

/** Sumber data utama aplikasi. Semua KPI dan grafik dihitung dari sini. */
export const dataset = raw as Dataset;
