import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Section from './Section';
import ChartTooltip from './ChartTooltip';
import { BIDANG_BASE, BIDANG_HIGHLIGHT } from '../colors';
import { BIDANG_STATS, TOTAL } from '../lib/stats';
import { fmtPersen } from '../lib/format';

export default function BidangAnalysis() {
  const data = BIDANG_STATS.map((b) => ({
    ...b,
    label: `${b.jumlah} · ${fmtPersen(b.persen)}`,
    tip: `${b.kode} · ${b.nama}: ${b.jumlah} unit (${fmtPersen(b.persen)})`,
  }));
  const f = BIDANG_STATS.find((b) => b.kode === 'F');
  const lainnya = BIDANG_STATS.filter((b) => b.kode !== 'F');
  const minLain = Math.min(...lainnya.map((b) => b.jumlah));
  const maxLain = Math.max(...lainnya.map((b) => b.jumlah));

  return (
    <Section
      id="analisis-bidang"
      eyebrow="Analisis per bidang"
      title="Enam bidang berdasarkan fungsi"
      lead="Bidang A–F dikelompokkan berdasarkan fungsi tiap perangkat daerah."
    >
      <div className="notice" role="note">
        <p>
          <strong>Catatan klasifikasi.</strong> Pengelompokan bidang A–F disusun penulis berdasarkan fungsi perangkat daerah.
          Ini <strong>bukan klasifikasi resmi</strong> pemerintah daerah.
        </p>
      </div>

      <div className="split split--chart">
        <figure className="chart-box" role="img" aria-label={`Diagram batang horizontal jumlah per bidang: ${data.map((d) => `${d.kode} ${d.jumlah}`).join(', ')}.`}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 4 }}>
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis type="category" dataKey="kode" width={28} tickLine={false} axisLine={false} tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(15,118,110,0.06)' }} />
              <Bar dataKey="jumlah" radius={[0, 6, 6, 0]}>
                {data.map((d) => (
                  <Cell key={d.kode} fill={d.kode === 'F' ? BIDANG_HIGHLIGHT : BIDANG_BASE} />
                ))}
                <LabelList dataKey="label" position="right" fill="#1e293b" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <figcaption className="chart-caption">Jumlah unit per bidang. Bidang F disorot.</figcaption>
        </figure>

        <div className="callout">
          <p className="callout__title">Temuan utama</p>
          <p>
            Bidang F (Wilayah, Kecamatan) memuat <strong>{f?.jumlah} unit ({fmtPersen(f?.persen ?? 0)})</strong> dari {TOTAL}.
            Lima bidang lainnya masing-masing berada di rentang {minLain}–{maxLain} unit.
          </p>
        </div>
      </div>

      <div className="bidang-grid">
        {data.map((b) => (
          <article key={b.kode} className={`bidang-card${b.kode === 'F' ? ' bidang-card--highlight' : ''}`}>
            <header className="bidang-card__head">
              <span className="bidang-card__code">{b.kode}</span>
              <div>
                <h3>{b.nama}</h3>
                <p className="bidang-card__count">
                  {b.jumlah} unit · {fmtPersen(b.persen)}
                </p>
              </div>
            </header>
            <p className="bidang-card__desc">{b.deskripsi}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
