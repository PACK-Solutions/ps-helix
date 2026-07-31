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

## [6.2.2] - 2026-07-31

Patch release — finishes the console-noise cleanup started in 6.2.1.

### Fixed

- **`psh-checkbox`** — the accessibility warning no longer fires on a **projected**
  label (`<psh-checkbox>Accept terms</psh-checkbox>`), a documented and fully
  accessible usage that warned on every instance, production included. The check now
  reads the rendered label slot (`label` input *or* projected content) once after the
  first render, and only in dev mode. Its message moved from French to English, in
  line with `psh-radio` and the repo convention.
- **`psh-collapse`** — the two `console.warn` (invalid `variant`, invalid `size`) are
  now guarded by `isDevMode()`, like `psh-pagination` in 6.2.1.
- **`psh-radio`** — the accessibility warning is now dev-only, and the deprecated
  `allowSignalWrites: false` option was removed from its effect: Angular 22 logged
  "The 'allowSignalWrites' flag is deprecated and no longer impacts effect()" for
  every radio instance.

No API change. `psh-input`'s `console.error` on a failing suggestion provider is
intentionally left unguarded — it reports a real runtime failure, not a misuse of the
API. Still open: `psh-radio` does not detect a projected label by itself
(`updateProjectedContent()` must be called), so such a radio still warns in dev and
gets `aria-label="Radio"` over its visible text — fixing that requires a template
change and is tracked separately.

## [6.2.1] - 2026-07-31

Patch release.

### Fixed

- **`psh-pagination`** — `totalPages = 0` is now treated as the legitimate empty
  state it is (an empty list, or a server-side page count not loaded yet) instead
  of an invalid value: no more `[psh-pagination] Invalid totalPages "0", setting to
  1` console warning. Rendering is unchanged (still one page, announced "Page 1 sur
  1"), and genuinely invalid values (negative, non-finite, fractional) are still
  reported.
- **`psh-pagination`** — the `totalPages` clamp no longer writes back into the
  input. It is now derived through a private `effectiveTotalPages` computed, so a
  one-way `[totalPages]` binding can no longer silently desynchronise from the
  parent (internal `1` vs. parent `0`), and a two-way `[(totalPages)]` binding is no
  longer overwritten by the component. `currentPage` keeps its intended write-back
  correction — now clamped on the derived page count.
- **`psh-pagination`** — all six `console.warn` calls (`size`, `variant`,
  `totalPages`, `currentPage` ×2, `maxVisiblePages`) are now guarded by
  `isDevMode()`, so they no longer reach end users' consoles in production builds.

No API change: input/output names, defaults, labels and rendering are identical.
`totalPages` remains a `model()` for `[(totalPages)]` consumers; a future major
could reduce it to a plain `input()` now that the component never writes it.

## [6.2.0] - 2026-07-29

Minor release.

### Added
- **`psh-info-card`** — row-level value formatting via the new optional
  `emphasis` field on `InfoCardData`: `italic`, `bold`, `strikethrough`, and a
  closed, tokenized `tone` palette (`muted`, `primary`, `success`, `warning`,
  `danger`, `info`). Options are independent and combinable, and adapt to both
  light and dark themes. Nullish values are now rendered "muted" automatically
  (italic + secondary color on the `Non renseigné` placeholder); this is
  configurable through the new `InfoCardOptions.mutedEmptyValues` option
  (default `true`), and an explicit `emphasis` always takes precedence. The new
  public types `InfoCardTone` and `InfoCardEmphasis` are exported. Fully
  backwards compatible — rows without `emphasis` render exactly as before, and
  `customClass` remains available as an escape hatch.

## [6.1.0] - 2026-07-20

Minor release.

### Added

- **`psh-card`** — the card header now renders as soon as a header slot is
  projected (`[card-header-icon]`, `[card-header-content]` or
  `[card-header-extra]`), even without `title`/`description`. Consumers can now
  compose a fully custom header (title + status tag + right-aligned value) and
  style it in their own component scope — no `::ng-deep`, no theme override. When
  no slot and no `title`/`description` are provided, the header is not displayed
  (no border, no residual padding), via a `.card-header:not(:has(*))` CSS rule.
  The existing `[title]`/`[description]` path and the default `.card-title` style
  are unchanged. The `hasHeader` computed is kept for backwards compatibility but
  no longer gates the header.

## [6.0.2] - 2026-07-02

Patch release.

### Fixed

- **`psh-dropdown`** and **`psh-input`** (autocomplete suggestions) — like
  `psh-select` in 6.0.1, their popover panels are now rendered in a body-level
  overlay (teleported out of the DOM), so they escape any ancestor `overflow` /
  stacking context (a modal body, a scrollable card, a `transform` container)
  instead of being clipped or hidden behind the modal. Panels are positioned
  `fixed` from the trigger with viewport-collision flip and layer above modals
  via `--z-index-overlay`. Public APIs (inputs/outputs, keyboard, ARIA,
  projected `[dropdown-menu]` content) are unchanged.

### Added

- `PshPortalService.positionByPlacement()` — placement-aware (`<side>-<align>`,
  e.g. `bottom-end`, `top-start`) fixed positioning for teleported panels
  (used by `psh-dropdown`).

## [6.0.1] - 2026-07-02

Patch release.

### Fixed

- **`psh-select`** — the options list is now rendered in a body-level overlay
  (teleported out of the DOM) instead of inline under the trigger. It therefore
  escapes any ancestor `overflow` / stacking context (a modal body, a scrollable
  card, a `transform` container) rather than being clipped or hidden behind the
  modal. The panel is positioned `fixed` from the trigger's viewport rect, keeps
  the existing viewport-collision flip (opens above when there is no room below),
  and layers above modals via the new `--z-index-overlay` token. The public API
  (inputs/outputs, keyboard, ARIA, `[(value)]`) is unchanged.

### Added

- `--z-index-overlay` token (1100) — for body-teleported popovers that must
  layer above modals.
- `PshPortalService` (`a11y/`) — a lightweight, CDK-free "manual portal" that
  teleports a `TemplateRef` into a shared body-level overlay layer. `psh-select`
  consumes it; `psh-dropdown` and the `psh-input` autocomplete can adopt it next.
  (Named `PshPortalService`, distinct from the existing `PshOverlayService`,
  which is the z-index stacking authority.)

## [6.0.0] - 2026-07-01

Major release with two breaking changes: the library now **requires Angular 22**
(and TypeScript 6), and it **namespaces the global CSS utility classes** with the
`psh-` prefix. The component / service / directive **public API is otherwise
unchanged** (selectors, `input`/`output`/`model` signatures, exports).

### Breaking

- **Requires Angular 22.** `peerDependencies` are now `@angular/* ^22.0.0`; the
  package is built with Angular 22.0.4 and TypeScript 6.0. Consumers must upgrade
  their app (`ng update @angular/core@22 @angular/cli@22`, Node ≥ 22.22.3).
  - Internal: the `pagination` (`itemsPerPage`) and `tabs` (`activeIndex`)
    two-way bindings moved from `model()` to `input()` + `linkedSignal` + their
    explicit `…Change` output (fixing a latent double-emit). `[(itemsPerPage)]`
    and `[(activeIndex)]` continue to work unchanged.
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
