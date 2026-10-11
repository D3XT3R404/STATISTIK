import Section from './Section';
import { KECAMATAN_DINAS, BIDANG_STATS, TOTAL, statKategori } from '../lib/stats';
import { fmtPersen } from '../lib/format';

export default function Conclusions() {
  const kec = statKategori('Kecamatan');
  const din = statKategori('Dinas');
  const f = BIDANG_STATS.find((b) => b.kode === 'F');
  const lain = BIDANG_STATS.filter((b) => b.kode !== 'F');
  const minLain = Math.min(...lain.map((b) => b.jumlah));
  const maxLain = Math.max(...lain.map((b) => b.jumlah));

  return (
    <Section id="kesimpulan" eyebrow="Kesimpulan" title="Yang bisa disimpulkan dari data ini">
      <div className="findings">
        <article className="finding">
          <span className="finding__num">a</span>
          <p>
            Kecamatan menjadi jenis terbanyak dengan {kec.frekuensi} unit ({fmtPersen(kec.persen)}), diikuti Dinas dengan {din.frekuensi} unit (
            {fmtPersen(din.persen)}).
          </p>
        </article>
        <article className="finding">
          <span className="finding__num">b</span>
          <p>
            Gabungan Kecamatan dan Dinas berjumlah {KECAMATAN_DINAS.unit} unit atau {fmtPersen(KECAMATAN_DINAS.persen)} dari {TOTAL} perangkat daerah.
          </p>
        </article>
        <article className="finding">
          <span className="finding__num">c</span>
          <p>
            Menurut pengelompokan fungsi penulis, Bidang F (Wilayah) memuat {f?.jumlah} unit ({fmtPersen(f?.persen ?? 0)}). Lima bidang lainnya
            masing-masing berada di rentang {minLain}–{maxLain} unit.
          </p>
        </article>
      </div>

      <div className="split">
        <div className="card">
          <h3>Rekomendasi awal</h3>
          <p className="card__hint">Berbasis jumlah unit, sesuai bahan presentasi.</p>
          <ol className="steps">
            <li>Prioritaskan perhatian pemeliharaan dan pengamanan jaringan pada kecamatan dan dinas karena jumlahnya paling besar.</li>
            <li>Lengkapi data dengan jumlah pengguna, kapasitas bandwidth, dan tahun terhubung agar analisis bisa lebih dalam.</li>
            <li>Perbarui data setiap tahun agar perbandingan antarperiode dapat dilakukan.</li>
          </ol>
        </div>

        <div className="card card--caution">
          <h3>Batas interpretasi</h3>
          <p>
            Angka ini hanya menghitung jumlah unit yang tercatat terhubung. Angka tersebut <strong>tidak membuktikan</strong> kualitas jaringan,
            tingkat penggunaan, keamanan, kapasitas bandwidth, atau kebutuhan anggaran. Kesimpulan tentang hal-hal itu memerlukan data tambahan.
          </p>
        </div>
      </div>
    </Section>
  );
}
