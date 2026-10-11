# Statistika Medan 2025

Website statistik deskriptif untuk **“Perangkat Daerah Kota Medan Terhubung Jaringan Intra 2025”**.
Dibangun dengan React, Vite, TypeScript, dan Recharts. Data bersumber dari berkas JSON, dengan CSV pendamping sebagai pembanding.

Website ini bukan situs resmi Pemerintah Kota Medan.

## Fitur

- **Hero** dengan judul, subjudul, dan dua CTA yang menggulir ke bagian terkait.
- **Ringkasan**: empat KPI (50 total; 42% Kecamatan; 6 bidang; 78% Kecamatan + Dinas).
- **Distribusi jenis**: bar chart, tabel frekuensi, frekuensi kumulatif, dan temuan utama.
- **Komposisi**: donut chart dengan legenda bernilai, total 100%.
- **Rincian Lainnya**: Sekretariat, Inspektorat, dan Satuan Polisi Pamong Praja.
- **Analisis bidang A–F**: bar chart horizontal, kartu bidang, dan disclaimer klasifikasi.
- **Panjang nama**: rata-rata, median, modus, simpangan baku sampel, rentang, dan distribusi jumlah kata.
- **Tabel 50 data**: pencarian nama, filter jenis dan bidang, sort semua kolom, pagination, reset filter, detail baris, dan unduh CSV seluruh 50 data.
- **Kesimpulan**, **metodologi** (dengan validasi internal), dan **sumber**.
- Navbar sticky dengan status aktif. Di layar kecil menjadi menu ringkas.
- Tabel berubah menjadi kartu di ponsel. Layout teruji untuk lebar mulai 360 px.

## Struktur folder

```
statistika-medan-2025/
├── .github/workflows/deploy.yml   # Build & deploy ke GitHub Pages
├── public/
│   ├── .nojekyll                  # Mencegah pemrosesan Jekyll di GitHub Pages
│   ├── favicon.svg
│   └── data/data-perangkat-daerah-medan-2025.csv   # CSV pendamping (diunduh dari halaman Sumber)
├── scripts/
│   └── validate-data.mjs          # Validasi JSON vs CSV (tanpa dependensi)
├── src/
│   ├── components/                # Bagian-bagian halaman (Hero, KPI, grafik, tabel, dst.)
│   ├── data/
│   │   ├── data-perangkat-daerah-medan-2025.json   # SUMBER DATA UTAMA
│   │   └── dataset.ts             # Tipe TypeScript untuk JSON
│   ├── hooks/useActiveSection.ts  # Status aktif navbar
│   ├── lib/
│   │   ├── stats.ts               # Semua perhitungan + validasi internal
│   │   ├── stats.test.ts          # Uji unit (Vitest)
│   │   ├── format.ts              # Format angka Indonesia (koma desimal)
│   │   └── csv.ts                 # Pembuat CSV dan unduhan file
│   ├── App.tsx · main.tsx · styles.css
│   ├── config.ts                  # Konfigurasi teks dan flag metadata penulis
│   ├── colors.ts                  # Warna kategori (konsisten di semua grafik)
│   └── sections.ts                # Daftar navigasi
├── index.html
├── package.json · tsconfig.json · vite.config.ts
└── README.md
```

## Sumber data dan cara kerja

1. `src/data/data-perangkat-daerah-medan-2025.json` adalah sumber utama. Setiap KPI dan grafik dihitung ulang dari array `perangkat_daerah` di file ini (lihat `src/lib/stats.ts`).
2. `ringkasan`, `distribusi_jenis`, `bidang`, dan `frekuensi_jumlah_kata` di JSON tidak dipakai untuk menggambar grafik. Nilainya dipakai untuk **validasi silang**: `runChecks()` di `stats.ts` memastikan hasil hitung ulang sama dengan nilai JSON. Hasilnya tampil di bagian Metodologi.
3. CSV pendamping sama isinya dengan JSON. `npm run validate:data` memeriksa kesamaan keduanya baris demi baris.
4. Kategori agregat **Lainnya** = Sekretariat (2) + Inspektorat (1) + Satpol PP (1), sesuai `distribusi_jenis` di JSON. Pemetaan ada di `JENIS_KE_KATEGORI` (`stats.ts`).
5. Nama dan ejaan instansi tidak dikoreksi. Ekspor CSV memakai kolom yang sama dengan CSV pendamping.

## Menjalankan secara lokal

Prasyarat: **Node.js 20 atau lebih baru** dan npm.

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev
#    buka http://localhost:5173

# 3. (Opsional) Validasi data, uji unit, dan typecheck
npm run validate:data
npm test
npm run typecheck

# 4. Build produksi (hasil di folder dist/)
npm run build

# 5. Pratinjau hasil build
npm run preview
```

## Deploy ke GitHub Pages

Workflow `.github/workflows/deploy.yml` membangun dan mendeploy otomatis setiap push ke branch `main`. Base path diisi dari nama repository, jadi tidak perlu mengubah kode.

**Langkah sekali:**

1. Buat repository baru di GitHub (misalnya `statistika-medan-2025`) dan unggah seluruh isi folder ini.
2. Buka **Settings → Pages**. Pada bagian **Build and deployment → Source**, pilih **GitHub Actions**.
3. Pastikan branch utama bernama `main`. Jika berbeda, ubah bagian `branches` di `deploy.yml`.
4. Push ke `main` atau jalankan workflow secara manual dari tab **Actions** (`workflow_dispatch`).
5. Setelah selesai, website tersedia di `https://<username>.github.io/<nama-repository>/`.

Jika repository dinamai sebagai user site (`<username>.github.io`), ubah base path dengan menjalankan build tanpa `VITE_BASE_PATH`, atau ubah baris `VITE_BASE_PATH` di `deploy.yml` menjadi `/`.

Catatan: file `package-lock.json` disertakan agar `npm ci` di CI menghasilkan dependensi yang sama dengan lokal.

## Mengubah metadata penulis

Metadata penulis dari bahan PPT disembunyikan secara default, karena brief meminta konfirmasi sebelum publikasi. Setelah dikonfirmasi, ubah di `src/config.ts`:

```ts
export const SHOW_AUTHOR_METADATA = true;
```

## Perbarui data tahun berikutnya

1. Ganti `src/data/data-perangkat-daerah-medan-2025.json` dan `public/data/...csv` dengan data baru yang formatnya sama.
2. Jika jumlah kategori atau bidang berubah, sesuaikan `JENIS_KE_KATEGORI` di `src/lib/stats.ts`, `BIDANG_META` (dari JSON), dan `src/colors.ts`.
3. Jalankan `npm run validate:data` dan `npm test`. Keduanya harus lulus sebelum deploy.

## Catatan akurasi dan batasan

- Website ini menghitung **jumlah unit** yang tercatat terhubung. Angka tersebut tidak membuktikan kualitas, keamanan, penggunaan, atau kapasitas jaringan.
- Enam bidang A–F adalah **pengelompokan penulis berdasarkan fungsi**, bukan klasifikasi resmi. Disclaimer ini tampil di bagian Analisis Bidang dan Metodologi.
- Jika JavaScript tidak aktif, halaman hanya menampilkan ringkasan singkat dan sumber (lihat `<noscript>` di `index.html`). Grafik dan tabel memerlukan JavaScript.
- Referensi struktur halaman hanya dipakai sebagai inspirasi pola naratif (hero, angka utama, grafik, analisis, tabel, kesimpulan, sumber). Desain, teks, dan visual tidak disalin.

## Lisensi

Bebas dipakai untuk keperluan akademik. Sesuaikan dengan kebijakan kampus dan ketentuan sumber data.
