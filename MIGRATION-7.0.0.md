# Migrating to ps-helix 7.0.0

7.0.0 is a breaking release. It renames the CSS custom properties, changes how components
are styled from outside, and unifies the component API vocabulary.

Most of it is automated. Run the two codemods, then read the short list of things a script
cannot decide for you.

```bash
# 1. Component inputs in templates and TypeScript, and CSS classes inside ::ng-deep
node node_modules/ps-helix/scripts/codemod-7.0.0.mjs src

# 2. CSS custom properties — or skip it and import the compatibility layer instead
@import 'ps-helix/src/lib/styles/compat.css';
```

The codemod prints a `!` line for everything it deliberately left alone. Read those before
anything else: they are the cases where only you know the answer.

---

## 1. Stylesheet entry point

`styles.css` no longer ships a CSS reset or page-level styling. Importing a component
library used to zero every margin and padding in your application, strip your list markers
and paint a gradient on your `<body>`.

| You had | Now |
|---|---|
| `@import 'ps-helix/styles.css';` and your own reset | nothing to change |
| `@import 'ps-helix/styles.css';` and no reset of your own | `@import 'ps-helix/styles-full.css';` |

The accessibility guarantees (forced-colors focus fallback, reduced-motion guard) and the
modal scroll lock ship with `styles.css` either way. They are not opinions you can decline.

## 2. CSS custom properties

All 486 are namespaced `--psh-*`. The names ps-helix used before — `--primary-color`,
`--surface-card`, `--spacing-md`, `--border-radius` — are the names Bootstrap, PrimeNG and
most applications use for their own tokens, so importing ps-helix silently fought with the
host's design system.

**Fastest path:** import the compatibility layer and move on.

```css
@import 'ps-helix/styles.css';
@import 'ps-helix/src/lib/styles/compat.css';   /* delete once migrated */
```

**Doing it properly:** rename `--x` to `--psh-x` in your stylesheets, with two exceptions
where the merge is by value, not by name:

| Before | After | Why |
|---|---|---|
| `--border-radius` | `--psh-radius-lg` | It was an alias for `--radius-lg` (8px), **not** the equivalent of `--radius-base` (4px). Renaming by name would halve every corner. |
| `--border-radius-lg` | `--psh-radius-xl` | Same shifted alias layer. |
| `--btn-height-*`, `--height-input-*` | `--psh-control-height-*` | One token now, so a button and an input line up by contract rather than by coincidence. |

Your brand hooks need no change at all: both themes read `--psh-customer-primary-color`
first and fall back to `--customer-primary-color`.

The full list of 398 tokens, with light and dark values, is in
[`TOKENS.md`](./projects/ps-helix/TOKENS.md).

## 3. Component inputs — the colour axis

One notion was spelled six ways. `color` is now the only name, and
[`PshColor`](./projects/ps-helix/src/lib/types/semantic.types.ts) the only union:
`primary | secondary | success | warning | danger | info | neutral`.

| Component | Before | After |
|---|---|---|
| `psh-alert` | `type="info"` | `color="info"` |
| `psh-badge` | `variant="danger"` | `color="danger"` |
| `psh-button` | `variant="primary"` | `color="primary"` |
| `psh-dropdown` | `variant="primary"` | `color="primary"` |
| `psh-progressbar` | `variant="success"` | `color="success"` |
| `psh-tag` | `variant="warning"` | `color="warning"` |
| `psh-card` | `colorVariant="info"` | `color="info"` |
| `psh-stat-card` | `tagVariant="success"` | `tagColor="success"` |
| `ToastService.show()` | `{ type: 'info' }` | `{ color: 'info' }` |

**Values are unchanged** — `primary` is still `primary` — so no CSS class you may have
targeted moves in this step.

Two values did change:

- `psh-card`: `colorVariant="default"` → `color="neutral"`. `neutral` replaces the assorted
  `default` and `muted` values that meant "no semantic emphasis".
- `psh-badge`: `variant="disabled"` → `color="neutral" [disabled]="true"`. Disabled is a
  state, not a colour: as a colour value it meant a disabled badge could not also be a
  danger badge, and it was the only place in the library where `disabled` was not a
  boolean.

