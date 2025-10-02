/**
 * Normalizes text for search comparison by:
 * - Converting to lowercase
 * - Removing diacritics (accents)
 * - Useful for international text search
 */
export const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
