/**
 * ps-helix 6.x → 7.0.0 template codemod.
 *
 *   node scripts/codemod-7.0.0.mjs <dir> [--dry]
 *
 * Renames component inputs in Angular templates. The rename is per selector on purpose:
 * `variant` is a colour on psh-badge and a surface treatment on psh-card, so a blanket
 * find-and-replace would corrupt half the call sites. Nothing here is renamed globally.
 *
 * Handles the four binding forms Angular accepts on an element:
 *   variant="danger"            [variant]="x"            [(variant)]="x"     variantChange
 * and leaves everything else in the tag untouched.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

/* ------------------------------------------------------------------ rename map */

/**
 * The colour axis. Six different input names carried one notion — variant, type,
 * colorVariant, tagVariant, tone and color — so a developer wanting "red" had to remember
 * which component they were holding. All of them become `color`, with a single union.
 *
 * The values are unchanged, which is why this step touches no CSS class: `primary` stays
 * `primary`. The surface-treatment axis, where `filled` becomes `solid`, is a later step.
 */
export const COLOR_AXIS = {
  'psh-alert': { type: 'color' },
  'psh-badge': { variant: 'color' },
  'psh-button': { variant: 'color' },
  'psh-dropdown': { variant: 'color' },
  'psh-progressbar': { variant: 'color' },
  'psh-tag': { variant: 'color' },
  'psh-card': { colorVariant: 'color' },
  'psh-stat-card': { tagVariant: 'tagColor' },
};

const RENAMES = { ...COLOR_AXIS };

/* ---------------------------------------------------------------------- rewrite */

/** Matches one opening tag for `selector`, across newlines, without eating the next tag. */
const openingTag = selector => new RegExp(`<${selector}(\\s[^>]*?)?(/?)>`, 'gs');

/**
 * Renames `from` to `to` inside a single opening tag, covering every binding syntax.
 * Anchored on the attribute boundary so `variant` never matches inside `colorVariant`.
 */
function renameInTag(tag, from, to) {
  return tag
    .replace(new RegExp(`(?<=\\s)${from}=`, 'g'), `${to}=`)
    .replace(new RegExp(`(?<=\\s)\\[${from}\\]=`, 'g'), `[${to}]=`)
    .replace(new RegExp(`(?<=\\s)\\[\\(${from}\\)\\]=`, 'g'), `[(${to})]=`)
    .replace(new RegExp(`(?<=\\s)\\(${from}Change\\)=`, 'g'), `(${to}Change)=`);
}

/**
 * `disabled` was the seventh value of badge's colour union, so `variant="disabled"` meant
 * both "grey" and "not interactive". It is a boolean now, and the colour that used to come
 * with it is `neutral`. A literal is rewritten; a bound expression cannot be, and is
 * reported so it can be looked at by hand.
 */
function migrateBadgeDisabled(source, warnings) {
  let out = source.replace(openingTag('psh-badge'), tag => {
    if (/\s\[color\]=/.test(tag) && /disabled/.test(tag)) {
      warnings.push('psh-badge with a bound [color]: check for the removed "disabled" value');
    }
    // [disabled]="true", not a bare `disabled`: a valueless attribute is the empty string
    // in an Angular template, and the input is a boolean.
    return tag.replace(/(\s)color="disabled"/g, '$1color="neutral" [disabled]="true"');
  });
  return out;
}

/**
 * Toasts are raised through the service, so their colour lives in an options object rather
 * than an attribute — a template-only codemod would miss every call site.
 */
function migrateToastOptions(source) {
  // Bounded by the end of the statement rather than the first closing brace: option
  // objects routinely contain template literals and nested objects, and stopping at `}`
  // silently missed every call site that had one.
  return source.replace(
    /\btoast(?:Service)?\s*\.\s*[a-zA-Z]+\s*\(\s*\{[^;]*?\}\s*\)/gs,
    call =>
      call
        .replace(/(^|[\s,{])type\s*:/g, '$1color:')
        // Shorthand: `show({ message, type, icon })`. The local name is kept, only the
        // property it fills is renamed.
        .replace(/(^|[\s,{])type(\s*[,}])/g, '$1color: type$2'),
  );
}

export function migrate(source) {
  let out = source;
  let count = 0;
  const warnings = [];

  for (const [selector, attrs] of Object.entries(RENAMES)) {
    out = out.replace(openingTag(selector), tag => {
      let next = tag;
      for (const [from, to] of Object.entries(attrs)) next = renameInTag(next, from, to);
      if (next !== tag) count++;
      return next;
    });
  }

  const afterBadge = migrateBadgeDisabled(out, warnings);
  if (afterBadge !== out) count++;
  out = afterBadge;

  const afterToast = migrateToastOptions(out);
  if (afterToast !== out) count++;
  out = afterToast;

  return { out, count, warnings };
}

/* ------------------------------------------------------------------------- cli */

const SKIP = new Set(['node_modules', 'dist', '.git', '.angular']);
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    // .ts too: inline templates and documentation snippets live there.
    else if (['.html', '.ts', '.md'].includes(extname(entry))) out.push(p);
  }
  return out;
}

if (process.argv[1]?.endsWith('codemod-7.0.0.mjs')) {
  const dir = process.argv[2];
  const dry = process.argv.includes('--dry');
  if (!dir) {
    console.error('usage: node scripts/codemod-7.0.0.mjs <dir> [--dry]');
    process.exit(1);
  }

  let files = 0;
  let tags = 0;
  for (const file of walk(dir)) {
    const before = readFileSync(file, 'utf8');
    const { out, count, warnings } = migrate(before);
    for (const w of warnings) console.warn(`  !   ${file.replace(/\\/g, '/')}: ${w}`);
    if (out === before) continue;
    if (!dry) writeFileSync(file, out, 'utf8');
    files++;
    tags += count;
    console.log(`${String(count).padStart(4)}  ${file.replace(/\\/g, '/')}`);
  }
  console.log(`\n${tags} elements updated across ${files} files${dry ? ' (dry run)' : ''}`);
}
