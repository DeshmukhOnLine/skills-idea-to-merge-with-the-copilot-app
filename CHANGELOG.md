# Changelog

Notable changes to Mona's Bookmark Manager App are documented here.

## v1.0.0 — 2026-10-28

### Added

- Save web links with or without an `https://` prefix.
- Generate a short, unique `mona-` slug for every bookmark.
- Keep bookmarks on the current device using browser `localStorage`.
- Display saved bookmarks with links that open in a new tab.
- Copy a bookmark slug to the clipboard with one click.
- Clear all saved bookmarks after a confirmation prompt.
- Show accessible status messages, validation feedback, and an empty state.

### Reliability

- Reject empty, malformed, and non-HTTP(S) URLs.
- Ignore malformed bookmark data recovered from browser storage.
- Preserve the in-page bookmark list and report a warning when browser storage is unavailable.
