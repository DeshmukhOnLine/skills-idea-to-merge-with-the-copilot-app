export interface Bookmark {
  url: string;
  slug: string;
}

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SLUG_LENGTH = 4;
const SLUG_PATTERN = /^mona-[0-9A-Za-z]{4}$/;

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new TypeError('Enter a URL to save.');
  }

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(candidate);

  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
    throw new TypeError('Enter a valid web URL.');
  }

  return candidate;
}

export function generateSlug(randomValue = Math.random()): string {
  const safeRandom = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 1 - Number.EPSILON)
    : 0;
  let value = Math.floor(safeRandom * BASE62.length ** SLUG_LENGTH);
  let slug = '';

  for (let index = 0; index < SLUG_LENGTH; index += 1) {
    slug = BASE62[value % BASE62.length] + slug;
    value = Math.floor(value / BASE62.length);
  }

  return `mona-${slug}`;
}

export function parseStoredBookmarks(storedValue: string | null): Bookmark[] {
  if (!storedValue) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isBookmark).map(({ url, slug }) => ({ url, slug }));
  } catch {
    return [];
  }
}

export function formatBookmark(bookmark: Bookmark): string {
  return `${bookmark.url} :: ${bookmark.slug}`;
}

function isBookmark(value: unknown): value is Bookmark {
  if (!isRecord(value) || typeof value.url !== 'string' || typeof value.slug !== 'string') {
    return false;
  }

  try {
    return normalizeUrl(value.url) === value.url && SLUG_PATTERN.test(value.slug);
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
