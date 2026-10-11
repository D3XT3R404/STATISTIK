import Section from './Section';
import { BIDANG_META, KECAMATAN_DINAS, TOTAL, statKategori } from '../lib/stats';
import { fmtPersen } from '../lib/format';

export default function KpiSummary() {
  const kec = statKategori('Kecamatan');

  const kpis = [
    {
      value: String(TOTAL),
      label: 'Perangkat daerah terhubung',
      note: 'Tercatat terhubung Jaringan Intra Pemerintah Kota Medan pada 2025.',
    },
    {
      value: fmtPersen(kec.persen),
      label: 'Kecamatan',
      note: `${kec.frekuensi} dari ${TOTAL} unit.`,
    },
    {
      value: String(BIDANG_META.length),
      label: 'Bidang analisis (A–F)',
      note: 'Pengelompokan disusun penulis berdasarkan fungsi, bukan klasifikasi resmi.',
    },
    {
      value: fmtPersen(KECAMATAN_DINAS.persen),
      label: 'Kecamatan + Dinas',
      note: `${KECAMATAN_DINAS.unit} dari ${TOTAL} unit digabung.`,
    },
  ];

  return (
    <Section id="ringkasan" eyebrow="Ringkasan" title="Empat angka utama" lead="Seluruh angka dihitung dari data perangkat daerah di berkas JSON.">
      <div className="kpi-grid">
        {kpis.map((k) => (
          <article key={k.label} className="kpi">
            <p className="kpi__value">{k.value}</p>
            <h3 className="kpi__label">{k.label}</h3>
            <p className="kpi__note">{k.note}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
