import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartTooltip from './ChartTooltip';
import { KATEGORI_COLOR } from '../colors';
import { KATEGORI_STATS, KECAMATAN_DINAS, TOTAL } from '../lib/stats';
import { fmtPersen } from '../lib/format';

export default function Komposisi() {
  const data = KATEGORI_STATS.map((k) => ({
    ...k,
    tip: `${k.kategori}: ${k.frekuensi} unit (${fmtPersen(k.persen)})`,
  }));

  const totalPersen = KATEGORI_STATS.reduce((a, b) => a + b.persen, 0);

  return (
    <div className="block">
      <h3 className="block-title">Komposisi</h3>
      <div className="split split--donut">
        <figure className="chart-box chart-box--donut" role="img" aria-label={`Diagram lingkaran komposisi: ${data.map((d) => `${d.kategori} ${d.frekuensi} unit`).join(', ')}.`}>
          <div className="donut">
            <ResponsiveContainer width="100%" height={260} minWidth={0}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="frekuensi"
                  nameKey="kategori"
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={104}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((d) => (
                    <Cell key={d.kategori} fill={KATEGORI_COLOR[d.kategori]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut__center" aria-hidden="true">
              <strong>{TOTAL}</strong>
              <span>unit</span>
            </div>
          </div>
        </figure>

        <div>
          <ul className="legend">
            {KATEGORI_STATS.map((k) => (
              <li key={k.kategori}>
                <span className="swatch" style={{ background: KATEGORI_COLOR[k.kategori] }} aria-hidden="true" />
                <span className="legend__name">{k.kategori}</span>
                <span className="legend__value">
                  {k.frekuensi} unit · {fmtPersen(k.persen)}
                </span>
              </li>
            ))}
            <li className="legend__total">
              <span className="legend__name">Total</span>
              <span className="legend__value">
                {TOTAL} unit · {fmtPersen(totalPersen)}
              </span>
            </li>
          </ul>
          <div className="callout">
            <p>
              Kecamatan + Dinas berjumlah <strong>{KECAMATAN_DINAS.unit} unit</strong> atau{' '}
              <strong>{fmtPersen(KECAMATAN_DINAS.persen)}</strong> dari seluruh perangkat daerah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
