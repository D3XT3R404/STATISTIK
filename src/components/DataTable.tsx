import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Download, RotateCcw } from 'lucide-react';
import Section from './Section';
import { BIDANG_META, KATEGORI, TOTAL, rows, records, toKategori, type Kategori, type RowView } from '../lib/stats';
import { KATEGORI_COLOR } from '../colors';
import { toCsv, downloadTextFile } from '../lib/csv';
import { dataset } from '../data/dataset';

type SortKey = 'no' | 'nama' | 'jenis' | 'bidang' | 'jumlah_kata';
type SortDir = 'asc' | 'desc';
type JenisFilter = 'Semua' | Kategori;

const PAGE_SIZES = [10, 25, 50] as const;

function compareRows(a: RowView, b: RowView, key: SortKey): number {
  switch (key) {
    case 'no':
      return a.no - b.no;
    case 'nama':
      return a.nama.localeCompare(b.nama, 'id');
    case 'jenis':
      return KATEGORI.indexOf(a.kategori) - KATEGORI.indexOf(b.kategori) || a.no - b.no;
    case 'bidang':
      return a.bidang.localeCompare(b.bidang) || a.no - b.no;
    case 'jumlah_kata':
      return a.jumlah_kata - b.jumlah_kata || a.no - b.no;
  }
}

const SORT_LABEL: Record<SortKey, string> = {
  no: 'No',
  nama: 'Nama Perangkat Daerah',
  jenis: 'Jenis',
  bidang: 'Bidang',
  jumlah_kata: 'Jumlah Kata',
};

