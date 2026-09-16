/**
 * ps-helix 6.x → 7.0.0 template and stylesheet codemod.
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
 *
 * Stylesheets get the class namespace (`.card-body` → `.psh-card-body`), but only inside a
 * `::ng-deep` block — see migrateStylesheet for why the rest is reported rather than
 * rewritten.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

/**
 * The surface-treatment axis. `variant` carried three incompatible notions — elevation,
 * colour, display form — so it is retired as a catch-all: colour moved to `color`, surface
 * treatment to `appearance`, and `variant` survives only where the notion is genuinely
 * component-specific (tabs, stepper, menu, spinloader, tooltip), which is why those
 * selectors are absent here.
 *
 * Unlike the colour axis, the VALUES change too, so the CSS classes derived from them move.
 */
export const APPEARANCE_AXIS = {
  'psh-button': { appearance: 'appearance' },
  'psh-dropdown': { appearance: 'appearance' },
  'psh-input': { variant: 'appearance' },
  'psh-select': { variant: 'appearance' },
  'psh-textarea': { variant: 'appearance' },
  'psh-card': { variant: 'appearance' },
  'psh-horizontal-card': { variant: 'appearance' },
  'psh-info-card': { variant: 'appearance' },
  'psh-stat-card': { variant: 'appearance' },
  'psh-collapse': { variant: 'appearance' },
  'psh-pagination': { variant: 'appearance' },
  'psh-table': { variant: 'appearance' },
};

/** Value migrations, applied to the `appearance` attribute of each selector. */
const APPEARANCE_VALUES = {
  'psh-button': { filled: 'solid', text: 'ghost' },
  'psh-dropdown': { filled: 'solid', text: 'ghost' },
  'psh-input': { outlined: 'outline', filled: 'solid' },
  'psh-select': { outlined: 'outline', filled: 'solid' },
  'psh-textarea': { outlined: 'outline', filled: 'solid' },
  'psh-card': { default: 'flat', outlined: 'outline' },
  'psh-horizontal-card': { default: 'flat', outlined: 'outline' },
  'psh-info-card': { default: 'flat', outlined: 'outline' },
  'psh-stat-card': { default: 'flat', outlined: 'outline' },
  'psh-collapse': { default: 'flat' },
  'psh-pagination': { default: 'flat' },
  'psh-table': { default: 'flat' },
};

/**
 * The output axis. Six conventions coexisted — `xChange`, past participle, infinitive
 * (`toggle`, a single case, while collapse already said `toggled` for the same idea),
 * verb+noun (`rowClick`), a redundant prefix (`inputFocus` on an input), and one ad-hoc pair
 * (`shown`/`hidden` where everything else says `opened`/`closed`).
 *
 * R3 leaves one: `xChange` for two-way state, past participle for everything else.
 */
export const OUTPUT_AXIS = {
  'psh-badge': { badgeClick: 'clicked' },
  'psh-button': { disabledClick: 'disabledClicked' },
  'psh-input': {
    inputFocus: 'focused',
    inputBlur: 'blurred',
    suggestionSelect: 'suggestionSelected',
  },
  'psh-textarea': { inputFocus: 'focused', inputBlur: 'blurred' },
  'psh-menu': { itemClick: 'itemClicked', submenuToggle: 'submenuToggled' },
  'psh-sidebar': { toggle: 'toggled', transitionStart: 'transitionStarted' },
  'psh-select': { scrollEnd: 'scrolledToEnd' },
  'psh-table': {
    rowClick: 'rowClicked',
    rowExpand: 'rowExpanded',
    rowCollapse: 'rowCollapsed',
  },
  'psh-tooltip': { shown: 'opened', hidden: 'closed' },
};

/**
 * Inputs that were declared `model()` although the component never wrote them. Angular
 * derives an `xChange` output from every `model()`, so each of these published an event that
 * could not fire: `[(fullWidth)]` behaved exactly like `[fullWidth]`, and `(sizeChange)` was
 * a handler waiting forever.
 *
 * The codemod rewrites `[(x)]` to `[x]` — same behaviour, honest syntax — and reports any
 * `(xChange)` handler, which was dead code.
 */
