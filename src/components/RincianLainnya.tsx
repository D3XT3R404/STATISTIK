import { RINCIAN_LAINNYA, KATEGORI_STATS } from '../lib/stats';
import { fmtPersen } from '../lib/format';

export default function RincianLainnya() {
  const lainnya = KATEGORI_STATS.find((k) => k.kategori === 'Lainnya');
  const totalLainnya = RINCIAN_LAINNYA.reduce((a, b) => a + b.jumlah, 0);

  return (
    <div className="block">
      <h3 className="block-title">Rincian kelompok Lainnya</h3>
      <p className="block-note">
        Kelompok Lainnya berisi {totalLainnya} unit ({fmtPersen(lainnya?.persen ?? 0)}). Rincian di bawah hanya menguraikan kategori ini dan tidak membentuk kategori baru.
      </p>
      <ul className="breakdown">
        {RINCIAN_LAINNYA.map((r) => {
          const share = (r.jumlah / totalLainnya) * 100;
          return (
            <li key={r.jenis} className="breakdown__item">
              <div className="breakdown__head">
                <span className="breakdown__label">{r.jenis}</span>
                <span className="breakdown__value">
                  {r.jumlah} unit · {fmtPersen(share)} dari Lainnya
                </span>
              </div>
              <div className="bar" role="presentation">
                <span style={{ width: `${share}%` }} />
              </div>
              <ul className="breakdown__members">
                {r.anggota.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
