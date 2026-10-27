/**
 * Generates projects/ps-helix/TOKENS.md from the stylesheets themselves.
 *
 * The hand-written documentation covered 24 of ~490 properties and had drifted far enough
 * to describe a --color-* family that never existed in the code. Deriving the reference
 * from the source is the only way it stays true: a token that is added, renamed or removed
 * shows up on the next run.
 *
 *   node scripts/generate-token-reference.mjs          # write
 *   node scripts/generate-token-reference.mjs --check  # fail if stale (CI)
 *
 * Also asserts light/dark parity: a token defined in one theme and not the other is a
 * contract the other theme cannot honour, and exits non-zero if that happens again.
 *
 * And that the library reads no property nothing declares (see "reads of nothing" below).
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'projects/ps-helix/src/lib');
const STYLES = join(ROOT, 'projects/ps-helix/src/lib/styles');
const COMPONENTS = join(ROOT, 'projects/ps-helix/src/lib/components');
const TARGET = join(ROOT, 'projects/ps-helix/TOKENS.md');
const CHECK = process.argv.includes('--check');

const DECL = /^[ \t]*(--psh-[a-z0-9-]+)[ \t]*:[ \t]*([^;]+);(?:[ \t]*\/\*[ \t]*(.*?)[ \t]*\*\/)?/gm;

const SECTION_TITLE = {
  'spacing.tokens.css': 'Spacing',
  'sizing.tokens.css': 'Sizing, radii and control heights',
  'typography.tokens.css': 'Typography',
  'effects.tokens.css': 'Shadows, focus rings and z-index layers',
  'animations.tokens.css': 'Motion',
  'layout.tokens.css': 'Layout',
  'breakpoints.tokens.css': 'Breakpoints',
  'reset.css': 'Base — reset',
  'global.css': 'Base — global',
  'light.css': 'Theme',
};

// Both are generated restatements of tokens declared elsewhere, not sources: compat.css
// aliases the pre-7.0.0 names, and dark-auto.css is dark.css again behind
// prefers-color-scheme. Counting either would double the reference and break the
// light/dark parity check against a file that is, by construction, only dark.
const isTokenSource = (entry) =>
  extname(entry) === '.css' && !['compat.css', 'dark-auto.css'].includes(basename(entry));

function walk(dir, keep = isTokenSource, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, keep, out);
    else if (keep(entry)) out.push(p);
  }
  return out;
}

const byFile = new Map();
const light = new Map();
const dark = new Map();

for (const file of walk(STYLES).sort()) {
  const src = readFileSync(file, 'utf8');
  const name = basename(file);
  const rows = [];

  for (const m of src.matchAll(DECL)) {
    const [, token, rawValue, note] = m;
    const value = rawValue.trim();
    if (name === 'dark.css') dark.set(token, value);
    else if (name === 'light.css') light.set(token, value);
    rows.push({ token, value, note: note ?? '' });
  }
  if (rows.length) byFile.set(file, rows);
}

const esc = s => s.replace(/\|/g, '\\|');
const sections = [];
let total = 0;

for (const [file, rows] of byFile) {
  const name = basename(file);
  if (name === 'dark.css') continue; // folded into the theme table as a second column
  total += rows.length;

  sections.push(`## ${SECTION_TITLE[name] ?? name}`, '');

  if (name === 'light.css') {
    sections.push(
      `${rows.length} semantic tokens. Each one is redefined in \`dark.css\`; the two themes are kept symmetrical, and this generator fails if they drift apart.`,
      '',
      '| Token | Light | Dark |',
      '|---|---|---|',
    );
    for (const { token } of rows) {
      sections.push(`| \`${token}\` | \`${esc(light.get(token) ?? '')}\` | \`${esc(dark.get(token) ?? '—')}\` |`);
    }
  } else {
    sections.push('| Token | Value | |', '|---|---|---|');
    for (const { token, value, note } of rows) {
      sections.push(`| \`${token}\` | \`${esc(value)}\` | ${esc(note)} |`);
    }
  }
  sections.push('');
}

const fileCount = [...byFile.keys()].filter(f => basename(f) !== 'dark.css').length;

/* ---------------------------------------------------------- component CSS API */

// A component's overridable properties are the ones it reads with a default:
//   padding: var(--psh-card-body-padding, var(--_psh-card-density-body-padding));
// Declaring them instead would put them in a specificity fight with the consumer, so the
// fallback *is* the default and this is the only place they are written down.
const API_USE = /var\(\s*(--psh-[a-z0-9-]+)\s*,/g;

/**
 * The fallback of a `var()`, from just after its comma to its own closing parenthesis.
 *
 * Counted, not matched: a default is usually another `var()`, and a pattern cannot pair
 * parentheses. The one this replaces stopped at the first `)` and wrote 70 of the 96 defaults
 * below as `var(--psh-spacing-sm`, without the parenthesis that closes it.
 */
function fallbackFrom(src, start) {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')') {
      if (depth === 0) return src.slice(start, i).replace(/\s+/g, ' ').trim();
      depth--;
    }
  }
  throw new Error(`Unclosed var() at offset ${start}`);
}

const globalNames = new Set([...byFile.values()].flat().map(r => r.token));

const componentApi = new Map(); // component -> Map(prop -> default)

for (const file of walk(COMPONENTS)) {
  const component = basename(file).replace('.component.css', '');
  // Comments quote rules (the card's density note does), and a quoted `var()` is not a read.
  const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of src.matchAll(API_USE)) {
    const [whole, prop] = m;
    // Global tokens are always defined and documented above. Internal carriers — the card's
    // densities, the alert's text size — take the private `--_psh-` prefix and never match.
    if (globalNames.has(prop)) continue;
    if (!componentApi.has(component)) componentApi.set(component, new Map());
    componentApi.get(component).set(prop, fallbackFrom(src, m.index + whole.length));
  }
}