The codemod handles all of the above, including shorthand properties in toast options
(`show({ message, type, icon })`).

### What the codemod cannot do

It reports these rather than guessing:

- **A bound colour on `psh-badge`** — `[color]="expr"` where `expr` may produce the removed
  `'disabled'` value. Check the expression.
- **Your own `Record<ToastType, …>` maps.** The union has seven members now, so an
  exhaustive record keyed by the old four no longer type-checks. Either widen it or make it
  `Partial<Record<…>>`.
- **Per-component type aliases** (`ButtonVariant`, `BadgeVariant`, `ToastType`, …). They
  still compile — each is now a deprecated alias of `PshColor` — but new code should import
  `PshColor` directly.

### Colours a component does not render yet

`psh-button` and `psh-dropdown` accept five of the seven. Their colour matrix is crossed
with their three appearances and guarded by `:not()` chains that the appearance rework
replaces; extending it now would mean writing into a structure that is about to change.
They are typed as `Exclude<PshColor, 'info' | 'neutral'>` rather than accepting a value
that would silently fall through to the default styling.

## 4. Component inputs — the surface-treatment axis

`variant` carried three incompatible notions at once: elevation on card and table, colour
on badge and button, display form on tabs and stepper. Colour became `color` (above);
surface treatment is now `appearance`, with one vocabulary:

| Before | After |
|---|---|
| `filled` | `solid` |
| `outlined` | `outline` |
| `text` | `ghost` |
| `default` | `flat` |
| `elevated` | `elevated` *(unchanged)* |
| `outline` | `outline` *(unchanged)* |

| Component | Before | After |
|---|---|---|
| `psh-button`, `psh-dropdown` | `appearance="filled"` | `appearance="solid"` |
| `psh-input`, `psh-select`, `psh-textarea` | `variant="outlined"` | `appearance="outline"` |
| `psh-card`, `psh-horizontal-card`, `psh-info-card`, `psh-stat-card` | `variant="default"` | `appearance="flat"` |
| `psh-collapse`, `psh-pagination`, `psh-table` | `variant="default"` | `appearance="flat"` |

**`variant` still exists** — but only where the notion is genuinely component-specific and
is neither colour nor surface: `psh-tabs` (`underline | pills`), `psh-stepper`
(`numbered | progress`), `psh-menu` (`compact | expanded`), `psh-spinloader`
(`circle | dots | pulse`), `psh-tooltip` (`light | dark`). Those are unchanged.

### If you targeted the classes

The values change, so the classes derived from them change too — `filled` → `solid`,
`text` → `ghost`, `outlined` → `outline`, `variant-*` → `appearance-*` — and then §5
namespaces the result. End to end: `.filled` → `.psh-solid`, `.variant-default` →
`.psh-appearance-flat`.

### What the codemod cannot do

`[appearance]="'outlined'"` — a bound literal — **is** rewritten. A computed expression
such as `[appearance]="isActive ? 'filled' : 'outline'"` is not: the codemod reports each
one by file so you can go through them.

## 5. Every component class is now `psh-`

The 361 classes the components render are namespaced: `.card-body` → `.psh-card-body`,
`.stat-value` → `.psh-stat-value`, `.hoverable` → `.psh-hoverable`.

This is not cosmetic. Four components — `psh-card`, `psh-horizontal-card`, `psh-info-card`,
`psh-stat-card` — render with `ViewEncapsulation.None`, which they need in order to style
projected content (`.psh-card-body img`, `.psh-card-actions > *`): projected content carries
the *parent's* encapsulation attribute, so an emulated component cannot reach it. The cost
was that every class they declared was global, and five of them — `.card`, `.card-header`,
`.card-body`, `.card-footer`, `.card-title` — are Bootstrap's, verbatim. Any application
with its own `.card-body` was being restyled by a card it never rendered.

This repository had the bug. The pagination demo page has its own `.stat-card` /
`.stat-value` markup, and the library's stat-card was styling it.

### What the codemod does, and where it stops

**Inside `::ng-deep`, it rewrites.** `::ng-deep .card-body` exists to pierce into a child
component, so the class is unambiguously the library's.

