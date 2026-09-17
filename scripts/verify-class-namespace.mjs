/**
 * Guards the class namespace, and generates the rename map the 7.0.0 codemod consumes.
 *
 * Four components render with `ViewEncapsulation.None` because they style projected content
 * — `.psh-card-body img`, `.psh-card-actions > *` — which emulated encapsulation cannot
 * reach: projected content carries the *parent's* `_ngcontent` attribute, not the card's.
 * Taking encapsulation back would break those rules silently, so the fix is the namespace,
 * and the namespace only holds if nothing slips out of it later.
 *
 * Two jobs, deliberately in one file so they cannot disagree:
 *
 *   --check   fails if any component class is unprefixed, or if the map has drifted.
 *   (default) rewrites `scripts/class-map-7.0.0.json`.
 *
 * Usage:
 *   node scripts/verify-class-namespace.mjs [--check]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'projects/ps-helix/src/lib');
const MAP_FILE = join(ROOT, 'scripts/class-map-7.0.0.json');

/** Phosphor icon classes belong to a third party; `psh-*` is already done. */
const EXEMPT = /^(ph|ph-.+|psh-.+)$/;

/** A class token as it may appear in a `class="…"` attribute. */
const PLAIN_TOKEN = /^[a-z][a-z0-9_-]*$/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.css', '.html', '.ts'].includes(extname(entry))) out.push(p);
  }
  return out;
}

const owned = new Set();
const offenders = new Map();
const flag = (name, where) => {
  if (!offenders.has(name)) offenders.set(name, new Set());
  offenders.get(name).add(where);
};

/**
 * The codemod map covers component classes only. The 559 utility classes have been `psh-`
 * since 6.0.0, so a bare `.gap-md` in a consumer's stylesheet is *their* class, not one of
 * ours — renaming it would be the codemod damaging code it does not own.
 */
const isComponent = rel => rel.includes('/lib/components/');

for (const file of walk(LIB)) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const src = readFileSync(file, 'utf8');
  const keep = name => {
    if (isComponent(rel)) owned.add(name);
  };

  if (extname(file) === '.css') {
    // None of these are selectors: an `@import` path, a `url(…)`, or a comment that happens
    // to name a file — `/* … effects.tokens.css … */` yields a convincing `.css`.
    const selectors = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/@import[^;]*;/g, '')
      .replace(/url\([^)]*\)/g, '');
    for (const m of selectors.matchAll(/\.([a-z][a-z0-9_-]*)/g)) {
      if (EXEMPT.test(m[1])) {
        if (m[1].startsWith('psh-')) keep(m[1].slice(4));
        continue;
      }
      flag(m[1], rel);
    }
    continue;
  }

  if (rel.endsWith('.spec.ts')) continue;

  // A class attribute may hold interpolation — `class="ph ph-{{ item.icon }}"`. Only a bare
  // token is a class name we are responsible for.
  for (const m of src.matchAll(/\sclass="([^"]*)"/g)) {
    for (const token of m[1].split(/\s+/)) {
      if (!PLAIN_TOKEN.test(token)) continue;
      if (EXEMPT.test(token)) {
        if (token.startsWith('psh-')) keep(token.slice(4));
        continue;
      }
      flag(token, rel);
    }
  }

  // `[class.foo]`, in a template or in host metadata.
  for (const m of src.matchAll(/\[class\.([a-z][a-z0-9_-]*)\]/g)) {
    if (EXEMPT.test(m[1])) {
      if (m[1].startsWith('psh-')) keep(m[1].slice(4));
      continue;
    }
    flag(m[1], rel);
  }
}

const check = process.argv.includes('--check');
let failed = false;

if (offenders.size > 0) {
  console.error(`✖ ${offenders.size} component class names are outside the psh- namespace:`);
  for (const [name, files] of [...offenders].sort()) {
    console.error(`    .${name}  —  ${[...files].sort().join(', ')}`);
  }
  failed = true;
}

const map = [...owned].sort();
const serialised = `${JSON.stringify(map, null, 2)}\n`;

if (check) {
  let current = null;
  try {
    // Normalised for the same reason as TOKENS.md: CRLF on a Windows checkout, LF on write.
    current = readFileSync(MAP_FILE, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    console.error('✖ scripts/class-map-7.0.0.json is missing — run npm run docs:classes');
    failed = true;
  }
  if (current !== null && current !== serialised) {
    console.error(
      `✖ scripts/class-map-7.0.0.json is stale (${JSON.parse(current).length} entries on disk, ${map.length} in the stylesheets) — run npm run docs:classes`,
    );
    failed = true;
  }
  if (!failed) console.log(`✔ ${map.length} classes, all namespaced, codemod map in sync`);
} else {
  writeFileSync(MAP_FILE, serialised, 'utf8');
  console.log(`${map.length} classes written to scripts/class-map-7.0.0.json`);
}

process.exit(failed ? 1 : 0);
