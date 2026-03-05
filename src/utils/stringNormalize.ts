/**
 * Strips diacritics and lowercases a string for case- and diacritic-insensitive comparison.
 *
 * @example
 * normalizeSearchString('Löwe') // → 'lowe'
 */
export function normalizeSearchString(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