```css
/* before */  :host ::ng-deep .card-body img { border-radius: 0; }
/* after  */  :host ::ng-deep .psh-card-body img { border-radius: 0; }
```

**Outside `::ng-deep`, it reports and leaves the rule alone.** A bare `.card-body` is the
collision itself: it may be the library's class or your own, and nothing in the file says
which. The codemod prints one line per name and lets you decide — rewriting it would be a
script guessing about your markup.

```
!  src/app/stats.component.css: .stat-card is also a ps-helix class now named
   .psh-stat-card — left as is: only you know whether this rule targets the design
   system or your own markup
```

In most cases the answer is *your own markup*, and the correct action is to change nothing:
the rename is what stops the library from interfering with it.

There is no compatibility layer for classes. An alias would reintroduce the global names
that are the entire problem.

## 6. Outputs, phantom two-way bindings, and the error contract

### 6.1 One convention for outputs

Six coexisted: `xChange`, past participle, one infinitive, verb+noun, a redundant prefix, and
one ad-hoc pair. Two survive — **`xChange` for two-way state, past participle for everything
else** — and the codemod applies every rename below.

| Component | Before | After |
|---|---|---|
| `psh-badge` | `(badgeClick)` | `(clicked)` |
| `psh-button` | `(disabledClick)` | `(disabledClicked)` |
| `psh-input` | `(inputFocus)` / `(inputBlur)` | `(focused)` / `(blurred)` |
| `psh-input` | `(suggestionSelect)` | `(suggestionSelected)` |
| `psh-textarea` | `(inputFocus)` / `(inputBlur)` | `(focused)` / `(blurred)` |
| `psh-menu` | `(itemClick)` / `(submenuToggle)` | `(itemClicked)` / `(submenuToggled)` |
| `psh-sidebar` | `(toggle)` / `(transitionStart)` | `(toggled)` / `(transitionStarted)` |
| `psh-select` | `(scrollEnd)` | `(scrolledToEnd)` |
| `psh-table` | `(rowClick)` / `(rowExpand)` / `(rowCollapse)` | `(rowClicked)` / `(rowExpanded)` / `(rowCollapsed)` |
| `psh-tooltip` | `(shown)` / `(hidden)` | `(opened)` / `(closed)` |

`psh-sidebar`'s `toggle` was the library's only infinitive — and a native event name, which
needed a standing eslint exemption to exist. `psh-collapse` already said `toggled` for the
same idea.

Two knock-on renames, because the output took a name that was already taken:

- **`psh-input.focused` and `psh-textarea.focused` were boolean state signals.** They are now
  `isFocused`. The name reads as an event, and now it is one; the readout says it is a
  readout.
- **`psh-badge.valueChange` is gone.** It was never emitted — the badge has no way to change
  its own value — so `[(value)]` on a badge type-checked and did nothing. `BADGE.md` still
  described it as *« Émis lors d'un changement de valeur »*.

### 6.2 `navigationError` has one payload

Same output name, two incompatible payloads: `{ action, reason }` on `psh-pagination`, a bare
English `string` on `psh-stepper` and `psh-state-flow-indicator`. Both are now
[`PshNavigationError`](./projects/ps-helix/src/lib/types/semantic.types.ts):

```ts
{
  action: 'goToPage' | 'goToStep';
  reason: 'out-of-bounds' | 'blocked' | 'rejected' | 'prerequisite-incomplete';
  target: number;
  message: string;   // English, for logs — not a user-facing string
  cause?: unknown;    // for 'rejected', whatever the guard threw
}
```

If you were branching on the message — `if (e.includes('out of bounds'))` — branch on
`reason` instead. That is what it is for; the sentence was never a contract.

### 6.3 Seventeen `model()` that were never written

Angular derives an `xChange` output from every `model()`. Seventeen inputs across nine
components were declared `model()` although the component never writes them, so each
published an event that could not fire: `[(fullWidth)]` on a button behaved exactly like
`[fullWidth]`, and `(sizeChange)` on an avatar was a handler waiting forever.

