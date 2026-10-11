import { SITE } from '../config';
import { dataset } from '../data/dataset';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__brand">{SITE.brand}</p>
          <p className="footer__note">
            Visualisasi dan perhitungan ulang dari data tahun {dataset.metadata.tahun_data}. Bukan situs resmi Pemerintah Kota Medan.
          </p>
        </div>
        <a className="footer__top" href="#top">
          Kembali ke atas ↑
        </a>
      </div>
    </footer>
  );
}