export const DEMOTED_MODELS = {
  'psh-avatar': ['size', 'shape', 'src', 'alt'],
  'psh-button': ['fullWidth'],
  'psh-card': ['hoverable', 'interactive'],
  'psh-dropdown': ['disabled'],
  'psh-input': ['loading', 'readonly'],
  'psh-pagination': ['totalPages'],
  'psh-progressbar': ['value', 'max'],
  'psh-tab-bar': ['disabled', 'position', 'animated'],
  'psh-textarea': ['readonly'],
};

/**
 * Content-projection slots, now `psh-<component>-<zone>`.
 *
 * The prefix is not decoration: a slot is an **attribute selector**, which is exactly how
 * Angular selects directives. A consumer with their own `[card-footer]` directive had it
 * instantiated on everything they projected into that slot.
 *
 * Keyed by the element the slot is projected *into*, because `[card-actions]` belonged to two
 * different components and resolves to two different names.
 */
export const SLOT_RENAMES = {
  'psh-card': {
    'card-header-icon': 'psh-card-header-icon',
    'card-header-content': 'psh-card-header-content',
    'card-header-extra': 'psh-card-header-actions', // `extra` and `actions` were one zone
    'card-footer': 'psh-card-footer',
    'card-actions': 'psh-card-actions',
  },
  'psh-info-card': {
    'card-header-actions': 'psh-info-card-header-actions',
    'card-actions': 'psh-info-card-actions',
  },
  'psh-horizontal-card': {
    'horizontal-side': 'psh-horizontal-card-side',
    'horizontal-header': 'psh-horizontal-card-header',
    'horizontal-actions': 'psh-horizontal-card-actions',
  },
  'psh-collapse': { 'collapse-header': 'psh-collapse-header' },
  'psh-dropdown': {
    'dropdown-trigger': 'psh-dropdown-trigger',
    'dropdown-menu': 'psh-dropdown-menu',
  },
  'psh-input': {
    'input-label': 'psh-input-label',
    'input-error': 'psh-input-error',
    'input-success': 'psh-input-success',
    'input-hint': 'psh-input-hint',
  },
  'psh-textarea': {
    'textarea-label': 'psh-textarea-label',
    'textarea-error': 'psh-textarea-error',
    'textarea-success': 'psh-textarea-success',
    'textarea-hint': 'psh-textarea-hint',
  },
  'psh-modal': {
    'modal-title': 'psh-modal-title',
    'modal-footer': 'psh-modal-footer',
  },
};

/**
 * `cssClass` / `customStyle` are gone: the four card components are their own host now, so
 * the platform's `class` and `style` reach them. `styleClass` on modal becomes `panelClass` —
 * its panel is rendered away from the host, which is the one case a passthrough survives.
 */
export const REMOVED_PASSTHROUGH = {
  'psh-card': ['cssClass', 'customStyle'],
  'psh-horizontal-card': ['cssClass', 'customStyle'],
  'psh-info-card': ['cssClass', 'customStyle'],
  'psh-stat-card': ['cssClass', 'customStyle'],
};

/** Inputs that became `input.required()`. Reported when the tag does not bind them. */
export const NEWLY_REQUIRED = {
  'psh-table': ['columns', 'data'],
  'psh-menu': ['items'],
  'psh-select': ['options'],
  'psh-info-card': ['data'],
};

/** `styleClass` is the one passthrough that survives, under the name the contract gives it. */
const PANEL_CLASS = { 'psh-modal': { styleClass: 'panelClass' } };