`psh-avatar` (`size`, `shape`, `src`, `alt`) · `psh-button` (`fullWidth`) · `psh-card`
(`hoverable`, `interactive`) · `psh-dropdown` (`disabled`) · `psh-input` (`loading`,
`readonly`) · `psh-pagination` (`totalPages`) · `psh-progressbar` (`value`, `max`) ·
`psh-tab-bar` (`disabled`, `position`, `animated`) · `psh-textarea` (`readonly`).

The codemod rewrites `[(x)]` to `[x]` and reports any `(xChange)` handler, which was dead
code either way.

> **One thing it cannot do for you.** `[(x)]="sig"` unwraps a signal; `[x]="sig"` does not. If
> the expression was a bare identifier holding a signal, it now needs `sig()`. Only your
> component says which, so the codemod prints the line and leaves it. This repository's own
> demo hit it in eleven places.

`disabled` on `psh-checkbox`, `psh-input`, `psh-select` and `psh-switch` stays a `model()`:
`ControlValueAccessor.setDisabledState()` genuinely writes it. `readonly` does not — Signal
Forms declares it `InputSignal<boolean>` and only ever pushes it down.

### 6.4 One error contract

`error` / `success` / `hint` are `string | null | undefined` on every input component, and
`hint` now exists on all of them.

| | Before | After |
|---|---|---|
| `psh-switch`, `psh-radio` | `error`/`success` were `string`, defaulting to `''` | `string \| null \| undefined`, defaulting to `null` |
| `psh-checkbox`, `psh-switch`, `psh-radio` | no `hint` | `hint`, rendered when there is no error or success |
| `psh-step`, `psh-flow-step` | `error`/`success`/`warning` were `string \| undefined` | `string \| null \| undefined`, in the config interfaces too |

Nothing to change unless you relied on `error()` being `''` rather than `null` — a helper
returning `string | null`, which used to fail to type-check on switch and radio, now works
everywhere.

### 6.5 `input.required()` where the data is not optional

Required now: **`psh-table.columns`**, **`psh-table.data`**, **`psh-menu.items`**,
**`psh-select.options`**, **`psh-info-card.data`**. An empty array is a meaningful state that
the empty-state message exists to render; *no binding at all* is an unfinished call site.
`[data]="[]"` costs two characters and says which one you meant.

**`psh-tooltip.content` is now optional** — required blocked the conditional tooltip, which is
the common case.

Three inputs the audit proposed making required were left alone, each for a concrete reason:

- **`psh-tabs.tabs`** — tabs also accept projected `<psh-tab>` children, and the component
  prefers them over the input. Required would have broken the projection API outright.
- **`psh-dropdown.items`** — `<ng-content select="[dropdown-menu]">` replaces the item list
  entirely; the `items` rendering is that slot's fallback content.
- **`psh-stat-card.value`** — the component has a `loading` state, so "no value yet" is a
  state it is built to render.

## 7. Slots, and the end of `cssClass`

### 7.1 One scheme for slots: `psh-<component>-<zone>`

```html
<!-- before -->                          <!-- after -->
<div card-header-extra>…</div>           <div psh-card-header-actions>…</div>
<div card-actions>…</div>                <div psh-card-actions>…</div>
<img horizontal-side src="…" />          <img psh-horizontal-card-side src="…" />
<span modal-title>…</span>               <span psh-modal-title>…</span>
```

Three things were wrong, all in the card family. `info-card` projected into `[card-actions]`
and `[card-header-actions]` — the *card* prefix, on a different component.
`horizontal-card` used `[horizontal-*]`, a prefix that names nothing. And `card` called the
end-of-header slot `extra` while `info-card` called the same zone `actions`, with card's own
comment describing it as *« badge/tag ou actions secondaires »*.

**The `psh-` prefix is not decoration.** A slot is an attribute selector, and that is exactly
how Angular selects directives: if you had a `[card-footer]` directive of your own, it was
being instantiated on everything you projected into that slot.

`[card-actions]` resolves to two different names, so the codemod rewrites it per enclosing
element: `psh-card-actions` inside `<psh-card>`, `psh-info-card-actions` inside
`<psh-info-card>`.

