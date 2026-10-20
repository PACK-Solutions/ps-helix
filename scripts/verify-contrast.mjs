#!/usr/bin/env node
/**
 * Every semantic fill must be readable by the ink the theme puts on it.
 *
 * axe's `color-contrast` rule is disabled under jsdom (it cannot resolve computed colours),
 * which left the library's own palette unchecked by CI — the only contrast guarantee in the
 * repo covered *customer* brand colours, through the theme service. The gap showed: in the
 * dark theme, primary was lightened so it would read against a dark surface, and white text
 * stayed on it at 3.52:1. Every `psh-button color="primary"`, tag, badge and dropdown item
 * in dark mode was under the WCAG AA floor.
 *
 * The same gap hid a second one: `psh-alert` writes coloured text on a 10% tint of its own
 * colour, and that pair was never checked. Success, warning and danger read at 3.97:1, 4.24:1
 * and 4.05:1 in the light theme. The alert's tokens are composed — `rgba()` over the page,
 * `color-mix()` for the ink — so this resolves them the way a browser does, over the page and
 * over a card, and holds the worse of the two to the floor.
 *
 * This reads the pairs out of the theme stylesheets, so it checks the values that ship.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEMES = ['light', 'dark'];
const KINDS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'];
/** What an alert can sit on. Its tint is translucent, so the backdrop is part of the pair. */
const BACKDROPS = ['--psh-surface-ground', '--psh-surface-card'];

/** WCAG 2.1 §1.4.3 — normal-size text. These fills carry button and tag labels. */
const FLOOR = 4.5;
/**
 * WCAG 2.1 §1.4.11 — the graphics that identify a component. The alert's border is what
 * draws its edge against the page; its tint alone is a 10% wash that barely does.
 */
const NON_TEXT_FLOOR = 3;

function declarations(theme) {
  const file = join(ROOT, 'projects/ps-helix/src/lib/styles/themes', `${theme}.css`);
  const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const map = new Map();
  for (const [, name, value] of css.matchAll(/(--psh-[\w-]+)\s*:\s*([^;]+);/g)) {
    map.set(name, value.trim());
  }
  return map;
}

/* ------------------------------------------------------------------ CSS values */

/** Split on the commas that are not inside parentheses. */
function topLevel(args) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '(') depth++;
    else if (args[i] === ')') depth--;
    else if (args[i] === ',' && depth === 0) {
      parts.push(args.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(args.slice(start).trim());
  return parts;
}

/** `name(args)` → args, when `value` is exactly one such call. */
function call(value, name) {
  const v = value.trim();
  if (!v.startsWith(`${name}(`) || !v.endsWith(')')) return undefined;
  return v.slice(name.length + 1, -1);
}

/**
 * Replace every `var()` with what it stands for. A name the theme does not declare falls
 * back, so the brand hooks — var(--psh-customer-x, var(--customer-x, #hex)) — come out as the
 * value an application that sets no brand colour renders.
 */
function substitute(map, value, seen = new Set()) {
  let out = '';
  let i = 0;
  while (i < value.length) {
    const at = value.indexOf('var(', i);
    if (at < 0) return out + value.slice(i);
    out += value.slice(i, at);
    let depth = 0;
    let end = at + 3;
    for (; end < value.length; end++) {
      if (value[end] === '(') depth++;
      else if (value[end] === ')' && --depth === 0) break;
    }
    const [name, ...fallback] = topLevel(value.slice(at + 4, end));
    if (map.has(name) && !seen.has(name)) {
      out += substitute(map, map.get(name), new Set([...seen, name]));
    } else if (fallback.length) {
      out += substitute(map, fallback.join(', '), seen);
    } else {
      throw new Error(`undeclared ${name}, with no fallback`);
    }
    i = end + 1;
  }
  return out;
}

const NAMED = { black: [0, 0, 0, 1], white: [255, 255, 255, 1], transparent: [0, 0, 0, 0] };

/** A resolved colour as [r, g, b, a], 0–255 and 0–1. Only what the themes use. */
function color(value) {
  const v = value.trim();
  if (NAMED[v]) return NAMED[v];
  if (v.startsWith('#')) {
    const h = v.slice(1);
    const full = h.length <= 4 ? [...h].map((c) => c + c).join('') : h;
    const n = [0, 2, 4, 6].map((i) => parseInt(full.slice(i, i + 2) || 'ff', 16));
    return [n[0], n[1], n[2], n[3] / 255];
  }
  const rgb = call(v, 'rgba') ?? call(v, 'rgb');
  if (rgb !== undefined) {
    const n = topLevel(rgb).map(Number);
    return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1];
  }
  const mix = call(v, 'color-mix');
  if (mix !== undefined) {
    // color-mix(in srgb, A p%, B [q%]) — opaque operands, so a plain weighted average.
    const [space, ...operands] = topLevel(mix);
    if (space !== 'in srgb') throw new Error(`color-mix ${space} is not supported`);
    const parsed = operands.map((o) => {
      const m = o.match(/^(.*?)\s+([\d.]+)%$/);
      return m ? { c: color(m[1]), p: Number(m[2]) / 100 } : { c: color(o), p: undefined };
    });
    const [a, b] = parsed;
    const pa = a.p ?? 1 - (b.p ?? 0.5);
    return [0, 1, 2].map((i) => a.c[i] * pa + b.c[i] * (1 - pa)).concat(1);
  }
  throw new Error(`cannot read the colour "${v}"`);
}