const apiCount = [...componentApi.values()].reduce((n, m) => n + m.size, 0);

if (apiCount) {
  sections.push(
    '## Component CSS API',
    '',
    `${apiCount} properties across ${componentApi.size} components. Set any of them on the`,
    'component element to restyle it without reaching inside:',
    '',
    '```css',
    'psh-button { --psh-btn-min-width-md: 10rem; }',
    '```',
    '',
    'They are read with their default as the `var()` fallback rather than declared on',
    '`:host`. A declaration would outrank a plain `psh-button { … }` rule from a global',
    'stylesheet and quietly beat the override; a fallback has no specificity to fight.',
    '',
  );
  for (const [component, props] of [...componentApi].sort()) {
    sections.push(`### \`psh-${component}\``, '', '| Property | Default |', '|---|---|');
    for (const [prop, value] of [...props].sort()) {
      sections.push(`| \`${prop}\` | \`${esc(value)}\` |`);
    }
    sections.push('');
  }
}

const doc = [
  '# Token reference',
  '',
  '> **Generated from the stylesheets — do not edit by hand.**',
  '> Run `npm run docs:tokens` after changing anything under `src/lib/styles/`.',
  '',
  `**${total} tokens** across ${fileCount} files.`,
  '',
  'Every custom property the library exposes is namespaced `--psh-*`. The unprefixed names',
  'used before 7.0.0 remain available through the opt-in `styles/compat.css`.',
  '',
  ...sections,
].join('\n');

const missingInDark = [...light.keys()].filter(t => !dark.has(t));
const missingInLight = [...dark.keys()].filter(t => !light.has(t));

if (missingInDark.length || missingInLight.length) {
  console.error('✖ theme parity broken');
  if (missingInDark.length) console.error(`  light-only: ${missingInDark.join(', ')}`);
  if (missingInLight.length) console.error(`  dark-only:  ${missingInLight.join(', ')}`);
  process.exit(1);
}

/* -------------------------------------------------------------- reads of nothing */

// A `var()` with no fallback that names a property nothing declares is invalid at
// computed-value time: the declaration is dropped and the property falls back to its initial
// value, silently — no lint, build or test notices. That is how `radio-group` shipped
// `margin-left: var(--psh-spacing-2xs)` (the scale is `xxs` … `2xl`) and lost its margin.
//
// Read means a `var()` in a library stylesheet, and in the library's code too: a template's
// `style="…"`, a value a component hands to a binding (avatar's status colours), or an inline
// `styles: […]` should one appear. A name built at run time (`var(--psh-${color}-color)`) is
// skipped: it cannot be resolved here.
//
// Declared means a `--psh-x:` or `--_psh-x:` declaration in a library stylesheet, or a
// property the code sets at run time: a `[style.--psh-x]` binding (collapse, toast), a
// `'--psh-x': …` key of a `[style]` object (horizontal-card), a `setProperty('--psh-x', …)`
// (modal). compat.css is left out by `walk`: its aliases point at the public override
// properties, which components read with a fallback and nothing declares, by design.
const READ = /var\(\s*(--_?psh-[a-z0-9-]+)(?![\w$-])\s*(,)?/g;
const DECLARED = /(--_?psh-[a-z0-9-]+)\s*:/g;
const SET =
  /\[style\.(--_?psh-[a-z0-9-]+)\]|['"](--_?psh-[a-z0-9-]+)['"]\s*:|setProperty\(\s*['"`](--_?psh-[a-z0-9-]+)['"`]/g;

// Comments quote rules and names ("was `var(--psh-spacing-2xs)`"); a quoted read is not a read.
const uncommented = (file) =>
  readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\s*\/\/.*$/gm, '');

const declaredNames = new Set();
const unfallbacked = [];
const readsIn = (file, text) => {
  for (const [, name, fallback] of text.matchAll(READ)) {
    if (!fallback) unfallbacked.push({ file, name });
  }
};
for (const file of walk(LIB)) {
  const css = uncommented(file);
  for (const [, name] of css.matchAll(DECLARED)) declaredNames.add(name);
  readsIn(file, css);
}
for (const file of walk(LIB, (entry) => /\.(html|ts)$/.test(entry) && !entry.endsWith('.spec.ts'))) {
  const code = uncommented(file);
  for (const m of code.matchAll(SET)) declaredNames.add(m[1] ?? m[2] ?? m[3]);
  readsIn(file, code);
}

const dangling = unfallbacked.filter(({ name }) => !declaredNames.has(name));
if (dangling.length) {
  console.error('✖ the library reads a property that nothing declares, with no fallback:');
  for (const { file, name } of dangling) {
    console.error(`  ${name}  ${relative(ROOT, file).replace(/\\/g, '/')}`);
  }
  console.error('  The declaration is invalid and silently dropped. Fix the name, or give it a fallback.');
  process.exit(1);
}

if (CHECK) {
  // Normalised, because a Windows checkout with core.autocrlf=true holds the file in CRLF
  // while this script writes LF: without it the gate fails on a tree that is in fact clean.
  const current = existsSync(TARGET) ? readFileSync(TARGET, 'utf8').replace(/\r\n/g, '\n') : '';
  if (current !== doc) {
    console.error('✖ TOKENS.md is stale — run `npm run docs:tokens` and commit the result.');
    process.exit(1);
  }
  console.log(`✔ TOKENS.md up to date (${total} tokens, themes symmetrical)`);
} else {
  writeFileSync(TARGET, doc, 'utf8');
  console.log(`✔ TOKENS.md written — ${total} tokens, themes symmetrical`);
}
