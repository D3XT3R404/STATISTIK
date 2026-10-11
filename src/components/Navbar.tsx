import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SECTIONS } from '../sections';
import { SITE } from '../config';
import { useActiveSection } from '../hooks/useActiveSection';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          {SITE.brand}
        </a>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="navigasi-utama"
          aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>

        <nav id="navigasi-utama" className={`navbar__nav${open ? ' is-open' : ''}`} aria-label="Navigasi utama">
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