/** `top` painted over an opaque `bottom`. */
function over(top, bottom) {
  const a = top[3];
  return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a)).concat(1);
}

function luminance([r, g, b]) {
  const channels = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const hex = (c) => `#${c.slice(0, 3).map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')}`;

/** The colour a token renders, or the reason it does not. */
function resolveColor(map, token) {
  if (!map.has(token)) return { error: `${token} is not declared` };
  try {
    return { value: color(substitute(map, `var(${token})`)) };
  } catch (e) {
    return { error: `${token}: ${e.message}` };
  }
}

/* --------------------------------------------------------------------- checks */

const failures = [];
const rows = [];
const alertRows = [];
const borderRows = [];

for (const theme of THEMES) {
  const map = declarations(theme);

  // Solid fills and the ink on them: buttons, tags, badges, dropdown items.
  for (const kind of KINDS) {
    const fill = resolveColor(map, `--psh-${kind}-color`);
    const ink = resolveColor(map, `--psh-text-on-${kind}`);
    if (fill.error || ink.error) {
      failures.push(`${theme}/${kind}: ${fill.error ?? ink.error}`);
      continue;
    }

    const measured = ratio(ink.value, fill.value);
    rows.push(`  ${theme.padEnd(5)} ${kind.padEnd(10)} ${hex(ink.value)} on ${hex(fill.value)}  ${measured.toFixed(2)}:1`);
    if (measured < FLOOR) {
      failures.push(
        `${theme}/${kind}: --psh-text-on-${kind} (${hex(ink.value)}) on --psh-${kind}-color (${hex(fill.value)}) ` +
          `is ${measured.toFixed(2)}:1, under the ${FLOOR}:1 floor`,
      );
    }
  }

  // psh-alert: coloured text on a tint of its own colour, over whatever the alert sits on.
  for (const kind of KINDS) {
    const tint = resolveColor(map, `--psh-alert-${kind}-bg`);
    const ink = resolveColor(map, `--psh-alert-${kind}-text-color`);
    if (tint.error || ink.error) {
      failures.push(`${theme}/alert-${kind}: ${tint.error ?? ink.error}`);
      continue;
    }

    let worst = null;
    for (const backdrop of BACKDROPS) {
      const under = resolveColor(map, backdrop);
      if (under.error) {
        failures.push(`${theme}/alert-${kind}: ${under.error}`);
        continue;
      }
      const surface = over(tint.value, under.value);
      const measured = ratio(over(ink.value, surface), surface);
      if (!worst || measured < worst.measured) worst = { measured, backdrop, surface };
    }
    if (!worst) continue;

    alertRows.push(
      `  ${theme.padEnd(5)} ${kind.padEnd(10)} ${hex(ink.value)} on ${hex(worst.surface)}  ${worst.measured.toFixed(2)}:1` +
        `  (over ${worst.backdrop.replace('--psh-surface-', '')})`,
    );
    if (worst.measured < FLOOR) {
      failures.push(
        `${theme}/alert-${kind}: --psh-alert-${kind}-text-color (${hex(ink.value)}) on its tint over ` +
          `${worst.backdrop} (${hex(worst.surface)}) is ${worst.measured.toFixed(2)}:1, under the ${FLOOR}:1 floor`,
      );
    }
  }

  // psh-alert's border against what surrounds it: the edge of the component.
  for (const kind of KINDS) {
    const border = resolveColor(map, `--psh-alert-${kind}-border-color`);
    if (border.error) {
      failures.push(`${theme}/alert-${kind}: ${border.error}`);
      continue;
    }

    let worst = null;
    for (const backdrop of BACKDROPS) {
      const under = resolveColor(map, backdrop);
      if (under.error) continue; // already reported above
      const edge = over(border.value, under.value);
      const measured = ratio(edge, under.value);
      if (!worst || measured < worst.measured) worst = { measured, backdrop, under: under.value, edge };
    }
    if (!worst) continue;

    borderRows.push(
      `  ${theme.padEnd(5)} ${kind.padEnd(10)} ${hex(worst.edge)} against ${hex(worst.under)}  ${worst.measured.toFixed(2)}:1` +
        `  (${worst.backdrop.replace('--psh-surface-', '')})`,
    );
    if (worst.measured < NON_TEXT_FLOOR) {
      failures.push(
        `${theme}/alert-${kind}: --psh-alert-${kind}-border-color (${hex(worst.edge)}) against ` +
          `${worst.backdrop} (${hex(worst.under)}) is ${worst.measured.toFixed(2)}:1, under the ${NON_TEXT_FLOOR}:1 floor`,
      );
    }
  }
}

if (failures.length) {
  console.error('verify:contrast — text the theme puts on a colour that it cannot be read on:\n');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  console.error('\nFix the ink in the theme stylesheet, or the fill or tint under it. Both ship.');
  process.exit(1);
}

console.log(rows.join('\n'));
console.log(`\n  ok  ${rows.length} semantic pairs at or above ${FLOOR}:1`);
console.log(`\n${alertRows.join('\n')}`);
console.log(`\n  ok  ${alertRows.length} alert colours at or above ${FLOOR}:1, over the page and over a card`);
console.log(`\n${borderRows.join('\n')}`);
console.log(`\n  ok  ${borderRows.length} alert borders at or above ${NON_TEXT_FLOOR}:1 against the page and a card`);
