import Section from './Section';
import { dataset } from '../data/dataset';
import { SHOW_AUTHOR_METADATA } from '../config';

export default function Sources() {
  const m = dataset.metadata;
  const dataCsv = `${import.meta.env.BASE_URL}data/data-perangkat-daerah-medan-2025.csv`;

  return (
    <Section id="sumber" tone="muted" eyebrow="Sumber" title="Sumber data dan catatan">
      <div className="card">
        <h3>Sumber data</h3>
        <p className="source-quote">{m.sumber}</p>
        <p>
          Bahan tugas: <em>“Perangkat Daerah Kota Medan Terhubung Jaringan Intra 2025”</em> (PPT). Tahun data {m.tahun_data}.
        </p>
        <p>
          Visualisasi dan perhitungan ulang dibuat dari data yang tercantum pada bahan tugas tersebut. Berkas pendamping yang dipakai:{' '}
          <a href={dataCsv} download>
            unduh data sumber (CSV, 50 baris)
          </a>
          .
        </p>
      </div>

      <div className="card">
        <h3>Catatan penting</h3>
        <ul className="bullets">
          <li>Website ini merupakan visualisasi data akademik. Website ini <strong>bukan situs resmi</strong> Pemerintah Kota Medan.</li>
          <li>Pengelompokan bidang disusun penulis berdasarkan fungsi, bukan klasifikasi resmi.</li>
          <li>Jumlah perangkat yang terhubung tidak menggambarkan kualitas, keamanan, atau kapasitas jaringan.</li>
        </ul>
      </div>

      {SHOW_AUTHOR_METADATA && (
        <div className="card">
          <h3>Penulis</h3>
          <p>
            {m.penulis_dalam_ppt} · NIM {m.nim_dalam_ppt} · {m.program_studi} · {m.institusi}
          </p>
        </div>
      )}
    </Section>
  );
}
