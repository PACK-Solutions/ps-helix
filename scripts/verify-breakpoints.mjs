/**
 * Guards the responsive scale.
 *
 * `breakpoints.tokens.css` documented the convention from the start — em-based, six canonical
 * values — and the code did not follow it: 8 × `768px`, 7 × `480px`, plus `576px` and `400px`
 * that are on no scale at all. A documented convention with nothing enforcing it is a comment.
 *
 * Three rules, each for a defect that was live:
 *
 *   1. No `px` in a media or container query. An em query scales with the user's root font
 *      size and a px query does not, so at 150% zoom a px-based component has not switched
 *      while the em-based one beside it has.
 *
 *   2. Only canonical values. `576px` (a Bootstrap number) and `400px` were each used once,
 *      so two components switched at widths nothing else knew about.
 *
 *   3. A `max-width` is exclusive. `min-width: 48em` and `max-width: 48em` are **both** true
 *      at exactly 768px — that overlap was live in `responsive.utils.css`, where eight rules
 *      paired them, so an element was simultaneously "small screen" and "large screen".
 *
 * Usage: node scripts/verify-breakpoints.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STYLES = join(ROOT, 'projects/ps-helix/src');

/** The scale, from breakpoints.tokens.css. */
const MIN = new Set(['30em', '40em', '48em', '64em', '80em', '96em']);
/** One pixel below each, at a 16px root. */
const MAX = new Set(['29.9375em', '39.9375em', '47.9375em', '63.9375em', '79.9375em', '95.9375em']);

const CONDITION = /@(media|container)[^{]*?(min|max)-width:\s*([^)\s]+)/g;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (extname(p) === '.css') out.push(p);
  }
  return out;
}

const problems = [];
let checked = 0;

for (const file of walk(STYLES)) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const src = readFileSync(file, 'utf8');

  for (const [, , kind, value] of src.matchAll(CONDITION)) {
    checked++;
    const expected = kind === 'min' ? MIN : MAX;
    if (expected.has(value)) continue;

    const why = value.endsWith('px')
      ? 'px does not scale with browser zoom'
      : kind === 'max' && MIN.has(value)
        ? `inclusive: overlaps min-width: ${value} at exactly that width`
        : 'not on the scale in breakpoints.tokens.css';
    problems.push(`${rel}: ${kind}-width: ${value} — ${why}`);
  }
}

if (problems.length > 0) {
  console.error(`✖ ${problems.length} responsive conditions off the scale:`);
  for (const p of problems) console.error(`    ${p}`);
  console.error('\n  min-width: 30em | 40em | 48em | 64em | 80em | 96em');
  console.error('  max-width: the same value minus 0.0625em — 47.9375em, not 48em');
  process.exit(1);
}

console.log(`✔ ${checked} responsive conditions, all on the em scale`);
