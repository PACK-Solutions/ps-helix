# Changelog

All notable changes to **ps-helix** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versioning policy:

- **MAJOR** — breaking changes to the public component API (`input`/`output`/`model`
  signatures, removed components, renamed exports).
- **MINOR** — new components/features and backwards-compatible improvements.
- **PATCH** — backwards-compatible bug fixes.

## [Unreleased]

## [6.0.0] - 2026-07-01

Major release — **breaking change to the global CSS utility classes only**. The
component / service / directive TypeScript API (selectors, `input`/`output`/`model`
signatures, exports) is **unchanged**; no code changes are required, only class
names in consumer templates that use the utility helpers.

### Breaking

- **Utility classes are now namespaced with the `psh-` prefix.** Every global
  helper shipped via `ps-helix/styles.css` was renamed so it can no longer collide
  with a consumer's own classes or another framework (Tailwind, Bootstrap):
  - Spacing / layout / typography / color / animation / focus / responsive:
    `.p-md` → `.psh-p-md`, `.flex` → `.psh-flex`, `.text-center` → `.psh-text-center`,
    `.grid-cols-2` → `.psh-grid-cols-2`, `.animate-spin` → `.psh-animate-spin`,
    `.focus-ring` → `.psh-focus-ring`, `.skip-link` → `.psh-skip-link`, …
  - Responsive variants keep the variant after the prefix:
    `.sm:hidden` → `.psh-sm:hidden`, `.md:grid-cols-2` → `.psh-md:grid-cols-2`,
    `.mobile:flex-col` → `.psh-mobile:flex-col`.
  - The modal scroll-lock body class `body.modal-open` → `body.psh-modal-open`.
- Removed the obsolete `.js-focus-visible` polyfill rule from `focus.utils.css`
  (native `:focus-visible` is now used throughout).

  See **[MIGRATION-6.0.0.md](./MIGRATION-6.0.0.md)** for the full rename map and a
  one-line codemod.

### Changed (CSS quality pass)

- **Reduced motion**: a single global `@media (prefers-reduced-motion: reduce)`
  guard neutralises animations / transitions / smooth-scroll library-wide
  (WCAG 2.3.3 / 2.2.2).
- **Dark mode**: `ThemeService` honours the OS `prefers-color-scheme` when no theme
  has been saved.
- **Focus**: button focus rings (`menu`, `table`, `tabs`) moved from `:focus` to
  `:focus-visible` (no ring on mouse click); form-field focus is unchanged.
- **Tokens**: component box-shadows now reference the `--shadow-*` scale; overlay
  `z-index` literals now use the `--z-index-*` tokens; breakpoints are centralised in
  a new `tokens/breakpoints.tokens.css` as the single source of truth.

## [5.2.0] - 2026-06-30

Minor release — no breaking changes to the public API.

### Added

- Headless a11y/overlay primitives under `ps-helix` (`a11y/`):
  - `PshFocusTrapDirective` — focus trap with initial focus and focus restoration,
    timed via `afterNextRender` (no `setTimeout`).
  - `PshLiveAnnouncerService` — single shared ARIA live region (polite/assertive).
  - `PshOverlayPositionService` — viewport collision detection / flip for popovers.
  - `PshClickOutsideDirective` — emits on clicks outside the host.
- `ModalService.isTopmost()` / `topmostModalId` to support stacked modals.
- jest-axe accessibility tests (foundation) and an anti-overflow test for the dropdown.

### Changed

- **Modal** consumes `PshFocusTrapDirective` (removed hand-rolled focus logic).
- **Tooltip** and **Dropdown** use `PshOverlayPositionService`; the dropdown now
  flips its placement to avoid viewport overflow.
- **Select** and **Dropdown** use `PshClickOutsideDirective` (shared close-on-outside).
- SSR safety: all browser-global access goes through `DOCUMENT` and is guarded by
  `isPlatformBrowser` / `document.defaultView`.
- Public types are now free of `any` (Table, Radio, Translation, Select use
  `unknown`/precise types instead).

### Fixed

- `Escape` (and backdrop click) now dismiss only the **topmost** modal when modals
  are stacked, instead of closing all of them.
- Restored a green unit-test suite on Angular 21 (change-detection shim for
  projected-content/OnPush specs); fixed numerous pre-existing failing/incorrect tests.
- Replaced focus-timing `setTimeout` with `afterNextRender` in the modal.

### Internal

- Added jest coverage thresholds, an ESLint + Prettier setup, a library bundle-size
  budget, and a GitHub Actions CI workflow (lint → test → build).
