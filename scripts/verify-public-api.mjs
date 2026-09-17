/**
 * Fails when something the library exports never reaches the published entry point.
 *
 * `psh-radio-group` was built in 7.0.0 to carry the form contract that `psh-radio` could not,
 * and it shipped **unreachable**: it was listed in `lib/components/index.ts`, a barrel the
 * demo imports through a path alias and `public-api.ts` does not use. 2 299 tests passed, the
 * demo compiled, and no application could have imported the component.
 *
 * The check reads the generated `.d.ts` rather than the source, because that file *is* the
 * contract: what is not declared there does not exist for a consumer, whatever the sources say.
 *
 * Usage (after `npm run build:lib`):
 *   node scripts/verify-public-api.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'projects/ps-helix/src/lib');
const TYPES = join(ROOT, 'dist/ps-helix/types/ps-helix.d.ts');

if (!existsSync(TYPES)) {
  console.error('✖ dist/ps-helix/types/ps-helix.d.ts is missing — run npm run build:lib first');
  process.exit(1);
}

const published = readFileSync(TYPES, 'utf8');

/** What a consumer must be able to import, and why it would be useless if they could not. */
const RULES = [
  {
    what: 'component',
    re: /^export class (Psh\w+Component)\b/gm,
    why: 'a standalone component must be imported by name to be used in a template',
  },
  {
    what: 'directive',
    re: /^export class (Psh\w+Directive)\b/gm,
    why: 'same as a component: unreachable means unusable',
  },
  {
    what: 'service',
    re: /^export class (Psh\w+Service)\b/gm,
    why: 'a service that cannot be injected by name is documentation only',
  },
  {
    what: 'config token',
    re: /^export const (\w+_CONFIG)\b/gm,
    why: 'a default an application cannot provide is not a default, it is a constant',
  },
  {
    what: 'provider function',
    re: /^export function (provide\w+)\b/gm,
    why: 'the whole point of a provider function is to be called from a consumer',
  },
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.ts') && !p.endsWith('.spec.ts')) out.push(p);
  }
  return out;
}

const missing = [];
let checked = 0;

for (const file of walk(LIB)) {
  const src = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file).replace(/\\/g, '/');

  for (const { what, re, why } of RULES) {
    re.lastIndex = 0;
    for (const [, name] of src.matchAll(re)) {
      checked++;
      // A declaration in the .d.ts, not a mention inside someone else's signature.
      const declared = new RegExp(
        `declare (?:class|const|function|abstract class) ${name}\\b`,
      ).test(published);
      if (!declared) missing.push({ name, what, why, rel });
    }
  }
}

if (missing.length > 0) {
  console.error(`✖ ${missing.length} exported symbols never reach the published entry point:`);
  for (const { name, what, why, rel } of missing) {
    console.error(`    ${name}  (${what}, ${rel})`);
    console.error(`      ${why}`);
  }
  console.error('\n  Add it to projects/ps-helix/src/public-api.ts.');
  process.exit(1);
}

console.log(`✔ ${checked} exported symbols, all reachable from the published entry point`);
