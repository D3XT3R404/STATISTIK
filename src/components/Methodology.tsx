import Section from './Section';
import { CHECKS, TOTAL } from '../lib/stats';

export default function Methodology() {
  const lulus = CHECKS.filter((c) => c.ok).length;
  const semua = lulus === CHECKS.length;

  return (
    <Section id="metodologi" eyebrow="Metodologi" title="Cara data diolah">
      <div className="split">
        <div className="card">
          <h3>Ruang lingkup dan variabel</h3>
          <ul className="bullets">
            <li>
              Populasi: {TOTAL} perangkat daerah yang tercatat terhubung dengan Jaringan Intra Pemerintah Kota Medan pada 2025, sesuai bahan
              presentasi.
            </li>
            <li>
              Variabel <em>jenis</em> dan <em>bidang</em> berjenis nominal. Variabel turunan <em>jumlah_kata</em> dihitung dari jumlah kata pada
              setiap nama, dipisahkan spasi.
            </li>
            <li>
              Kategori agregat: Kecamatan, Dinas, Badan, dan Lainnya. Lainnya terdiri dari Sekretariat, Inspektorat, dan Satuan Polisi Pamong
              Praja (Satpol PP).
            </li>
          </ul>
        </div>

        <div className="card">
          <h3>Statistik yang dihitung</h3>
          <ul className="bullets">
            <li>Frekuensi, persentase (dibulatkan satu desimal), dan frekuensi kumulatif.</li>
            <li>Rata-rata, median, modus, simpangan baku sampel (pembagi n − 1), dan rentang untuk jumlah kata.</li>
            <li>Setiap KPI dan grafik dihitung ulang dari record perangkat daerah di berkas JSON.</li>
          </ul>
        </div>
      </div>

      <div className="notice notice--strong" role="note">
        <p>
          <strong>Disclaimer klasifikasi bidang.</strong> Enam bidang (A–F) adalah pengelompokan yang disusun penulis berdasarkan fungsi. Ini{' '}
          <strong>bukan klasifikasi resmi</strong> Pemerintah Kota Medan atau instansi mana pun.
        </p>
      </div>

      <div className="card">
        <h3>Penamaan dan koreksi</h3>
        <p>
          Nama dan ejaan perangkat daerah dipertahankan persis seperti pada sumber, termasuk kapitalisasi dan ejaan tertentu. Tidak ada nama yang
          dikoreksi di website ini.
        </p>
      </div>

      <div className="card">
        <h3>Validasi internal</h3>
        <p className="card__hint">
          {lulus} dari {CHECKS.length} pemeriksaan lulus.{' '}
          {semua ? 'Seluruh total, persentase, dan ringkasan di JSON cocok dengan hasil hitung ulang.' : 'Ada pemeriksaan yang gagal, periksa data.'}
        </p>
        <ul className="checks">
          {CHECKS.map((c) => (
            <li key={c.label} className={c.ok ? 'is-ok' : 'is-fail'}>
              <span aria-hidden="true">{c.ok ? '✓' : '✗'}</span>
              <span>
                {c.label}
                <span className="sr-only">{c.ok ? ' (lulus)' : ' (gagal)'}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