export default function DataTable() {
  const [query, setQuery] = useState('');
  const [jenis, setJenis] = useState<JenisFilter>('Semua');
  const [bidang, setBidang] = useState<string>('Semua');
  const [sortKey, setSortKey] = useState<SortKey>('no');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const dir = sortDir === 'asc' ? 1 : -1;
    return rows
      .filter(
        (r) =>
          (q === '' || r.nama.toLowerCase().includes(q)) &&
          (jenis === 'Semua' || r.kategori === jenis) &&
          (bidang === 'Semua' || r.bidang === bidang),
      )
      .sort((a, b) => dir * compareRows(a, b, sortKey));
  }, [query, jenis, bidang, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const filterAktif = query.trim() !== '' || jenis !== 'Semua' || bidang !== 'Semua';

  function resetFilters() {
    setQuery('');
    setJenis('Semua');
    setBidang('Semua');
    setSortKey('no');
    setSortDir('asc');
    setPage(1);
    setExpanded(null);
  }

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (key !== sortKey) return 'none';
    return sortDir === 'asc' ? 'ascending' : 'descending';
  }

  function sortIcon(k: SortKey) {
    if (k !== sortKey) return <ArrowUpDown size={14} aria-hidden="true" className="sort-icon" />;
    return sortDir === 'asc' ? (
      <ArrowUp size={14} aria-hidden="true" className="sort-icon" />
    ) : (
      <ArrowDown size={14} aria-hidden="true" className="sort-icon" />
    );
  }

  /** Ekspor selalu seluruh 50 data (bukan hasil filter), sesuai brief. */
  function exportCsv() {
    const header = ['no', 'nama', 'jenis', 'bidang', 'bidang_nama', 'jumlah_kata'];
    const body = records.map((r) => [r.no, r.nama, r.jenis, r.bidang, r.bidang_nama, r.jumlah_kata]);
    downloadTextFile('perangkat-daerah-medan-2025.csv', toCsv(header, body));
  }

  const thClass = (k: SortKey) => (k === 'nama' ? 'col-nama' : k === 'jumlah_kata' ? 'num' : undefined);

  const headers: SortKey[] = ['no', 'nama', 'jenis', 'bidang', 'jumlah_kata'];

  return (
    <Section
      id="data-lengkap"
      tone="muted"
      eyebrow="Tabel data"
      title="Seluruh 50 perangkat daerah"
      lead="Cari nama, filter jenis atau bidang, dan urutkan kolom. Klik nama untuk melihat detail. Tombol unduh selalu menghasilkan seluruh 50 data."
    >
      <div className="toolbar">
        <div className="field field--search">
          <label htmlFor="cari-nama">Cari nama perangkat daerah</label>
          <input
            id="cari-nama"
            type="search"
            placeholder="Contoh: Dinas Kesehatan"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label htmlFor="filter-jenis">Jenis</label>
          <select
            id="filter-jenis"
            value={jenis}
            onChange={(e) => {
              setJenis(e.target.value as JenisFilter);
              setPage(1);
            }}
          >
            <option value="Semua">Semua jenis</option>
            {KATEGORI.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-bidang">Bidang</label>
          <select
            id="filter-bidang"
            value={bidang}
            onChange={(e) => {
              setBidang(e.target.value);
              setPage(1);
            }}
          >
            <option value="Semua">Semua bidang</option>
            {BIDANG_META.map((b) => (
              <option key={b.kode} value={b.kode}>
                {b.kode} · {b.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar__actions">
          <button type="button" className="btn btn--ghost btn--small" onClick={resetFilters}>
            <RotateCcw size={16} aria-hidden="true" /> Reset filter
          </button>
          <button type="button" className="btn btn--primary btn--small" onClick={exportCsv}>
            <Download size={16} aria-hidden="true" /> Unduh CSV (semua {TOTAL} data)
          </button>
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        Menampilkan <strong>{filtered.length}</strong> dari {TOTAL} data
        {filterAktif ? ' (filter aktif)' : ''}.
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state" role="status">
          <p>Tidak ada perangkat daerah yang cocok dengan pencarian atau filter.</p>
          <button type="button" className="btn btn--ghost btn--small" onClick={resetFilters}>
            Reset filter
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <caption className="sr-only">Daftar perangkat daerah dengan jenis, bidang, dan jumlah kata</caption>
            <thead>
              <tr>
                {headers.map((k) => (
                  <th key={k} scope="col" className={thClass(k)} aria-sort={ariaSort(k)}>
                    <button type="button" className="sort-btn" onClick={() => toggleSort(k)}>
                      {SORT_LABEL[k]} {sortIcon(k)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => {
                const isOpen = expanded === r.no;
                const meta = dataset.bidang.find((b) => b.kode === r.bidang);
                return (
                  <tr key={r.no}>
                    <td data-label="No" className="num">
                      {r.no}
                    </td>
                    <td data-label="Nama Perangkat Daerah" className="col-nama">
                      <button
                        type="button"
                        className="name-btn"
                        aria-expanded={isOpen}
                        aria-controls={`detail-${r.no}`}
                        onClick={() => setExpanded(isOpen ? null : r.no)}
                      >
                        {r.nama}
                      </button>
                      {isOpen && (
                        <dl id={`detail-${r.no}`} className="row-detail">
                          <div>
                            <dt>Jenis dalam data</dt>
                            <dd>{r.jenis}</dd>
                          </div>
                          <div>
                            <dt>Bidang</dt>
                            <dd>
                              {r.bidang} · {r.bidang_nama}
                            </dd>
                          </div>
                          <div>
                            <dt>Deskripsi bidang (buatan penulis)</dt>
                            <dd>{meta?.deskripsi}</dd>
                          </div>
                          <div>
                            <dt>Jumlah kata</dt>
                            <dd>{r.jumlah_kata}</dd>
                          </div>
                        </dl>
                      )}
                    </td>
                    <td data-label="Jenis">
                      <span className="tag" style={{ ['--tag' as string]: KATEGORI_COLOR[toKategori(r.jenis)] }}>
                        {toKategori(r.jenis)}
                      </span>
                    </td>
                    <td data-label="Bidang">
                      {r.bidang} · {r.bidang_nama}
                    </td>
                    <td data-label="Jumlah Kata" className="num">
                      {r.jumlah_kata}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <nav className="pagination" aria-label="Pagination tabel">
          <div className="field field--inline">
            <label htmlFor="ukuran-halaman">Baris per halaman</label>
            <select
              id="ukuran-halaman"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="pagination__controls">
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setPage(currentPage - 1)} disabled={currentPage <= 1}>
              Sebelumnya
            </button>
            <span aria-live="polite">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setPage(currentPage + 1)} disabled={currentPage >= totalPages}>
              Berikutnya
            </button>
          </div>
        </nav>
      )}
    </Section>
  );
}
