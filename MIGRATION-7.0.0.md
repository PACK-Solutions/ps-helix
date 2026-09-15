# Migrating to ps-helix 7.0.0

7.0.0 is a breaking release. It renames the CSS custom properties, changes how components
are styled from outside, and unifies the component API vocabulary.

Most of it is automated. Run the two codemods, then read the short list of things a script
cannot decide for you.

```bash
# 1. Component inputs in templates and TypeScript, and CSS classes inside ::ng-deep
node node_modules/ps-helix/scripts/codemod-7.0.0.mjs src

# 2. CSS custom properties — or skip it and import the compatibility layer instead
@import 'ps-helix/src/lib/styles/compat.css';
```

The codemod prints a `!` line for everything it deliberately left alone. Read those before
anything else: they are the cases where only you know the answer.

---

## 1. Stylesheet entry point

`styles.css` no longer ships a CSS reset or page-level styling. Importing a component
library used to zero every margin and padding in your application, strip your list markers
and paint a gradient on your `<body>`.

| You had | Now |
|---|---|
| `@import 'ps-helix/styles.css';` and your own reset | nothing to change |
| `@import 'ps-helix/styles.css';` and no reset of your own | `@import 'ps-helix/styles-full.css';` |

The accessibility guarantees (forced-colors focus fallback, reduced-motion guard) and the
modal scroll lock ship with `styles.css` either way. They are not opinions you can decline.

## 2. CSS custom properties

All 486 are namespaced `--psh-*`. The names ps-helix used before — `--primary-color`,
`--surface-card`, `--spacing-md`, `--border-radius` — are the names Bootstrap, PrimeNG and
most applications use for their own tokens, so importing ps-helix silently fought with the
host's design system.

**Fastest path:** import the compatibility layer and move on.

```css
@import 'ps-helix/styles.css';
@import 'ps-helix/src/lib/styles/compat.css';   /* delete once migrated */
```

**Doing it properly:** rename `--x` to `--psh-x` in your stylesheets, with two exceptions
where the merge is by value, not by name:

| Before | After | Why |
|---|---|---|
| `--border-radius` | `--psh-radius-lg` | It was an alias for `--radius-lg` (8px), **not** the equivalent of `--radius-base` (4px). Renaming by name would halve every corner. |
| `--border-radius-lg` | `--psh-radius-xl` | Same shifted alias layer. |
| `--btn-height-*`, `--height-input-*` | `--psh-control-height-*` | One token now, so a button and an input line up by contract rather than by coincidence. |

Your brand hooks need no change at all: both themes read `--psh-customer-primary-color`
first and fall back to `--customer-primary-color`.

The full list of 398 tokens, with light and dark values, is in
[`TOKENS.md`](./projects/ps-helix/TOKENS.md).

## 3. Component inputs — the colour axis

One notion was spelled six ways. `color` is now the only name, and
[`PshColor`](./projects/ps-helix/src/lib/types/semantic.types.ts) the only union:
`primary | secondary | success | warning | danger | info | neutral`.

| Component | Before | After |
|---|---|---|
| `psh-alert` | `type="info"` | `color="info"` |
| `psh-badge` | `variant="danger"` | `color="danger"` |
| `psh-button` | `variant="primary"` | `color="primary"` |
| `psh-dropdown` | `variant="primary"` | `color="primary"` |
| `psh-progressbar` | `variant="success"` | `color="success"` |
| `psh-tag` | `variant="warning"` | `color="warning"` |
| `psh-card` | `colorVariant="info"` | `color="info"` |
| `psh-stat-card` | `tagVariant="success"` | `tagColor="success"` |
| `ToastService.show()` | `{ type: 'info' }` | `{ color: 'info' }` |

**Values are unchanged** — `primary` is still `primary` — so no CSS class you may have
targeted moves in this step.

Two values did change:

- `psh-card`: `colorVariant="default"` → `color="neutral"`. `neutral` replaces the assorted
  `default` and `muted` values that meant "no semantic emphasis".
- `psh-badge`: `variant="disabled"` → `color="neutral" [disabled]="true"`. Disabled is a
  state, not a colour: as a colour value it meant a disabled badge could not also be a
  danger badge, and it was the only place in the library where `disabled` was not a
  boolean.

The codemod handles all of the above, including shorthand properties in toast options
(`show({ message, type, icon })`).

### What the codemod cannot do

It reports these rather than guessing:

- **A bound colour on `psh-badge`** — `[color]="expr"` where `expr` may produce the removed
  `'disabled'` value. Check the expression.
- **Your own `Record<ToastType, …>` maps.** The union has seven members now, so an
  exhaustive record keyed by the old four no longer type-checks. Either widen it or make it
  `Partial<Record<…>>`.
- **Per-component type aliases** (`ButtonVariant`, `BadgeVariant`, `ToastType`, …). They
  still compile — each is now a deprecated alias of `PshColor` — but new code should import
  `PshColor` directly.

### Colours a component does not render yet

`psh-button` and `psh-dropdown` accept five of the seven. Their colour matrix is crossed
with their three appearances and guarded by `:not()` chains that the appearance rework
replaces; extending it now would mean writing into a structure that is about to change.
They are typed as `Exclude<PshColor, 'info' | 'neutral'>` rather than accepting a value
that would silently fall through to the default styling.

