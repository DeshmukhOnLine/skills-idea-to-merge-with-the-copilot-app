import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  formatBookmark,
  normalizeUrl,
  parseStoredBookmarks,
} from './bookmarkHelpers.ts';

describe('normalizeUrl', () => {
  it('normalizes URLs with and without https:// to the same saved value', () => {
    assert.equal(
      normalizeUrl('www.example.com'),
      normalizeUrl('https://www.example.com'),
    );
  });
});

describe('parseStoredBookmarks', () => {
  const recoveryCases = [
    ['empty', null],
    ['corrupted', '{"url":'],
    ['legacy', JSON.stringify(['https://www.example.com'])],
    ['non-array', JSON.stringify({ url: 'https://www.example.com/' })],
  ] as const;

  for (const [name, storedValue] of recoveryCases) {
    it(`recovers from ${name} storage without throwing`, () => {
      assert.doesNotThrow(() => parseStoredBookmarks(storedValue));
      assert.deepEqual(parseStoredBookmarks(storedValue), []);
    });
  }

  it('keeps valid bookmarks and drops malformed entries', () => {
    const valid = {
      url: 'https://www.example.com/',
      slug: 'mona-7fk2',
    };
    const storedValue = JSON.stringify([
      valid,
      { url: 'not a normalized URL', slug: 'mona-nope' },
      { url: valid.url },
      null,
    ]);

    assert.deepEqual(parseStoredBookmarks(storedValue), [valid]);
  });
});

describe('formatBookmark', () => {
  it('uses the exact visible separator', () => {
    assert.equal(
      formatBookmark({
        url: 'https://www.example.com/',
        slug: 'mona-7fk2',
      }),
      'https://www.example.com/ :: mona-7fk2',
    );
  });
});
