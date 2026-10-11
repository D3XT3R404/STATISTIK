// Validasi independen: membandingkan JSON sumber dengan CSV pendamping
// dan dengan ringkasan di JSON. Tanpa dependensi eksternal.
// Jalankan: npm run validate:data
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = JSON.parse(readFileSync(join(root, 'src/data/data-perangkat-daerah-medan-2025.json'), 'utf8'));
const csvText = readFileSync(join(root, 'public/data/data-perangkat-daerah-medan-2025.csv'), 'utf8').replace(/^\uFEFF/, '');

/** Parser CSV sederhana yang mendukung tanda kutip, "" di dalam kutip, dan CRLF. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\r') { /* abaikan, lanjut ke \n */ }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const [header, ...body] = parseCsv(csvText);
const csv = body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
const records = json.perangkat_daerah;

const results = [];
const check = (label, ok, detail = '') => results.push({ label, ok, detail });

check('Jumlah baris CSV = jumlah record JSON (50)', csv.length === records.length && records.length === 50, `CSV ${csv.length}, JSON ${records.length}`);

const mismatch = [];
records.forEach((r, i) => {
  const c = csv[i];
  if (!c) return mismatch.push(`baris ${i + 1} tidak ada di CSV`);
  if (Number(c.no) !== r.no || c.nama !== r.nama || c.jenis !== r.jenis || c.bidang !== r.bidang || c.bidang_nama !== r.bidang_nama || Number(c.jumlah_kata) !== r.jumlah_kata)
    mismatch.push(`no ${r.no}`);
});
check('Setiap baris JSON identik dengan CSV', mismatch.length === 0, mismatch.slice(0, 5).join('; '));

check('Nama unik', new Set(records.map((r) => r.nama)).size === records.length);
check('jumlah_kata = jumlah kata pada nama', records.every((r) => r.nama.trim().split(/\s+/).length === r.jumlah_kata));

const KAT = { Kecamatan: 'Kecamatan', Dinas: 'Dinas', Badan: 'Badan', Inspektorat: 'Lainnya', 'Satpol PP': 'Lainnya', Sekretariat: 'Lainnya' };
const countKat = (k) => records.filter((r) => (KAT[r.jenis] ?? 'Lainnya') === k).length;
const N = records.length;
for (const j of json.distribusi_jenis) {
  const f = countKat(j.jenis);
  check(`Frekuensi ${j.jenis} = ${j.frekuensi}`, f === j.frekuensi, `hitung ${f}`);
  check(`Persen ${j.jenis} = ${j.persen}%`, Math.round((f / N) * 100) === j.persen, `hitung ${((f / N) * 100).toFixed(1)}%`);
}
check('Total distribusi_jenis = 50', json.distribusi_jenis.reduce((a, b) => a + b.frekuensi, 0) === N);

for (const b of json.bidang) {
  const f = records.filter((r) => r.bidang === b.kode).length;
  check(`Bidang ${b.kode} = ${b.jumlah}`, f === b.jumlah, `hitung ${f}`);
}
check('Total bidang A–F = 50', json.bidang.reduce((a, b) => a + b.jumlah, 0) === N);

const freq = new Map();
records.forEach((r) => freq.set(r.jumlah_kata, (freq.get(r.jumlah_kata) ?? 0) + 1));
const freqOk = json.frekuensi_jumlah_kata.every((f) => freq.get(f.jumlah_kata) === f.frekuensi) && json.frekuensi_jumlah_kata.length === freq.size;
check('Frekuensi jumlah kata sesuai JSON', freqOk);
check('Total frekuensi jumlah kata = 50', json.frekuensi_jumlah_kata.reduce((a, b) => a + b.frekuensi, 0) === N);

const xs = records.map((r) => r.jumlah_kata);
const mean = xs.reduce((a, b) => a + b, 0) / N;
const sorted = [...xs].sort((a, b) => a - b);
const median = N % 2 ? sorted[(N - 1) / 2] : (sorted[N / 2 - 1] + sorted[N / 2]) / 2;
const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / (N - 1));
const rs = json.ringkasan;
check('Rata-rata jumlah kata = ringkasan', Number(mean.toFixed(2)) === rs.rata_rata_jumlah_kata, `hitung ${mean.toFixed(2)}`);
check('Median jumlah kata = ringkasan', median === rs.median_jumlah_kata, `hitung ${median}`);
check('Simpangan baku sampel = ringkasan', Number(sd.toFixed(2)) === rs.simpangan_baku_sampel_jumlah_kata, `hitung ${sd.toFixed(4)}`);
check('Kecamatan + Dinas = ringkasan (39, 78%)', countKat('Kecamatan') + countKat('Dinas') === rs.kecamatan_dan_dinas && rs.persen_kecamatan_dan_dinas === 78);

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? '✓' : '✗'} ${r.label}${!r.ok && r.detail ? `  [${r.detail}]` : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} pemeriksaan lulus.`);
process.exit(failed ? 1 : 0);
