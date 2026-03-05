import { normalizeSearchString } from './stringNormalize';

describe('normalizeSearchString', () => {
  describe('lowercase', () => {
    it('converts uppercase to lowercase', () => {
      expect(normalizeSearchString('Tiger I')).toBe('tiger i');
      expect(normalizeSearchString('T-34')).toBe('t-34');
      expect(normalizeSearchString('IS-7')).toBe('is-7');
    });
  });

  describe('diacritics', () => {
    it('ö → o', () => {
      expect(normalizeSearchString('Löwe')).toBe('lowe');
    });

    it('ü → u', () => {
      expect(normalizeSearchString('Grüf')).toBe('gruf');
    });

    it('é → e', () => {
      expect(normalizeSearchString('légère')).toBe('legere');
    });

    it('ñ → n', () => {
      expect(normalizeSearchString('Cañón')).toBe('canon');
    });

    it('multiple diacritics in one string', () => {
      expect(normalizeSearchString('Pz.Kpfw. IV Ausf. J')).toBe('pz.kpfw. iv ausf. j');
    });

    it('"Lowe" matches "Löwe"', () => {
      expect(normalizeSearchString('Lowe')).toBe(normalizeSearchString('Löwe'));
    });
  });

  it('returns empty string unchanged', () => {
    expect(normalizeSearchString('')).toBe('');
  });
});