## 4. Component inputs — the surface-treatment axis

`variant` carried three incompatible notions at once: elevation on card and table, colour
on badge and button, display form on tabs and stepper. Colour became `color` (above);
surface treatment is now `appearance`, with one vocabulary:

| Before | After |
|---|---|
| `filled` | `solid` |
| `outlined` | `outline` |
| `text` | `ghost` |
| `default` | `flat` |
| `elevated` | `elevated` *(unchanged)* |
| `outline` | `outline` *(unchanged)* |

| Component | Before | After |
|---|---|---|
| `psh-button`, `psh-dropdown` | `appearance="filled"` | `appearance="solid"` |
| `psh-input`, `psh-select`, `psh-textarea` | `variant="outlined"` | `appearance="outline"` |
| `psh-card`, `psh-horizontal-card`, `psh-info-card`, `psh-stat-card` | `variant="default"` | `appearance="flat"` |
| `psh-collapse`, `psh-pagination`, `psh-table` | `variant="default"` | `appearance="flat"` |

**`variant` still exists** — but only where the notion is genuinely component-specific and
is neither colour nor surface: `psh-tabs` (`underline | pills`), `psh-stepper`
(`numbered | progress`), `psh-menu` (`compact | expanded`), `psh-spinloader`
(`circle | dots | pulse`), `psh-tooltip` (`light | dark`). Those are unchanged.

### If you targeted the classes

The values change, so the classes derived from them change too — `filled` → `solid`,
`text` → `ghost`, `outlined` → `outline`, `variant-*` → `appearance-*` — and then §5
namespaces the result. End to end: `.filled` → `.psh-solid`, `.variant-default` →
`.psh-appearance-flat`.

### What the codemod cannot do

`[appearance]="'outlined'"` — a bound literal — **is** rewritten. A computed expression
such as `[appearance]="isActive ? 'filled' : 'outline'"` is not: the codemod reports each
one by file so you can go through them.

## 5. Every component class is now `psh-`

The 350 classes the components render are namespaced: `.card-body` → `.psh-card-body`,
`.stat-value` → `.psh-stat-value`, `.hoverable` → `.psh-hoverable`.

This is not cosmetic. Four components — `psh-card`, `psh-horizontal-card`, `psh-info-card`,
`psh-stat-card` — render with `ViewEncapsulation.None`, which they need in order to style
projected content (`.psh-card-body img`, `.psh-card-actions > *`): projected content carries
the *parent's* encapsulation attribute, so an emulated component cannot reach it. The cost
was that every class they declared was global, and five of them — `.card`, `.card-header`,
`.card-body`, `.card-footer`, `.card-title` — are Bootstrap's, verbatim. Any application
with its own `.card-body` was being restyled by a card it never rendered.

This repository had the bug. The pagination demo page has its own `.stat-card` /
`.stat-value` markup, and the library's stat-card was styling it.

### What the codemod does, and where it stops

**Inside `::ng-deep`, it rewrites.** `::ng-deep .card-body` exists to pierce into a child
component, so the class is unambiguously the library's.

```css
/* before */  :host ::ng-deep .card-body img { border-radius: 0; }
/* after  */  :host ::ng-deep .psh-card-body img { border-radius: 0; }
```

**Outside `::ng-deep`, it reports and leaves the rule alone.** A bare `.card-body` is the
collision itself: it may be the library's class or your own, and nothing in the file says
which. The codemod prints one line per name and lets you decide — rewriting it would be a
script guessing about your markup.

```
!  src/app/stats.component.css: .stat-card is also a ps-helix class now named
   .psh-stat-card — left as is: only you know whether this rule targets the design
   system or your own markup
```

In most cases the answer is *your own markup*, and the correct action is to change nothing:
the rename is what stops the library from interfering with it.

There is no compatibility layer for classes. An alias would reintroduce the global names
that are the entire problem.

## 6. Styling a component from outside

Component custom properties used to be declared on the element that consumed them, so
setting one on the host did nothing:

```css
/* 6.x — inherited down to the inner <button>, then immediately redefined. No effect. */
psh-button { --btn-height-md: 3rem; }
```

They are now read with their default as a `var()` fallback, so an override works from
anywhere — a component stylesheet or a global one:

```css
psh-button { --psh-btn-min-width-md: 10rem; }
```

The 82 available properties are listed per component in
[`TOKENS.md`](./projects/ps-helix/TOKENS.md#component-css-api).

If you were reaching in with `::ng-deep` to work around the old behaviour, check whether a
property now covers your case.

## 7. Smaller changes

- **Dependencies.** `date-fns` is gone (it had zero usages). `@ngx-translate/core` is an
  optional peer with a `>=15` range — if you were held to `^15` by ps-helix, you no longer
  are.
- **Package exports.** `./styles.css` and the styles subtree are declared, so the import
  the README documents now works under esbuild, Vite and Rollup rather than only through
  the Angular CLI's tolerance.
- **Focus.** `:focus-visible` is the trigger everywhere. If you relied on the ring
  appearing on mouse click for `psh-input`, `psh-select` or `psh-textarea`, it no longer
  does — that was the inconsistency, not the behaviour.
