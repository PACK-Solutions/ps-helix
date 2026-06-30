# Accessibility Statement — ps-helix

ps-helix is built to help product teams ship accessible interfaces. We target
**WCAG 2.1 level AA** for the components shipped in this library.

This statement describes what the library provides, how it is tested, and the
known limitations we are still working on. Per-component keyboard maps and ARIA
attribute tables live next to each component (e.g. `components/select/SELECT.md`,
`components/modal/MODAL.md`, `components/menu/MENU.md`).

## What the library provides

### Colour & contrast
- The theming engine derives colour variants in **OKLCH** and enforces a
  **WCAG contrast guardrail** (AA by default, AAA opt-in) against the active
  theme background. Brand colours that are not accessible as UI colours are
  adjusted automatically; the original value is preserved in
  `--customer-*-color-source` for purely decorative use.

### Keyboard support
All interactive components are operable from the keyboard. Highlights:
- **Select / listbox-combobox** — Arrow keys, Home/End, type-ahead, Enter/Space,
  Escape, Tab; `aria-activedescendant`, `aria-multiselectable`.
- **Menu** — Arrow keys, Home/End, Enter/Space, submenu open/close, disabled-skip.
- **Modal** — focus trap, initial focus, focus restoration, Escape (topmost only),
  Tab / Shift+Tab cycling.
- **Tabs**, **Dropdown**, **Stepper**, **Pagination**, **Checkbox/Radio/Switch** —
  documented per-component keyboard maps.

### ARIA & semantics
- Components expose the relevant roles and ARIA state (`role="dialog"`,
  `aria-modal`, `role="combobox"/"listbox"/"option"`, `aria-expanded`,
  `aria-selected`, `aria-sort`, `aria-invalid`, `aria-describedby`, …).
- Error/success messages are associated to their controls via `aria-describedby`.

### Shared a11y primitives
Reusable, headless primitives back the components and are available to consumers:
- `PshFocusTrapDirective` — focus trap with focus restoration (deterministic
  timing via `afterNextRender`).
- `PshLiveAnnouncerService` — a single shared `aria-live` region (polite/assertive).
- `PshOverlayPositionService` — viewport collision detection / flip for popovers
  (prevents dropdown/tooltip overflow).
- `PshClickOutsideDirective` — dismiss-on-outside-click.

### SSR
The library renders under server-side rendering: all browser-global access is
routed through `DOCUMENT` and guarded by `isPlatformBrowser` / `document.defaultView`.

## How accessibility is tested
- **Automated:** `jest-axe` asserts zero axe-core violations on components in their
  default and key states (error, disabled). Keyboard interaction is covered by
  unit tests for the main interactive components.
- **Linting:** `angular-eslint` template accessibility rules run in CI.
- **Manual:** keyboard-only and screen-reader spot checks during development.

> Note: colour-contrast cannot be computed without layout, so the axe
> colour-contrast rule is disabled in the (jsdom) unit tests; contrast is instead
> guaranteed at the design-token level by the theming engine.

## Known limitations (backlog)
We track these openly; they are reported as warnings by `npm run lint`:
- A small number of **clickable elements still need explicit keyboard handlers /
  focus support** (`click-events-have-key-events`, `interactive-supports-focus`).
  Affected today: parts of `card`, `info-card`, `table`, `tabs`, `textarea`,
  `stat-card` demos/components.
- `jest-axe` coverage is being extended incrementally to every component (it
  currently covers the form controls and badge).
- Per-popover flip-on-open is implemented for tooltip and dropdown; select/menu
  panel flipping is planned.

## Feedback
If you find an accessibility barrier, please open an issue on the
[ps-helix repository](https://github.com/PACK-Solutions/ps-helix) describing the
component, the assistive technology used, and the expected behaviour.