const RENAMES = {};
for (const [selector, attrs] of Object.entries({ ...COLOR_AXIS })) {
  RENAMES[selector] = { ...attrs };
}
for (const [selector, attrs] of Object.entries(APPEARANCE_AXIS)) {
  RENAMES[selector] = { ...(RENAMES[selector] ?? {}), ...attrs };
}
for (const [selector, attrs] of Object.entries(PANEL_CLASS)) {
  RENAMES[selector] = { ...(RENAMES[selector] ?? {}), ...attrs };
}
// OUTPUT_AXIS deliberately stays out of RENAMES. `renameInTag` also rewrites the *input*
// forms — `x=`, `[x]=`, `[(x)]=` — and `psh-tooltip`'s output is called `hidden`, so folding
// it in would turn `<psh-tooltip [hidden]="…">`, the native HTML attribute, into
// `[closed]="…"`. Outputs get their own pass, which only ever touches `(x)=`.

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
/**
 * `info-card`'s row emphasis, the sixth and last name the colour axis had.
 *
 * It outlived the other five because it is not an attribute either: it sits in an
 * `InfoCardEmphasis` object inside a `data` array. The anchor is the `emphasis: { … }`
 * literal, not the word `tone` — plenty of applications have a `tone` of their own, and
 * renaming those would be the codemod damaging code it does not own.
 */
function migrateInfoCardTone(source) {
  return source.replace(/\bemphasis\s*:\s*\{[^{}]*\}/g, block =>
    block
      .replace(/(^|[\s,{])tone\s*:/g, '$1color:')
      // `muted` meant "no semantic emphasis", which is what `neutral` means everywhere else.
      .replace(/(\bcolor\s*:\s*)(['"`])muted\2/g, '$1$2neutral$2'),
  );
}

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
        //
        // Two guards, both load-bearing, both found by running this against real code:
        //
        //   (?<!\$)  without it, `${type}` inside a template literal matched — `{` before,
        //            `}` after — and became `${color: type}`, a syntax error.
        //
        //   [{,]     anchoring on a property position rather than any whitespace is what
        //            makes this idempotent. Matching plain whitespace re-fired on the
        //            already-migrated `color: type`, turning a second run into
        //            `color: color: type`. A codemod gets run twice.
        .replace(/((?<!\$)[{,]\s*)type(\s*[,}])/g, '$1color: type$2'),
  );
}

/* ------------------------------------------------------- the class namespace */

/**
 * Every component class the library now owns, without its prefix. Generated by
 * `npm run docs:classes` and kept in sync by `npm run verify:classes`, so the codemod and
 * the stylesheets cannot disagree.
 *
 * Utilities are deliberately absent: they have been `psh-` since 6.0.0, so a bare
 * `.gap-md` in an application stylesheet is the application's own class.
 */
const CLASS_MAP = new Set(
  JSON.parse(
    readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'class-map-7.0.0.json'), 'utf8'),
  ),
);

