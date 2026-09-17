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
- **A composite widget is one tab stop.** Tabs, tab bar, stepper, state-flow
  indicator and dropdown carry a roving `tabindex`: Tab reaches the widget and then
  leaves it, and the arrows move within. Walking past a six-step stepper costs one
  press of Tab, not six.

### ARIA & semantics
- Components expose the relevant roles and ARIA state (`role="dialog"`,
  `aria-modal`, `role="combobox"/"listbox"/"option"`, `role="switch"`,
  `aria-expanded`, `aria-selected`, `aria-sort`, `aria-invalid`,
  `aria-describedby`, …).
- Error/success messages are associated to their controls via `aria-describedby`.
- **Every generated id is unique per component instance.** Tab/panel links, and the
  link from a field to its message, are asserted in CI against a page holding two of
  each component — including the case of a `psh-tabs` beside a `psh-stepper`.
- **Modal** puts `role="dialog"` on the panel, not on the backdrop, and marks the
  rest of the page `inert` while open. The focus trap holds the keyboard; `inert` is
  what stops a screen reader's virtual cursor reading the page behind the dialog.
- **Input** announces its autocomplete suggestions as a combobox
  (`aria-expanded`, `aria-controls`, `aria-activedescendant`) — and only when the
  field actually has suggestions to offer.

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
- **Automated:** `jest-axe` asserts zero axe-core violations on **all 31 components**,
  in their default and key states (error, disabled, and open for the components that
  open). Keyboard interaction is covered by unit tests for the main interactive
  components, and four transverse suites assert the rules that cut across them:
  `described-by` (every referenced id resolves, and no id is rendered twice),
  `roving-tabindex` (one tab stop per composite widget), `combobox` (the same
  contract for select and input) and `forms-contract`.
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
- `psh-menu` declares `role="menubar"` over `role="menuitem"` links while being a
  sidebar navigation. By the letter of the role its links should not be individually
  reachable with Tab; in practice taking Tab away from a sidebar would be a
  regression. **The roles are what needs settling**, and that is an open decision
  rather than a bug.
- `aria-required-children` does not fire when a required child sits below an
  intermediate generic element, so axe is silent on a `tablist` whose tabs are
  grandchildren. It does fire when no tab is present at all. Worth knowing before
  relying on it.
- Per-popover flip-on-open is implemented for tooltip and dropdown; select/menu
  panel flipping is planned.

## Feedback
If you find an accessibility barrier, please open an issue on the
[ps-helix repository](https://github.com/PACK-Solutions/ps-helix) describing the
component, the assistive technology used, and the expected behaviour.
