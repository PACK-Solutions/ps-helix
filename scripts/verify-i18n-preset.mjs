/**
 * Fails when a translatable default exists and the French preset does not carry it.
 *
 * `PSH_FRENCH_DEFAULTS` only earns its place if it is complete. A preset that has fallen one
 * string behind is worse than none: the application looks translated, and one label in the
 * middle of a page is in English — the exact state 6.2.4 was in, with twenty-five French
 * strings and thirty English ones decided component by component.
 *
 * Translatable is not a judgement call here. A prose default is declared
 * `PshConfigValue<string>` on its config interface, and an enum default is not, so the type is
 * the list. Nested label objects (`stepper.ariaLabels`, `alert.labels`) are named explicitly
 * below, because their fields are typed by their own interface.
 *
 * Usage: node scripts/verify-i18n-preset.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = join(ROOT, 'projects/ps-helix/src/lib/components');
const PRESET = join(ROOT, 'projects/ps-helix/src/lib/i18n/french.ts');
const PROVIDE = join(ROOT, 'projects/ps-helix/src/lib/provide-helix.ts');

/** Label objects whose fields are typed by their own interface rather than PshConfigValue. */
const NESTED = {
  alert: ['labels'],
  stepper: ['ariaLabels'],
  stateFlowIndicator: ['ariaLabels'],
};

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (entry.endsWith('.types.ts')) out.push(p);
  }
  return out;
}

/** Balanced `{…}` starting at the first brace after `from`. */
function block(src, from) {
  const open = src.indexOf('{', from);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  throw new Error('unbalanced');
}

// The component key an application writes, per config interface, read from the map that
// already ties the two together.
const provideSrc = readFileSync(PROVIDE, 'utf8');
const interfaceByKey = new Map(
  [...provideSrc.matchAll(/^ {2}(\w+)\?: Partial<(\w+)>;$/gm)].map(m => [m[1], m[2]]),
);
const keyByInterface = new Map([...interfaceByKey].map(([key, iface]) => [iface, key]));

/** component key -> the prose fields it declares */
const expected = new Map();

for (const file of walk(COMPONENTS)) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/export interface (\w+) \{/g)) {
    const iface = m[1];
    const body = block(src, m.index);
    const fields = [...body.matchAll(/^ {2}(\w+)\??: PshConfigValue<string>;$/gm)].map(f => f[1]);
    if (fields.length === 0) continue;

    // AlertLabels and friends belong to the component whose config points at them.
    const key = keyByInterface.get(iface) ?? keyByInterface.get(iface.replace(/Labels$/, 'Config'));
    if (!key) {
      console.error(`✖ ${iface} declares prose fields but no component key maps to it`);
      process.exit(1);
    }
    expected.set(key, [...(expected.get(key) ?? []), ...fields]);
  }
}

const preset = readFileSync(PRESET, 'utf8');
const missing = [];
let checked = 0;

for (const [key, fields] of [...expected].sort()) {
  const at = preset.indexOf(`\n  ${key}: {`);
  if (at === -1) {
    missing.push(`${key}: the whole component is absent from the preset`);
    continue;
  }
  const body = block(preset, at);
  for (const field of fields) {
    checked++;
    if (!new RegExp(`\\b${field}:`).test(body)) missing.push(`${key}.${field}`);
  }
  for (const nested of NESTED[key] ?? []) {
    checked++;
    if (!new RegExp(`\\b${nested}:`).test(body)) missing.push(`${key}.${nested}`);
  }
}

if (missing.length > 0) {
  console.error(`✖ ${missing.length} translatable defaults are missing from PSH_FRENCH_DEFAULTS:`);
  for (const m of missing) console.error(`    ${m}`);
  console.error('\n  Add them to projects/ps-helix/src/lib/i18n/french.ts.');
  process.exit(1);
}

console.log(`✔ ${checked} translatable defaults, all present in the French preset`);
