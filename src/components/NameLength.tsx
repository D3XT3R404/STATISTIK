import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Section from './Section';
import ChartTooltip from './ChartTooltip';
import { BIDANG_HIGHLIGHT } from '../colors';
import { KATA_FREQ, KATA_SEBARAN, KATA_STATS, TOTAL } from '../lib/stats';
import { fmtAngka, fmtPersen } from '../lib/format';

export default function NameLength() {
  const data = KATA_FREQ.map((f) => ({
    ...f,
    label: `${f.jumlah_kata} kata`,
    countLabel: String(f.frekuensi),
    tip: `${f.jumlah_kata} kata: ${f.frekuensi} instansi`,
  }));

  const k = KATA_STATS;
  const persenDuaLima = (KATA_SEBARAN.dua_sampai_lima / TOTAL) * 100;
  const panjang = KATA_FREQ.filter((f) => f.jumlah_kata >= 8);
  const kataPanjang = panjang.reduce((a, b) => a + b.frekuensi, 0);
  const daftarPanjang = panjang.map((f) => f.jumlah_kata).join(', ');

  const kpis = [
    { label: 'Rata-rata', value: `${fmtAngka(k.rata, 2)} kata` },
    { label: 'Median', value: `${fmtAngka(k.median, 0)} kata` },
    { label: 'Modus', value: `${fmtAngka(k.modus, 0)} kata` },
    { label: 'Simpangan baku sampel', value: fmtAngka(Number(k.simpanganBaku.toFixed(2)), 2) },
    { label: 'Rentang', value: `${k.min}–${k.max} kata` },
  ];

  return (
    <Section
      id="panjang-nama"
      eyebrow="Statistik jumlah kata"
      title="Panjang nama perangkat daerah"
      lead="Variabel turunan jumlah_kata dihitung dari setiap nama, dengan pemisah spasi. Variabel asli berjenis nominal."
    >
      <div className="kpi-row">
        {kpis.map((item) => (
          <div key={item.label} className="mini-kpi">
            <span className="mini-kpi__label">{item.label}</span>
            <span className="mini-kpi__value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="split split--chart">
        <figure className="chart-box" role="img" aria-label={`Diagram batang distribusi jumlah kata: ${data.map((d) => `${d.jumlah_kata} kata ${d.frekuensi} instansi`).join(', ')}.`}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 24, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} tick={{ fill: '#334155', fontSize: 11 }} />
              <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(15,118,110,0.06)' }} />
              <Bar dataKey="frekuensi" radius={[6, 6, 0, 0]}>
                {data.map((d) => (
                  <Cell key={d.jumlah_kata} fill={BIDANG_HIGHLIGHT} />
                ))}
                <LabelList dataKey="countLabel" position="top" fill="#1e293b" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <figcaption className="chart-caption">Hanya jumlah kata yang muncul di data yang ditampilkan.</figcaption>
        </figure>

        <div className="callout">
          <p className="callout__title">Cara membaca</p>
          <p>
            Rata-rata ({fmtAngka(k.rata, 2)} kata) lebih besar daripada median ({k.median} kata). Sebaran cenderung miring ke kanan karena
            beberapa nama panjang ({daftarPanjang} kata) menarik nilai rata-rata naik.
          </p>
          <p>
            Sebanyak {KATA_SEBARAN.dua_sampai_lima} dari {TOTAL} nama ({fmtPersen(persenDuaLima)}) berisi 2–5 kata. Ada {kataPanjang} nama
            yang berisi 8 kata atau lebih.
          </p>
        </div>
      </div>
    </Section>
  );
}
