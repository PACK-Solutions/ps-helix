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

## [7.0.2] - 2026-09-17

Patch release. Every component measured at 320 / 768 / 1024 / 1440 — nothing overflows and
nothing is cut. The six truncations found are all a deliberate `text-overflow: ellipsis`, and
`psh-stepper` even stops truncating and wraps below 47.9375em. What the measuring found was
elsewhere.

### Fixed

- **`psh-alert`, `psh-tag`, `psh-table`, `psh-select`** — four controls under the 24×24 floor
  of WCAG 2.2 SC 2.5.8: the alert dismiss at 16×16, the tag close at 20×20, the sort button at
  27×17, and the select's clear button. The alert's shrank further inside a `max-width` query,
  so it was smallest on the screens where it is hit with a thumb. None of them grows: the
  target is carried on a pseudo-element, except the sort button, which becomes its header cell.
  New `--psh-touch-target-compact` (24px) for a control inside a component too compact for 44.
- **`psh-modal`** — reads `PshViewportService.below('md')` instead of comparing `innerWidth`
  to a hardcoded `768` behind its own resize listener. A pixel does not follow browser zoom:
  at 150% the stylesheet switched at an effective 1150px while the number stayed at 768, so
  the modal was in its mobile layout while `isMobileScreen()` still said no.

### Changed

- **`psh-sidebar`** — `breakpoint` now defaults to `'47.9375em'` rather than `'768px'`: the
  `md` step of the library's scale, exclusive like every other max it ships. The input still
  accepts any CSS length, so `'768px'` keeps working.

## [7.0.1] - 2026-09-17

Patch release. Three defects found by walking the 7.0.0 demo in a real browser — the check
jsdom cannot make, and the one the 7.0.0 release notes said was worth doing. None of them was
visible to the 2 420 tests, because each only exists in a rendered page.

### Fixed

- **`PshThemeService`** — `setDarkTheme()` and `toggleTheme()` now persist the choice, and
  `updateTheme()` now writes `data-theme`. The two halves were split across the two methods,
  so a theme toggle built on either one did half the job and the theme reverted on reload.
  Reading the OS preference still does not persist it: nothing stored means the theme keeps
  following the OS.
- **Dark theme, `primary`** — `--psh-text-on-primary` is dark ink. Primary is lightened for
  this theme so it reads against a dark surface, and white text on it measured **3.52:1**,
  under the 4.5:1 floor, on every `psh-button`, `psh-tag`, `psh-badge` and dropdown item.
  Now 5.96:1. `npm run verify:contrast` checks all fourteen semantic fill/ink pairs in CI —
  axe's `color-contrast` rule cannot run under jsdom, so nothing checked the palette before.
- **`psh-select`, `psh-dropdown`, `psh-input`, `psh-collapse`, `psh-menu`** — a component that
  dismisses something on Escape now stops the event there. `psh-modal` and `psh-sidebar`
  listen for Escape on the document, so a select opened inside a modal cost the user the whole
  form: one keypress closed the list *and* the dialog behind it. The rule is narrow — a
  component that did not act lets the event through, so Escape on a closed select still
  reaches the modal.

## [7.0.0] - 2026-09-17