| Component | Slots |
|---|---|
| `psh-card` | `psh-card-header-icon`, `psh-card-header-content`, `psh-card-header-actions`, `psh-card-footer`, `psh-card-actions` |
| `psh-info-card` | `psh-info-card-header-actions`, `psh-info-card-actions` |
| `psh-horizontal-card` | `psh-horizontal-card-side`, `psh-horizontal-card-header`, `psh-horizontal-card-actions` |
| `psh-collapse` | `psh-collapse-header` |
| `psh-dropdown` | `psh-dropdown-trigger`, `psh-dropdown-menu` |
| `psh-input` | `psh-input-label`, `psh-input-error`, `psh-input-success`, `psh-input-hint` |
| `psh-textarea` | `psh-textarea-label`, `psh-textarea-error`, `psh-textarea-success`, `psh-textarea-hint` |
| `psh-modal` | `psh-modal-title`, `psh-modal-footer` |

### 7.2 `cssClass` and `customStyle` are gone — the card is its own host

The four card components rendered a wrapper `<div>` that carried every class the library set.
Your `<psh-card class="…">` landed on the host, one level above all of it, which is precisely
why these four — and only these four — had passthrough inputs.

They are the host now.

```html
<!-- before -->                              <!-- after -->
<psh-card cssClass="w-full elevated">        <psh-card class="w-full elevated">
<psh-card [customStyle]="{ margin: 0 }">     <psh-card [style]="{ margin: 0 }">
```

The codemod does both rewrites. It reports instead of rewriting when the tag already has a
native `class` or `style`, because merging them is a decision about which classes should win.

**`psh-modal.styleClass` becomes `panelClass`** — renamed, not removed. The modal's panel is
rendered away from the host (a backdrop covering the viewport, positioned by the overlay
stack), so no class on `<psh-modal>` can reach it. That is the one shape where a passthrough
still earns its place. `backdropClass` is unchanged.

**One DOM level less** on every card, incidentally: their styles resolve on the host rather
than a child.

### 7.3 `info-card` row colours

The last of the six names the colour axis had. It outlived the other five because it is not
an attribute: it sits in an `InfoCardEmphasis` object, inside a `data` array, where no
template rewrite could reach it.

```ts
// before
{ label: 'Statut', value: 'Actif', emphasis: { bold: true, tone: 'success' } }
{ label: 'E-mail', value: '—',     emphasis: { tone: 'muted' } }

// after
{ label: 'Statut', value: 'Actif', emphasis: { bold: true, color: 'success' } }
{ label: 'E-mail', value: '—',     emphasis: { color: 'neutral' } }
```

`muted` becomes `neutral`, the same substitution `psh-card`'s `default` got in §3 and for the
same reason: both meant "no semantic emphasis". `secondary` now works too — the old closed
six-value union simply did not have it. The classes follow:
`.psh-info-card-value--tone-*` → `.psh-info-card-value--color-*`.

`InfoCardTone` still compiles, as a deprecated alias of `PshColor`.

## 8. Forms: the halves of the contract that were not connected

### 8.1 `psh-radio-group`, the component that was missing

A lone `psh-radio` never carried a form contract, and could not have: the value of a radio in
a form is not a boolean per button, it is **which one of the set is selected**. There was
nothing for a control to bind to, so `formControlName`, `[(ngModel)]` and `[formField]` all
type-checked and silently did nothing. Its arrow-key handlers were two empty methods,
commented *« Implementation requires radio group context »*.

```html
<!-- before: three radios and no owner for the value -->
<psh-radio name="plan" value="free" label="Free" formControlName="plan" />
<psh-radio name="plan" value="pro"  label="Pro" />

<!-- after -->
<psh-radio-group formControlName="plan" label="Plan">
  <psh-radio value="free" label="Free" />
  <psh-radio value="pro"  label="Pro" />
</psh-radio-group>
```

All three binding styles work on the group: `[(value)]`, `formControlName`, `[field]`.

The group also supplies the shared `name`, the arrow-key navigation (wrapping, skipping
disabled radios, Home/End) and a roving tabindex — one Tab stop for the whole set rather than
one per radio.

**A standalone radio still works** through `[(checked)]`, for a genuine single toggle.

