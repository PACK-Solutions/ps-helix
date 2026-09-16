/**
 * Generates projects/ps-helix/CONFIGURATION.md from the config tokens themselves.
 *
 * The same reasoning as TOKENS.md: a list of defaults written by hand is a list of defaults
 * that drifts. Four of these tokens shipped a key nothing read because a rename reached the
 * interface and not the default object — a document maintained separately would have been
 * wrong in a third place.
 *
 *   node scripts/generate-config-reference.mjs          # write
 *   node scripts/generate-config-reference.mjs --check  # fail if stale (CI)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = join(ROOT, 'projects/ps-helix/src/lib/components');
const PROVIDE = join(ROOT, 'projects/ps-helix/src/lib/provide-helix.ts');
const TARGET = join(ROOT, 'projects/ps-helix/CONFIGURATION.md');
const CHECK = process.argv.includes('--check');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(component|tokens)\.ts$/.test(entry) && !entry.includes('.spec.')) out.push(p);
  }
  return out;
}

/** Balanced `{…}` starting at the first brace after `from`. */
function brace(src, from) {
  const open = src.indexOf('{', from);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  throw new Error('unbalanced braces');
}

/** `key: value` pairs at the top level of an object literal body. */
function topLevelEntries(body) {
  const entries = [];
  let depth = 0;
  let buffer = '';
  for (const char of body) {
    if ('{[('.includes(char)) depth++;
    else if ('}])'.includes(char)) depth--;
    if (char === ',' && depth === 0) {
      entries.push(buffer);
      buffer = '';
    } else {
      buffer += char;
    }
  }
  entries.push(buffer);

  return entries
    .map(entry => entry.replace(/\/\/[^\n]*/g, '').trim())
    .filter(Boolean)
    .map(entry => {
      const at = entry.indexOf(':');
      return [entry.slice(0, at).trim(), entry.slice(at + 1).trim().replace(/\s+/g, ' ')];
    })
    .filter(([key]) => /^[a-zA-Z_$][\w$]*$/.test(key));
}

// The key an application writes under `components:` — read from the map that already exists,
// so the document cannot name a key `provideHelix` would reject.
const provideSrc = readFileSync(PROVIDE, 'utf8');
const mapBody = brace(provideSrc, provideSrc.indexOf('const TOKEN_BY_KEY'));
const keyByToken = new Map(
  topLevelEntries(mapBody).map(([key, token]) => [token.replace(/,$/, ''), key]),
);

const DECL = /const (\w+)_DEFAULTS = \{/;
// Greedy to the last `>` before the call: `Partial<AlertConfig>` carries a nested one.
const TOKEN = /export const (\w+_CONFIG) = new InjectionToken<(.+)>\(/;

const sections = [];
let tokenCount = 0;
let keyCount = 0;

for (const file of walk(COMPONENTS).sort()) {
  const src = readFileSync(file, 'utf8');
  const token = src.match(TOKEN);
  const decl = src.match(DECL);
  if (!token || !decl) continue;

  const [, tokenName, typeArg] = token;
  const key = keyByToken.get(tokenName);
  if (!key) throw new Error(`${tokenName} is not in TOKEN_BY_KEY — provideHelix cannot set it`);

  const entries = topLevelEntries(brace(src, decl.index));
  tokenCount++;
  keyCount += entries.length;

  // Relative to CONFIGURATION.md, which sits in projects/ps-helix/.
  const rel = relative(join(ROOT, 'projects/ps-helix'), file).replace(/\\/g, '/');
  sections.push(
    `### \`${key}\``,
    '',
    `\`${tokenName}\` · \`${typeArg}\` · [${rel.split('/').pop()}](${rel})`,
    '',
    '| Key | Default |',
    '|---|---|',
    ...entries.map(([k, v]) => `| \`${k}\` | \`${v.replace(/\|/g, '\\|')}\` |`),
    '',
  );
}

const doc = `# Configuration

> **Generated from the config tokens — do not edit by hand.**
> Run \`npm run docs:config\` after changing a token's defaults.

Every component reads its defaults from an \`InjectionToken\`, so an application can set them
once instead of repeating an attribute on every instance.

\`\`\`typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHelix } from 'ps-helix';

bootstrapApplication(App, {
  providers: [
    provideHelix({
      theme: { targetContrast: 'AAA', customerContext: BrandService },
      components: {
        button: { size: 'large', appearance: 'outline' },
        modal: { dismissLabel: 'Fermer', confirmLabel: 'Valider', cancelLabel: 'Annuler' },
        toast: { position: 'bottom-right', duration: 3000 },
      },
    }),
  ],
});
\`\`\`

**A partial override stays partial.** Each component reads
\`this.config.<key> ?? <its own literal>\`, so \`{ button: { size: 'large' } }\` leaves the
button's colour and appearance where they were.

**An input always wins over the configuration.** The config sets the *default* of the input;
writing the attribute on an element overrides it for that element.

Three narrower functions exist for an application that wants one part of it —
\`provideHelixTheme\`, \`provideHelixComponentDefaults\` and \`provideHelixToast\`. Mixing them
with \`provideHelix\` is harmless: the later provider wins, as anywhere else in Angular.

Each token is also exported by name, for the cases a single component needs a different
default in one part of the application:

\`\`\`typescript
import { BUTTON_CONFIG } from 'ps-helix';

@Component({ providers: [{ provide: BUTTON_CONFIG, useValue: { size: 'small' } }] })
\`\`\`

**${tokenCount} tokens, ${keyCount} settable defaults.**

---

${sections.join('\n')}`;

if (CHECK) {
  const current = existsSync(TARGET)
    ? readFileSync(TARGET, 'utf8').replace(/\r\n/g, '\n')
    : '';
  if (current !== doc) {
    console.error('✖ CONFIGURATION.md is stale — run `npm run docs:config` and commit the result.');
    process.exit(1);
  }
  console.log(`✔ CONFIGURATION.md up to date (${tokenCount} tokens, ${keyCount} defaults)`);
} else {
  writeFileSync(TARGET, doc, 'utf8');
  console.log(`✔ CONFIGURATION.md written — ${tokenCount} tokens, ${keyCount} defaults`);
}
