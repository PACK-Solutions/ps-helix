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
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STYLES = join(ROOT, 'projects/ps-helix/src/lib/styles');
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

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    // compat.css is generated aliases, not tokens in its own right.
    else if (extname(entry) === '.css' && basename(entry) !== 'compat.css') out.push(p);
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

if (CHECK) {
  const current = existsSync(TARGET) ? readFileSync(TARGET, 'utf8') : '';
  if (current !== doc) {
    console.error('✖ TOKENS.md is stale — run `npm run docs:tokens` and commit the result.');
    process.exit(1);
  }
  console.log(`✔ TOKENS.md up to date (${total} tokens, themes symmetrical)`);
} else {
  writeFileSync(TARGET, doc, 'utf8');
  console.log(`✔ TOKENS.md written — ${total} tokens, themes symmetrical`);
}
