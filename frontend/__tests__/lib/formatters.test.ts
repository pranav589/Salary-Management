import { formatUsd, formatLocalCurrency, formatDate, getCountryName } from '../../src/lib/formatters';

describe('formatters utility library', () => {
  describe('formatUsd', () => {
    it('formats numbers into USD strings', () => {
      expect(formatUsd(123456.78)).toBe('$123,456.78');
      expect(formatUsd(0)).toBe('$0.00');
    });
  });

  describe('formatLocalCurrency', () => {
    it('formats local currencies correctly', () => {
      expect(formatLocalCurrency(2000000, 'INR')).toContain('2,000,000');
      expect(formatLocalCurrency(1000, 'GBP')).toContain('1,000');
    });

    it('falls back gracefully on invalid currency codes', () => {
      // Mock Intl to trigger error or pass invalid currency
      const result = formatLocalCurrency(100, 'INVALID');
      expect(result).toBe('INVALID 100');
    });
  });

  describe('formatDate', () => {
    it('formats ISO dates to human-readable strings', () => {
      expect(formatDate('2024-02-15T00:00:00.000Z')).toBe('Feb 15, 2024');
    });

    it('returns hyphen if date is empty', () => {
      expect(formatDate('')).toBe('-');
    });
  });

  describe('getCountryName', () => {
    it('resolves country codes to full names', () => {
      expect(getCountryName('US')).toBe('United States');
      expect(getCountryName('IN')).toBe('India');
      expect(getCountryName('de')).toBe('Germany');
    });

    it('returns code itself if not mapped', () => {
      expect(getCountryName('FR')).toBe('FR');
    });
  });
});
