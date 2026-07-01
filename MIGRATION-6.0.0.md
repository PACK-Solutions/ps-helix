# Migration guide — ps-helix 5.x → 6.0.0

## TL;DR

`6.0.0` renames **only the global CSS utility classes**. Every utility helper is
now prefixed with `psh-`:

```
.p-md          →  .psh-p-md
.flex          →  .psh-flex
.text-center   →  .psh-text-center
.grid-cols-2   →  .psh-grid-cols-2
.sm:hidden     →  .psh-sm:hidden
```

The **TypeScript/component API is unchanged** — component selectors
(`psh-button`, `psh-modal`, …), `input`/`output`/`model` signatures, services,
directives and exports are identical to `5.x`. If your app does **not** use the
utility CSS classes in its own templates, upgrading is a no-op.

## Who is affected

You are affected **only** if your own markup uses ps-helix utility classes, e.g.:

```html
<!-- 5.x -->
<div class="flex items-center gap-md p-lg">…</div>

<!-- 6.0.0 -->
<div class="psh-flex psh-items-center psh-gap-md psh-p-lg">…</div>
```

You are **not** affected by the class rename if you only consume ps-helix
*components* and *design tokens* (CSS custom properties like `--spacing-md`,
`--primary-color`, `--shadow-md` — these are **unchanged**).

## Why

The utilities lived in the global namespace (`.container`, `.flex`, `.p-md`, …)
and could silently collide with your own classes or another utility framework
(Tailwind, Bootstrap). Namespacing them under `psh-` removes that risk and makes
the origin of a class obvious.

## What changed

| Category | 5.x | 6.0.0 |
|----------|-----|-------|
| Spacing | `.m-*`, `.p-*`, `.gap-*` | `.psh-m-*`, `.psh-p-*`, `.psh-gap-*` |
| Typography | `.text-*`, `.font-*`, `.leading-*`, `.tracking-*` | `.psh-text-*`, `.psh-font-*`, … |
| Layout | `.flex`, `.grid`, `.hidden`, `.w-full`, `.overflow-*`, … | `.psh-flex`, `.psh-grid`, `.psh-hidden`, … |
| Colors | `.bg-*`, `.border-*`, `.text-{teal,rose,…}-500` | `.psh-bg-*`, `.psh-border-*`, … |
| Responsive | `.sm:*`, `.md:*`, `.lg:*`, `.mobile:*` | `.psh-sm:*`, `.psh-md:*`, `.psh-lg:*`, `.psh-mobile:*` |
| Animations | `.animate-*` | `.psh-animate-*` |
| Focus | `.focus-ring*`, `.focus-visible-only`, `.skip-link` | `.psh-focus-ring*`, `.psh-skip-link`, … |
| Visibility | `.visible`, `.opacity-*`, `.cursor-*`, `.mobile-only`, … | `.psh-visible`, `.psh-opacity-*`, … |
| Container | `.container` | `.psh-container` |
| Modal body state | `body.modal-open` | `body.psh-modal-open` |

**Removed:** the obsolete `.js-focus-visible` polyfill rule in `focus.utils.css`
(native `:focus-visible` is now used everywhere). If you relied on the
[`focus-visible` polyfill](https://github.com/WICG/focus-visible), you no longer
need it for ps-helix.

The complete catalog of utility classes is listed in `src/AI_KNOWLEDGE.md` and in
the shipped `styles/utilities/*.css` files.

## Automated codemod

This script derives the exact rename map from the installed package's CSS (so it
only touches real ps-helix utility names) and prefixes them inside `class="…"`
and `[class.…]` / `[ngClass]` usages in your templates. Review the diff before
committing.

```js
// codemod-psh-utilities.mjs — run with: node codemod-psh-utilities.mjs "src/**/*.html"
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// 1. Build the old→new base-name map from the shipped utility CSS.
const utilDir = 'node_modules/ps-helix/styles/utilities';
const names = new Set();
for (const f of readdirSync(utilDir)) {
  if (!f.endsWith('.css')) continue;
  const css = readFileSync(join(utilDir, f), 'utf8');
  for (const m of css.matchAll(/\.psh-((?:[\w-]|\\:)+)/g)) {
    names.add(m[1].replace(/\\:/g, ':')); // e.g. "sm:hidden", "p-md"
  }
}
// Longest first so "grid-cols-2" is replaced before "grid".
const ordered = [...names].sort((a, b) => b.length - a.length);

// 2. Replace whole class tokens inside class attributes only.
const files = process.argv.slice(2);
const CLASS_ATTR = /(\bclass(?:Name)?\s*=\s*["'])([^"']*)(["'])/g;
function migrate(src) {
  return src.replace(CLASS_ATTR, (all, open, value, close) => {
    const migrated = value
      .split(/\s+/)
      .map(tok => (names.has(tok) ? `psh-${tok}` : tok))
      .join(' ');
    return open + migrated + close;
  });
}
for (const file of files) {
  const out = migrate(readFileSync(file, 'utf8'));
  writeFileSync(file, out, 'utf8');
  console.log('migrated', file);
}
```

> The snippet handles static `class="…"` attributes. If you build class strings
> dynamically (`[ngClass]`, template literals, TS constants), search your codebase
> for the old base names and prefix them by hand — and don't forget
> `body.modal-open` → `body.psh-modal-open` if you targeted it in custom CSS.

## Manual approach

If you have only a handful of usages, prefix each ps-helix utility class with
`psh-` (the responsive variant stays after the prefix: `md:grid-cols-2` →
`psh-md:grid-cols-2`).

## Not affected

- Component selectors, inputs/outputs/models, services, directives, exports.
- Design tokens / CSS custom properties (`--spacing-*`, `--color-*`, `--shadow-*`,
  `--z-index-*`, `--breakpoint-*`).
- Theming (`data-theme="dark"`, `ThemeService`).