Major release — the 6.2.4 quality audit, delivered in eight lots (PR #19 → #35).

A codemod covers the renames — `node node_modules/ps-helix/scripts/codemod-7.0.0.mjs src`,
see `MIGRATION-7.0.0.md` — which rewrites templates, stylesheets, two-way bindings, projection slots and
option objects, and reports — without touching — the cases it cannot decide.

### Breaking

- **One name per notion.** Six inputs meant "semantic colour" (`variant`, `color`,
  `type`, `colorVariant`, `tagVariant`, `tone`); they are all `color`, typed by a
  single `PshColor` union. `variant` no longer doubles as a surface treatment:
  that is `appearance`, drawn from one lexicon (`solid`, `soft`, `outline`,
  `ghost`, `elevated`, `flat`). `outlined`/`filled`/`text` follow.
- **Outputs**: six conventions became two — `xChange` for two-way state, past
  participle for everything else. Seventeen renames, `navigationError` unified on
  a typed `PshNavigationError` with a `reason` you can branch on, and
  `badge.valueChange` removed (it was never emitted).
- **Class names**: the 365 classes components render are namespaced `psh-`. The
  four card components render with `ViewEncapsulation.None` — which they need, to
  style projected content — so `.card`, `.card-header`, `.card-body` and the rest
  were injected into the consuming document, colliding with Bootstrap's.
- **Custom properties**: the 407 design tokens are namespaced `--psh-*`.
  `styles/compat.css` restores the previous names, opt-in.
- **CSS reset is opt-in**: `styles.css` no longer imports `reset.css` and
  `global.css` — importing a component library used to zero every margin in your
  application and paint a gradient on your `<body>`. `styles-full.css` keeps the
  old behaviour. The `forced-colors` and `prefers-reduced-motion` guards, and the
  modal scroll lock, still ship unconditionally.
- **`cssClass` / `customStyle` removed** from the four card components: they
  existed only because those components rendered an inner wrapper, so the
  consumer's `class` landed on the host one level above. The wrapper is gone and
  `class`/`style` work natively. `modal.styleClass` → `panelClass`, which keeps
  its reason: a modal's panel is rendered outside its host.
- **Projection slots** follow one scheme, `psh-<component>-<zone>`. The prefix is
  not cosmetic — a slot is an attribute selector, so a consumer with their own
  `[card-footer]` directive saw it instantiated on whatever they projected.
- **Default strings are English**, and `PSH_FRENCH_DEFAULTS` restores all 49 in a
  line. They used to be half French and half English, decided component by
  component.
- **`TRANSLATION_PROVIDER`, `NgxTranslateProvider` and `provideTranslation()`
  removed**, along with the `@ngx-translate/core` peer dependency. No component
  ever injected them; the package sat in every consumer's dependency graph for a
  service the library did not use. Translation goes through `provideHelix()` now.
- **`select.searchConfig` removed** — it declared `debounceTime` and `minLength`
  that the component read neither of. The placeholder is `searchPlaceholder`.
- **`psh-menu` no longer claims `role="menubar"`** over `role="menuitem"` links.
  It is a sidebar navigation: Tab reaches each link, as anyone would expect.
- **Modal**: `role="dialog"` moved from the backdrop to the panel, and
  `role="document"` is gone — the pre-ARIA-1.1 pattern the APG advises against.
- **`ToastComponent`**, the pre-7.0.0 alias, is removed.

### Added

- **`provideHelix()`** — one call configures the theme, the customer context and
  every component default, in `makeEnvironmentProviders`. With
  `provideHelixTheme()`, `provideHelixComponentDefaults()` and
  `provideHelixToast()` for one part at a time. The library had 22 injection
  tokens and one `provide*` function, which returned a bare `Provider`.
- **A config token for all 30 components** (14 had none): an application can now
  impose a default on `psh-button`, not only on `psh-tag`. 226 settable defaults,
  documented in the generated `CONFIGURATION.md`.
- **A configured default may be a function**, re-read on each evaluation, so a
  language switcher updates components that are already on screen.
- **`psh-radio-group`** — the component that carries the form contract
  `psh-radio` could not: `ControlValueAccessor` **and** `FormValueControl`,
  single selection, `name`, roving tabindex and arrow navigation.
- **`NG_VALIDATORS` on the six input components**: `required` used to draw an
  asterisk and set `aria-required`, and a form of empty required fields declared
  itself valid.
- **Seven extension points** where there had been one across thirty components:
  `select.optionTemplate`, `table.headerTemplate` / `emptyTemplate` / `rowClass`,
  `menu.itemTemplate`, `tab-bar.itemTemplate`, and an `[psh-alert-actions]` slot.
  Each replaces the *content* of an element, never the element, so roles,
  `aria-sort`, the roving tabindex and the keyboard stay with the component.
- **82 CSS custom properties** published per component, read as `var()` fallbacks
  rather than declared — a declaration on `:host` outranks a plain
  `psh-button { … }` rule from a consumer's stylesheet and quietly wins.
- **`ariaDescribedBy` / `ariaLabelledBy`** on the input components, which
  **merge** with the ids the control already publishes rather than replacing them.
- **`themes/dark-auto.css`** — the dark tokens behind `prefers-color-scheme`, so
  the stylesheet is correct without `ThemeService` and on the SSR first paint.
- **`PshViewportService`** — one media query per breakpoint for the whole
  application, replacing a `ResizeObserver` per card instance.
- **Nine CI guards**: `verify:tokens`, `verify:classes`, `verify:breakpoints`,
  `verify:auto-dark`, `verify:config`, `verify:public-api`, `verify:i18n-preset`,
  `verify:bundle` and the size budget. Every convention this release introduces
  arrives with the script that enforces it.

### Fixed

- **`psh-radio-group` was not in the published package.** It was listed in an
  internal barrel the demo imports and absent from the entry point: 2 299 tests
  passed and no application could have imported it.
- **Tab and panel ids were global** — `tab-0`, `panel-0`, `error-0`. Two steppers
  on a page published the same ids, and `psh-tabs` and `psh-stepper` used the
  *same string* for their panels, so a page holding one of each cross-wired two
  unrelated widgets.
- **A composite widget is one tab stop.** Stepper, state-flow indicator and
  dropdown gave every item `tabindex="0"`, so walking past a six-step stepper
  cost six presses of Tab.
- **The page behind a modal is `inert`.** The focus trap only ever held the
  keyboard; a screen reader's virtual cursor read straight through it.
- **`psh-switch` is announced as a switch**, not as a checkbox.
- **`psh-input` announces its suggestions** — it teleported a `role="listbox"`
  into the body while its `<input>` had no `role`, no `aria-expanded` and no
  `aria-activedescendant`.
- **An AAA contrast target returned 6.98:1.** `ensureContrast` searched in
  floating-point RGB while the value that reaches the stylesheet is a rounded hex.
- **`psh-select` was quadratic**: each option asked for its position in the
  flattened list with a scan *of that list*, and allocated a fresh template
  context every change-detection cycle.
- **`psh-tooltip` announced that it had closed** on construction, having never
  opened — `closed` came from an effect, and an effect runs once on creation.
- **Four defaults that nothing read**: renaming `variant` to `color` and
  `appearance` in this release reached the interfaces and the inputs, and not the
  tokens' default objects.
- **Four strings were unreachable**: the password toggle's label, the textarea's
  character-count suffix, the info-card's "not provided" placeholder, and
  pagination's `Page 2 of 7` — built in French in a component whose every other
  label was an English input.
- **Capture-phase scroll listeners left the zone**: three components register one,
  so every scroll of every ancestor triggered a full change-detection pass.
- **14 dead `CommonModule` imports** and the last three pre-signal APIs
  (`@HostListener`, `@ViewChild`, `standalone: true`).

### Accessibility

- `jest-axe` covers all 31 components, in their default, error, disabled and
  **open** states. Five transverse suites assert what cuts across them: every
  referenced id resolves and no id is rendered twice; one tab stop per composite
  widget; the same combobox contract for select and input; the host is stylable;
  the three form bindings work on every input component.
- Touch targets meet 44 px through `--psh-touch-target-min`, and a
  `forced-colors` guard restores the focus ring that a `box-shadow` cannot draw
  under Windows high contrast.

## [6.2.4] - 2026-09-08

Patch release.

### Fixed

- **`psh-toast`** — removed an import cycle that made the whole library fail to
  load in any environment that evaluates the ESM bundle (Vitest, SSR, a plain
  `import`). The deprecated `ToastComponent` alias lived in a `toast.compat.ts`
  that imported `toast.component.ts`, which re-exported it back; flattening into
  the FESM bundle placed the alias before the class declaration, so importing
  `ps-helix` threw `ReferenceError: Cannot access 'PshToastComponent' before
  initialization`. The alias now sits in `toast.component.ts` next to the class it
  aliases, mirroring `ToastService`. Consumers using Angular's bundler never saw
  this — tree-shaking dropped the unused alias — but consumers running unit tests
  against the library could not load it at all.
  **No API change**: `ToastComponent` is still exported and still deprecated.

### Added

- **build** — `npm run verify:bundle` loads the built FESM bundle and fails on an
  import cycle or any public export resolving to `undefined`, now part of CI.
  Jest resolves each module in isolation and cannot observe this class of defect:
  the full suite stayed green while the published bundle was unloadable.

## [6.2.3] - 2026-07-31

Patch release — the `psh-radio` follow-up left open by 6.2.2.

### Fixed

- **`psh-radio`** — a **projected** label (`<psh-radio>Mon libellé</psh-radio>`) is now
  detected automatically, from the rendered label slot. Two bugs disappear with it:
  - the accessible name was hard-coded to `aria-label="Radio"`, which **overrode the
    visible label** for screen readers (WCAG 2.5.3 "Label in Name") — every radio in
    the demo app was affected;
  - the dev-only accessibility warning fired on this perfectly valid usage.

  `updateProjectedContent()` is no longer needed (nothing ever called it, so the guard
  it fed was inert). It is kept and still works, for backwards compatibility.

### Behaviour change

Confined to a radio with **no** label at all (no `label`, no `ariaLabel`, no projected
content) — a case that now warns in dev:

- `<ng-content>` no longer falls back to the literal text `Radio`, so that placeholder
  is no longer rendered on screen;
- `computedAriaLabel()` returns `undefined` instead of `'Radio'`, so no `aria-label` is
  emitted. Such a radio therefore has no accessible name — which is the actual bug the
  warning asks you to fix, rather than one masked by a meaningless label.

Radios with a `label` input, an `ariaLabel`, or a projected label render exactly as
before.

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