/** A `::ng-deep` / `:host ::ng-deep` selector, up to the block it opens. */
const NG_DEEP_SELECTOR = /(^|[};])([^{};]*::ng-deep[^{]*)\{/g;
/** A class token in a selector. Excludes `.5rem` and anything already namespaced. */
const CLASS_TOKEN = /\.(?!psh-)([a-z][a-z0-9_-]*)/g;

/**
 * Namespaces library classes in an application stylesheet.
 *
 * The line is drawn at `::ng-deep`, and it is the only line that can be drawn honestly.
 * `::ng-deep .card-body` is unambiguous: the selector exists to pierce into a child
 * component, so the class is the library's. A bare `.card-body` is exactly the collision
 * this release fixes — it may be the library's, or it may be the application's own, and
 * nothing in the file distinguishes them. Rewriting it would be the codemod guessing with
 * the consumer's markup.
 *
 * So: rewrite inside `::ng-deep`, report outside it.
 */
export function migrateStylesheet(source, warnings) {
  let count = 0;

  const out = source.replace(NG_DEEP_SELECTOR, (whole, head, selector) => {
    const next = selector.replace(CLASS_TOKEN, (token, name) =>
      CLASS_MAP.has(name) ? `.psh-${name}` : token,
    );
    if (next === selector) return whole;
    count++;
    return `${head}${next}{`;
  });

  // What is left: a library-looking class with no `::ng-deep` to vouch for it.
  const undecided = new Set();
  for (const [, , selector] of out.matchAll(/(^|[};])([^{};]*)\{/g)) {
    if (selector.includes('::ng-deep')) continue;
    for (const [, name] of selector.matchAll(CLASS_TOKEN)) {
      if (CLASS_MAP.has(name)) undecided.add(name);
    }
  }
  for (const name of [...undecided].sort()) {
    warnings.push(
      `.${name} is also a ps-helix class now named .psh-${name} — left as is: only you know whether this rule targets the design system or your own markup`,
    );
  }

  return { out, count };
}

/**
 * Outputs, two-way bindings on demoted models, and the required-input report.
 *
 * Kept apart from the input pass because the three edits it makes are each anchored on one
 * binding syntax and must not generalise:
 *   `(shown)="…"`      -> `(opened)="…"`     never `[hidden]` -> `[closed]`
 *   `[(fullWidth)]="x"` -> `[fullWidth]="x"`  same behaviour, honest syntax
 *   `(sizeChange)="…"`  -> reported           the handler could never have fired
 */
function migrateOutputsAndModels(source, warnings) {
  let out = source;
  let count = 0;

  const selectors = new Set([
    ...Object.keys(OUTPUT_AXIS),
    ...Object.keys(DEMOTED_MODELS),
    ...Object.keys(NEWLY_REQUIRED),
  ]);

  for (const selector of selectors) {
    out = out.replace(openingTag(selector), (tag, attrs = '') => {
      let next = tag;

      for (const [from, to] of Object.entries(OUTPUT_AXIS[selector] ?? {})) {
        next = next.replace(new RegExp(`(?<=\\s)\\(${from}\\)=`, 'g'), `(${to})=`);
      }

      for (const name of DEMOTED_MODELS[selector] ?? []) {
        // `[(x)]="sig"` unwraps a signal for you; `[x]="sig"` does not, so a bare identifier
        // that happens to hold a signal now needs `sig()`. Only the component's own source
        // says which — reported, never guessed. Guessing wrong here cost a round trip while
        // writing this codemod: a blanket `()` broke every plain-number binding instead.
        const twoWay = new RegExp(`(?<=\\s)\\[\\(${name}\\)\\]="([^"]*)"`, 'g');
        for (const [, expr] of next.matchAll(twoWay)) {
          if (/^[a-zA-Z_]\w*$/.test(expr.trim())) {
            warnings.push(
              `${selector} had [(${name})]="${expr.trim()}": the two-way form unwrapped a signal, the one-way form does not — add () if ${expr.trim()} is a signal`,
            );
          }
        }
        next = next.replace(new RegExp(`(?<=\\s)\\[\\(${name}\\)\\]=`, 'g'), `[${name}]=`);
        if (new RegExp(`\\s\\(${name}Change\\)=`).test(next)) {
          warnings.push(
            `${selector} has a (${name}Change) handler: ${name} is a plain input now, and that event never fired — delete the handler`,
          );
        }
      }

      for (const name of NEWLY_REQUIRED[selector] ?? []) {
        if (!new RegExp(`\\s\\[?${name}\\]?=`).test(attrs ?? '')) {
          warnings.push(
            `${selector} does not bind [${name}], which is required in 7.0.0 — pass [${name}]="[]" if the empty case is what you meant`,
          );
        }
      }

      if (next !== tag) count++;
      return next;
    });
  }

  return { out, count };
}

/**
 * Slots, and the passthrough inputs the host rooting replaced.
 *
 * Slots live on *projected children*, so this one needs the element's whole range — the
 * opening tag is not enough. Components of the same kind do not nest in practice, so a lazy
 * match from `<psh-card` to the first `</psh-card>` is the right span.
 */
function migrateSlotsAndPassthrough(source, warnings) {
  let out = source;
  let count = 0;

  for (const [selector, slots] of Object.entries(SLOT_RENAMES)) {
    const element = new RegExp(`<${selector}(?:\\s[^>]*)?>[\\s\\S]*?</${selector}>`, 'g');
    out = out.replace(element, block => {
      let next = block;
      for (const [from, to] of Object.entries(slots)) {
        // A bare attribute on a projected child: `<div card-footer>`.
        next = next.replace(
          new RegExp(`(?<=<[a-zA-Z][^<>]{0,300}\\s)${from}(?=[\\s>=])`, 'g'),
          () => { count++; return to; },
        );
      }
      return next;
    });
  }

  for (const [selector, names] of Object.entries(REMOVED_PASSTHROUGH)) {
    out = out.replace(openingTag(selector), (tag, attrs = '') => {
      let next = tag;
      const hasClass = /\s\[?class\]?=/.test(attrs ?? '');

      for (const name of names) {
        const target = name === 'cssClass' ? 'class' : 'style';
        const staticAttr = new RegExp(`\\s${name}="([^"]*)"`);
        const boundAttr = new RegExp(`\\s\\[${name}\\]="([^"]*)"`);

        if (!staticAttr.test(next) && !boundAttr.test(next)) continue;

        if (hasClass || /\s\[?style\]?=/.test(attrs ?? '')) {
          // Merging a passthrough into an attribute the caller already set is their call:
          // the result depends on which classes are meant to win.
          warnings.push(
            `${selector} has both ${name} and a native ${target}: ${name} is gone in 7.0.0 — merge it into ${target} yourself`,
          );
          continue;
        }

        next = next
          .replace(staticAttr, (m, value) => { count++; return ` ${target}="${value}"`; })
          .replace(boundAttr, (m, value) => { count++; return ` [${target}]="${value}"`; });
      }
      return next;
    });
  }

  return { out, count };
}

export function migrate(source) {
  let out = source;
  let count = 0;
  const warnings = [];

  for (const [selector, attrs] of Object.entries(RENAMES)) {
    out = out.replace(openingTag(selector), tag => {
      let next = tag;
      for (const [from, to] of Object.entries(attrs)) next = renameInTag(next, from, to);

      // Values are migrated after the attribute is in its final name, and only for a
      // string literal: a bound [appearance]="expr" is reported instead.
      const values = APPEARANCE_VALUES[selector];
      if (values) {
        for (const [from, to] of Object.entries(values)) {
          // Plain attribute: appearance="outlined"
          next = next.replace(new RegExp(`(?<=\\sappearance=")${from}(?=")`, 'g'), to);
          // Bound, but still a literal: [appearance]="'outlined'". Safe to rewrite — only
          // a computed expression genuinely cannot be resolved here.
          next = next.replace(
            new RegExp(`(?<=\\s\\[appearance\\]=")(')${from}(')(?=")`, 'g'),
            `$1${to}$2`,
          );
        }
        // Report only what is left: an expression whose value we cannot see.
        if (/\s\[appearance\]="[^"]*[^'"\s][^"]*"/.test(next) && !/\[appearance\]="'[a-z-]+'"/.test(next)) {
          warnings.push(`${selector} has a computed [appearance]: values changed (${Object.entries(values).map(([a, b]) => `${a}→${b}`).join(', ')})`);
        }
      }

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

  const afterTone = migrateInfoCardTone(out);
  if (afterTone !== out) count++;
  out = afterTone;

  const outputs = migrateOutputsAndModels(out, warnings);
  out = outputs.out;
  count += outputs.count;

  const slots = migrateSlotsAndPassthrough(out, warnings);
  out = slots.out;
  count += slots.count;

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
    // .css/.scss for the class namespace.
    else if (['.html', '.ts', '.md', '.css', '.scss'].includes(extname(entry))) out.push(p);
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
    const warnings = [];
    const result = ['.css', '.scss'].includes(extname(file))
      ? migrateStylesheet(before, warnings)
      : migrate(before);
    const { out, count } = result;
    if (result.warnings) warnings.push(...result.warnings);
    for (const w of warnings) console.warn(`  !   ${file.replace(/\\/g, '/')}: ${w}`);
    if (out === before) continue;
    if (!dry) writeFileSync(file, out, 'utf8');
    files++;
    tags += count;
    console.log(`${String(count).padStart(4)}  ${file.replace(/\\/g, '/')}`);
  }
  console.log(`\n${tags} elements updated across ${files} files${dry ? ' (dry run)' : ''}`);
}
