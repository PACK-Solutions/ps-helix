#!/usr/bin/env node
/**
 * What a stylesheet can be held to about narrow screens and pointer targets.
 *
 * The honest scope first, because a gate that overreaches gets an allowlist and then means
 * nothing: **a stylesheet cannot tell you how big anything renders**. A dismiss button with
 * `padding: var(--psh-spacing-xs)` around a 16px icon comes out at 32px or at 16px depending
 * on the icon font, and no amount of parsing decides it. That is measurement, and measurement
 * needs a browser — `scripts/probe-responsive.html` is the instrument, and it is what found
 * the three undersized controls this file now keeps from coming back by the same route.
 *
 * What a stylesheet *does* decide:
 *
 *   1. A control that removes its own box — `padding: 0`, or an explicit size under the 24px
 *      floor of WCAG 2.2 SC 2.5.8 — with nothing putting a minimum back. `psh-table`'s sort
 *      button was exactly this: `padding: 0` inside a `th` that held the padding, so the
 *      button was 17px tall inside a 49px cell.
 *   2. A rigid inline size at or above 200px with no way to shrink. At 320px, less the page
 *      gutter, that is the width where a component starts pushing the page sideways.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = join(ROOT, 'projects/ps-helix/src/lib/components');

/** A selector naming something a pointer lands on. */
const INTERACTIVE =
  /(^|[\s>+~,])(button|a)(?![\w-])|\[role=["']button["']\]|[.#][\w-]*(close|dismiss|clear|sort-button|remove)\b/i;

/** Either touch-target token answers the rule; which one is a design call, not a gate. */
const TARGET_TOKEN = /--psh-touch-target-(min|compact)/;

const MIN_TARGET_PX = 24;
const RIGID_PX = 200;

function stylesheets(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...stylesheets(path));
    else if (entry.endsWith('.css')) out.push(path);
  }
  return out;
}

/** Comments here quote the values they replaced, so a scan that keeps them reports the fix. */
function strip(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function toPx(value, unit) {
  return Number(value) * (unit === 'px' ? 1 : 16);
}

/** The block itself, plus any block whose selector starts with it — where a min may be put back. */
function relatedBodies(blocks, selector) {
  const base = selector.trim().split(/[\s,]/)[0];
  return blocks.filter(([, sel]) => sel.includes(base)).map(([, , body]) => body).join('\n');
}

const failures = [];
let controls = 0;
let sizes = 0;

for (const file of stylesheets(COMPONENTS)) {
  const key = relative(COMPONENTS, file).replace(/\\/g, '/');
  const css = strip(readFileSync(file, 'utf8'));
  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];

  for (const [, prop, raw] of css.matchAll(/(?<![-\w])(min-width|width|flex-basis)\s*:\s*([^;}]+)[;}]/g)) {
    if (/%|auto|fit-content|min\(|clamp\(|calc\(|var\(/.test(raw)) continue;
    for (const [, value, unit] of raw.matchAll(/(\d+(?:\.\d+)?)\s*(px|rem|em)/g)) {
      sizes += 1;
      if (toPx(value, unit) >= RIGID_PX) {
        failures.push(
          `${key}: \`${prop}: ${value}${unit}\` is rigid at ${toPx(value, unit)}px — ` +
            'a 320px screen cannot shrink it. Use a max-width, a percentage, or a var().',
        );
      }
    }
  }

  for (const [, selector, body] of blocks) {
    if (!INTERACTIVE.test(selector)) continue;

    // Only an all-sides zero. `padding: 0 var(--psh-spacing-lg)` keeps a horizontal box, and
    // a button whose height comes from the control scale is sized, not stripped.
    const strippedBox = /(?<![-\w])padding\s*:\s*0(?:px)?\s*(?=[;}])/.test(body);
    const tooSmall = [...body.matchAll(/(?<![-\w])(width|height)\s*:\s*(\d+(?:\.\d+)?)(px|rem|em)/g)].filter(
      ([, , value, unit]) => toPx(value, unit) < MIN_TARGET_PX,
    );

    if (!strippedBox && tooSmall.length === 0) continue;
    controls += 1;

    const related = relatedBodies(blocks, selector);
    if (TARGET_TOKEN.test(related)) continue;
    // A size put back anywhere on the same control answers the rule, whether it is a literal
    // at or above the floor or a token — `--psh-control-height-*` is the form buttons use.
    const sized = [...related.matchAll(/(?:min-)?(?:width|height)\s*:\s*([^;}]+)[;}]/g)].some(([, raw]) => {
      if (/var\(/.test(raw)) return true;
      const literal = raw.match(/(\d+(?:\.\d+)?)\s*(px|rem|em)/);
      return literal ? toPx(literal[1], literal[2]) >= MIN_TARGET_PX : false;
    });
    if (sized) continue;

    const why = strippedBox
      ? '`padding: 0` leaves the target at its content size'
      : `an explicit size under ${MIN_TARGET_PX}px`;
    failures.push(
      `${key}: \`${selector.trim().slice(0, 48)}\` — ${why}, and nothing puts a minimum back. ` +
        'Use --psh-touch-target-min, or --psh-touch-target-compact inside a compact component.',
    );
  }
}

if (failures.length) {
  console.error('verify:layout — what a narrow screen or a thumb would find:\n');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  console.error(
    '\nRendered sizes are not decidable here. Measure with scripts/probe-responsive.html.',
  );
  process.exit(1);
}

console.log(
  `  ok  ${sizes} literal inline size(s), none rigid; ` +
    `${controls} control(s) that strip their box all put a minimum back`,
);
