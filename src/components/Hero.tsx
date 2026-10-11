import { SITE } from '../config';
import { dataset } from '../data/dataset';
import { KECAMATAN_DINAS, TOP_KATEGORI, TOTAL } from '../lib/stats';
import { fmtPersen } from '../lib/format';

export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-judul">
      <div className="container hero__inner">
        <p className="eyebrow eyebrow--light">Analisis Statistik Deskriptif</p>
        <h1 id="hero-judul">{SITE.title}</h1>
        <p className="hero__lead">Distribusi, komposisi, dan pengelompokan bidang dari {TOTAL} perangkat daerah.</p>

        <div className="hero__cta">
          <a className="btn btn--primary" href="#ringkasan">
            Jelajahi Data
          </a>
          <a className="btn btn--ghost" href="#data-lengkap">
            Lihat Data Lengkap
          </a>
        </div>

        <dl className="hero__facts">
          <div>
            <dt>Total perangkat daerah</dt>
            <dd>{TOTAL} unit</dd>
          </div>
          <div>
            <dt>Jenis terbanyak</dt>
            <dd>
              {TOP_KATEGORI.kategori} ({TOP_KATEGORI.frekuensi} unit)
            </dd>
          </div>
          <div>
            <dt>Kecamatan + Dinas</dt>
            <dd>
              {fmtPersen(KECAMATAN_DINAS.persen)} ({KECAMATAN_DINAS.unit} unit)
            </dd>
          </div>
        </dl>
        <p className="hero__meta">
          Tahun data {dataset.metadata.tahun_data} · Sumber: bahan tugas PPT, diolah ulang
        </p>
      </div>
    </section>
  );
}
