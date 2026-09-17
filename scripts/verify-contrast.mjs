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
 * This reads the pairs out of the theme stylesheets, so it checks the values that ship.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEMES = ['light', 'dark'];
const KINDS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'];

/** WCAG 2.1 §1.4.3 — normal-size text. These fills carry button and tag labels. */
const FLOOR = 4.5;

function declarations(theme) {
  const file = join(ROOT, 'projects/ps-helix/src/lib/styles/themes', `${theme}.css`);
  const map = new Map();
  for (const [, name, value] of readFileSync(file, 'utf8').matchAll(/(--psh-[\w-]+)\s*:\s*([^;]+);/g)) {
    map.set(name, value.trim());
  }
  return map;
}

function resolve(map, name, seen = new Set()) {
  if (seen.has(name)) return undefined;
  seen.add(name);
  const raw = map.get(name);
  if (!raw) return undefined;
  // Brand hooks nest their fallbacks: var(--psh-customer-x, var(--customer-x, #hex)).
  // The innermost literal is what an application that sets no brand colour renders.
  const literal = raw.match(/#[0-9a-fA-F]{3,8}(?=[\s)]*$)/);
  if (literal) return literal[0];
  const ref = raw.match(/^var\(\s*(--psh-[\w-]+)/);
  return ref ? resolve(map, ref[1], seen) : raw;
}

function luminance(hex) {
  const h = hex.slice(1);
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const channels = [0, 2, 4].map((i) => {
    const s = parseInt(full.slice(i, i + 2), 16) / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const failures = [];
const rows = [];

for (const theme of THEMES) {
  const map = declarations(theme);
  for (const kind of KINDS) {
    const fill = resolve(map, `--psh-${kind}-color`);
    const ink = resolve(map, `--psh-text-on-${kind}`);

    if (!fill?.startsWith('#') || !ink?.startsWith('#')) {
      failures.push(`${theme}/${kind}: cannot resolve a colour (fill=${fill} ink=${ink})`);
      continue;
    }

    const measured = ratio(ink, fill);
    rows.push(`  ${theme.padEnd(5)} ${kind.padEnd(10)} ${ink} on ${fill}  ${measured.toFixed(2)}:1`);
    if (measured < FLOOR) {
      failures.push(
        `${theme}/${kind}: --psh-text-on-${kind} (${ink}) on --psh-${kind}-color (${fill}) ` +
          `is ${measured.toFixed(2)}:1, under the ${FLOOR}:1 floor`,
      );
    }
  }
}

if (failures.length) {
  console.error('verify:contrast — semantic fills that their own text cannot be read on:\n');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  console.error('\nFix the ink in the theme stylesheet, or darken the fill. Both ship.');
  process.exit(1);
}

console.log(rows.join('\n'));
console.log(`\n  ok  ${rows.length} semantic pairs at or above ${FLOOR}:1`);
