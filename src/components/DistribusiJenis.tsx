import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Section from './Section';
import ChartTooltip from './ChartTooltip';
import Komposisi from './Komposisi';
import RincianLainnya from './RincianLainnya';
import { KATEGORI_COLOR } from '../colors';
import { KATEGORI_STATS, TOTAL, statKategori } from '../lib/stats';
import { fmtPersen } from '../lib/format';

export default function DistribusiJenis() {
  const data = KATEGORI_STATS.map((k) => ({
    ...k,
    label: `${k.frekuensi} · ${fmtPersen(k.persen)}`,
    tip: `${k.kategori}: ${k.frekuensi} unit (${fmtPersen(k.persen)})`,
  }));

  const kec = statKategori('Kecamatan');
  const din = statKategori('Dinas');
  const selisih = kec.frekuensi - din.frekuensi;

  const ringkasChart = data.map((d) => `${d.kategori} ${d.frekuensi} unit`).join(', ');

  return (
    <Section
      id="distribusi-jenis"
      eyebrow="Distribusi frekuensi"
      title="Jenis perangkat daerah"
      lead="Empat kategori jenis, dari 50 perangkat daerah. Kategori Lainnya merupakan gabungan Sekretariat, Inspektorat, dan Satpol PP."
    >
      <div className="split split--chart">
        <figure className="chart-box" role="img" aria-label={`Diagram batang frekuensi jenis: ${ringkasChart}.`}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 28, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="kategori" tickLine={false} axisLine={false} tick={{ fill: '#334155', fontSize: 13 }} />
              <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(15,118,110,0.06)' }} />
              <Bar dataKey="frekuensi" radius={[6, 6, 0, 0]}>
                {data.map((d) => (
                  <Cell key={d.kategori} fill={KATEGORI_COLOR[d.kategori]} />
                ))}
                <LabelList dataKey="label" position="top" fill="#1e293b" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <figcaption className="chart-caption">Jumlah unit per jenis, dengan persentase dari {TOTAL} perangkat daerah.</figcaption>
        </figure>

        <div className="callout">
          <p className="callout__title">Temuan utama</p>
          <p>
            Kecamatan ({kec.frekuensi} unit, {fmtPersen(kec.persen)}) menjadi jenis terbanyak, diikuti Dinas ({din.frekuensi} unit,{' '}
            {fmtPersen(din.persen)}). Selisihnya {selisih} unit.
          </p>
        </div>
      </div>

      <h3 className="block-title">Tabel frekuensi</h3>
      <div className="table-wrap">
        <table className="stat-table">
          <caption className="sr-only">Frekuensi, persentase, dan frekuensi kumulatif per jenis perangkat daerah</caption>
          <thead>
            <tr>
              <th scope="col">Kategori</th>
              <th scope="col" className="num">Frekuensi</th>
              <th scope="col" className="num">Persen</th>
              <th scope="col" className="num">Frekuensi kumulatif</th>
            </tr>
          </thead>
          <tbody>
            {KATEGORI_STATS.map((k) => (
              <tr key={k.kategori}>
                <th scope="row">
                  <span className="swatch" style={{ background: KATEGORI_COLOR[k.kategori] }} aria-hidden="true" />
                  {k.kategori}
                </th>
                <td className="num">{k.frekuensi}</td>
                <td className="num">{fmtPersen(k.persen)}</td>
                <td className="num">{k.kumulatif}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td className="num">{TOTAL}</td>
              <td className="num">100%</td>
              <td className="num">–</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Komposisi />
      <RincianLainnya />
    </Section>
  );
}
