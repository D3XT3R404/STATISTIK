import { describe, expect, it } from 'vitest';
import * as S from './stats';

describe('populasi', () => {
  it('berisi 50 perangkat daerah dengan nama unik', () => {
    expect(S.TOTAL).toBe(50);
    expect(new Set(S.records.map((r) => r.nama)).size).toBe(50);
  });
});

describe('distribusi jenis', () => {
  it('sesuai brief: Kecamatan 21/42%, Dinas 18/36%, Badan 7/14%, Lainnya 4/8%', () => {
    expect(S.KATEGORI_STATS.map((k) => [k.kategori, k.frekuensi, k.persen, k.kumulatif])).toEqual([
      ['Kecamatan', 21, 42, 21],
      ['Dinas', 18, 36, 39],
      ['Badan', 7, 14, 46],
      ['Lainnya', 4, 8, 50],
    ]);
  });

  it('Kecamatan + Dinas = 39 unit (78%)', () => {
    expect(S.KECAMATAN_DINAS).toEqual({ unit: 39, persen: 78 });
  });

  it('Lainnya terdiri dari Sekretariat (2), Inspektorat (1), Satpol PP (1)', () => {
    expect(S.RINCIAN_LAINNYA.map((r) => [r.jenis, r.jumlah])).toEqual([
      ['Sekretariat', 2],
      ['Inspektorat', 1],
      ['Satpol PP', 1],
    ]);
  });
});

describe('analisis bidang', () => {
  it('A=4, B=5, C=7, D=6, E=7, F=21', () => {
    expect(S.BIDANG_STATS.map((b) => [b.kode, b.jumlah])).toEqual([
      ['A', 4],
      ['B', 5],
      ['C', 7],
      ['D', 6],
      ['E', 7],
      ['F', 21],
    ]);
  });
});

describe('statistik jumlah kata', () => {
  it('rata-rata 3,96; median 3; modus 3; simpangan baku sampel 2,24; rentang 1–13', () => {
    const k = S.KATA_STATS;
    expect(Number(k.rata.toFixed(2))).toBe(3.96);
    expect(k.median).toBe(3);
    expect(k.modus).toBe(3);
    expect(Number(k.simpanganBaku.toFixed(2))).toBe(2.24);
    expect([k.min, k.max]).toEqual([1, 13]);
  });

  it('distribusi frekuensi sesuai brief dan berjumlah 50', () => {
    expect(S.KATA_FREQ.map((f) => [f.jumlah_kata, f.frekuensi])).toEqual([
      [1, 1],
      [2, 7],
      [3, 23],
      [4, 6],
      [5, 7],
      [8, 3],
      [9, 2],
      [13, 1],
    ]);
    expect(S.KATA_FREQ.reduce((a, b) => a + b.frekuensi, 0)).toBe(50);
  });
});

describe('validasi internal terhadap JSON', () => {
  it('semua pemeriksaan lulus', () => {
    expect(S.CHECKS.filter((c) => !c.ok)).toEqual([]);
  });
});