The codemod **reports** loose radios rather than wrapping them: which radios belong to one
group is a judgement — usually the ones sharing a `name`, but not always — and getting it
wrong merges two questions into one answer.

`psh-radio` is also full-signal now: the two `@Input` setters and the last two
`EventEmitter`s in the library are gone. The stated reason for avoiding `model()` — *« model()
would auto-emit checkedChange on .set() »* — was not how `model()` behaves: a parent writing
the input does not emit, only the component writing it does. The real obstacle was that a lone
radio had no owner for its value.

### 8.2 `required` now validates

`NG_VALIDATORS` appeared nowhere in the library. `required` drew an asterisk and set
`aria-required`, and that was all — a form of empty required ps-helix fields reported itself
**valid**, so `form.invalid` guarded nothing and the submit button stayed enabled.

`psh-input`, `psh-textarea`, `psh-select`, `psh-checkbox`, `psh-switch` and
`psh-radio-group` provide `NG_VALIDATORS` now, with Angular's own `required` error key, so a
consumer who also declared `Validators.required` gets one error rather than two.

> **This makes forms that were accidentally valid become invalid.** That is the point, and
> the reason it waited for a major. If you used `required` purely for the asterisk, drop it
> and set `aria-required` yourself, or keep it and handle the error.

Emptiness is per control, because it has to be: an unticked required checkbox is unfilled, a
`0` in a required number field is not. Whitespace counts as empty for a text value.

### 8.3 `touch` — the output the `Field` directive actually listens to

`FormUiControl` declares two separate members for touched state: `touched`, an input the field
pushes **down**, and `touch`, an output the control sends **up**. The six input components
only had `touched = model(false)`, whose derived output is called `touchedChange` — which
`Field` does not listen to. Blur-based rules such as `debounce('blur')` never fired.

They emit `touch` now. `touched` stays a model, so `[(touched)]` keeps working.

`psh-checkbox` and `psh-switch` also gained a real blur handler: they marked themselves
touched on *toggle*, so tabbing through a required checkbox without ticking it never counted
as having been there — which is exactly when a field wants to show "required".

### 8.4 Generated ids are deterministic

Five strategies became one. Three of them were unsafe:

| Was | Where | Why it broke |
|---|---|---|
| `Math.random()` | select, modal, tooltip | different id on server and client, so every `aria-describedby` and `<label for>` baked into the SSR markup pointed at nothing after hydration |
| `crypto.randomUUID()` | switch, toast | same, **plus** it is undefined in a non-secure context — over plain http, a switch threw on construction |
| a module counter | input, textarea, checkbox, radio, collapse, pagination | correct, and now the only one |

Ids look like `psh-input-1`, `psh-select-2`. If you asserted on the old shapes in tests,
they have changed; if you passed your own `id`, nothing has.

## 9. Styling a component from outside

Component custom properties used to be declared on the element that consumed them, so
setting one on the host did nothing:

```css
/* 6.x — inherited down to the inner <button>, then immediately redefined. No effect. */
psh-button { --btn-height-md: 3rem; }
```

They are now read with their default as a `var()` fallback, so an override works from
anywhere — a component stylesheet or a global one:

```css
psh-button { --psh-btn-min-width-md: 10rem; }
```

The 82 available properties are listed per component in
[`TOKENS.md`](./projects/ps-helix/TOKENS.md#component-css-api).

If you were reaching in with `::ng-deep` to work around the old behaviour, check whether a
property now covers your case.

## 10. Smaller changes

- **Dependencies.** `date-fns` is gone (it had zero usages). `@ngx-translate/core` is an
  optional peer with a `>=15` range — if you were held to `^15` by ps-helix, you no longer
  are.
- **Package exports.** `./styles.css` and the styles subtree are declared, so the import
  the README documents now works under esbuild, Vite and Rollup rather than only through
  the Angular CLI's tolerance.
- **Focus.** `:focus-visible` is the trigger everywhere. If you relied on the ring
  appearing on mouse click for `psh-input`, `psh-select` or `psh-textarea`, it no longer
  does — that was the inconsistency, not the behaviour.
