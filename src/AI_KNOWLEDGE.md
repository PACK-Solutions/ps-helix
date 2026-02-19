# Helix Design System - AI Knowledge Base

Reference documentation for the Helix Design System Angular component library. This document provides all necessary information for AI-assisted code generation.

---

## Overview

- **Library**: `ps-helix`
- **Version**: 3.0.9
- **Framework**: Angular 21+
- **Prefix**: `psh-` (all components)
- **Import**: `import { ComponentName } from 'ps-helix';`

---

## Design Tokens

### Spacing

| Token | Value | Pixels |
|-------|-------|--------|
| `--spacing-xxs` | 0.125rem | 2px |
| `--spacing-xs` | 0.25rem | 4px |
| `--spacing-sm` | 0.5rem | 8px |
| `--spacing-md` | 1rem | 16px |
| `--spacing-lg` | 1.5rem | 24px |
| `--spacing-xl` | 2rem | 32px |
| `--spacing-2xl` | 3rem | 48px |
| `--spacing-3xl` | 4rem | 64px |

### Typography

| Token | Value |
|-------|-------|
| `--font-family` | 'Poppins', system-ui, sans-serif |
| `--font-size-xs` | clamp(0.6875rem, ..., 0.75rem) |
| `--font-size-sm` | clamp(0.8125rem, ..., 0.875rem) |
| `--font-size-base` | clamp(0.9375rem, ..., 1rem) |
| `--font-size-lg` | clamp(1.0625rem, ..., 1.125rem) |
| `--font-size-xl` | clamp(1.125rem, ..., 1.25rem) |
| `--font-size-2xl` | clamp(1.25rem, ..., 1.5rem) |
| `--font-size-3xl` | clamp(1.5rem, ..., 1.875rem) |
| `--font-size-4xl` | clamp(1.75rem, ..., 2.25rem) |
| `--font-weight-normal` | 400 |
| `--font-weight-medium` | 500 |
| `--font-weight-semibold` | 600 |
| `--font-weight-bold` | 700 |
| `--line-height-tight` | 1.25 |
| `--line-height-normal` | 1.5 |
| `--line-height-relaxed` | 1.75 |

### Sizing

| Token | Value | Pixels |
|-------|-------|--------|
| `--size-1` | 0.25rem | 4px |
| `--size-2` | 0.5rem | 8px |
| `--size-3` | 0.75rem | 12px |
| `--size-4` | 1rem | 16px |
| `--size-6` | 1.5rem | 24px |
| `--size-8` | 2rem | 32px |
| `--size-10` | 2.5rem | 40px |
| `--size-12` | 3rem | 48px |
| `--size-16` | 4rem | 64px |
| `--size-20` | 5rem | 80px |
| `--size-24` | 6rem | 96px |

### Border Radius

| Token | Value |
|-------|-------|
| `--radius-none` | 0 |
| `--radius-sm` | 0.125rem |
| `--radius-base` | 0.25rem |
| `--radius-md` | 0.375rem |
| `--radius-lg` | 0.5rem |
| `--radius-xl` | 0.75rem |
| `--radius-2xl` | 1rem |
| `--radius-full` | 9999px |

### Shadows

| Token | Value |
|-------|-------|
| `--shadow-sm` | 0 1px 2px 0 rgba(0, 0, 0, 0.05) |
| `--shadow-md` | 0 4px 6px -1px rgba(0, 0, 0, 0.1), ... |
| `--shadow-lg` | 0 10px 15px -3px rgba(0, 0, 0, 0.1), ... |

### Z-Index

| Token | Value |
|-------|-------|
| `--z-index-navigation` | 50 |
| `--z-index-dropdown` | 100 |
| `--z-index-tooltip` | 200 |
| `--z-index-modal-backdrop` | 999 |
| `--z-index-modal` | 1000 |
| `--z-index-toast` | 9999 |

### Animation

| Token | Value |
|-------|-------|
| `--animation-duration-fast` | 0.15s |
| `--animation-duration-normal` | 0.2s |
| `--animation-duration-default` | 0.3s |
| `--animation-duration-slow` | 0.5s |
| `--animation-easing-default` | ease |
| `--animation-easing-smooth` | cubic-bezier(0.4, 0, 0.2, 1) |

### Colors (Light Theme)

| Token | Value |
|-------|-------|
| `--primary-color` | #0B0191 |
| `--secondary-color` | #5E5E5E |
| `--success-color` | #0F853A |
| `--warning-color` | #b25310 |
| `--danger-color` | #D92626 |
| `--surface-0` | #ffffff |
| `--surface-100` | #f1f5f9 |
| `--surface-200` | #e2e8f0 |
| `--surface-card` | var(--surface-0) |
| `--surface-border` | var(--surface-200) |
| `--text-color` | var(--surface-800) |
| `--text-color-secondary` | var(--surface-600) |

### Breakpoints

| Token | Value | Pixels |
|-------|-------|--------|
| `--breakpoint-xs` | 30em | 480px |
| `--breakpoint-sm` | 40em | 640px |
| `--breakpoint-md` | 48em | 768px |
| `--breakpoint-lg` | 64em | 1024px |
| `--breakpoint-xl` | 80em | 1280px |
| `--breakpoint-2xl` | 96em | 1536px |

---

## Utility Classes

### Spacing

**Margin**: `.m-{0|xs|sm|md|lg|xl|2xl}`, `.mt-*`, `.mr-*`, `.mb-*`, `.ml-*`, `.mx-*`, `.my-*`, `.mx-auto`, `.ml-auto`, `.mr-auto`

**Padding**: `.p-{0|xs|sm|md|lg|xl|2xl}`, `.pt-*`, `.pr-*`, `.pb-*`, `.pl-*`, `.px-*`, `.py-*`

**Gap**: `.gap-{0|xs|sm|md|lg|xl|2xl}`, `.gap-x-*`, `.gap-y-*`

### Typography

**Size**: `.text-{xs|sm|base|lg|xl|2xl|3xl|4xl}`

**Weight**: `.font-{normal|medium|semibold|bold}`

**Line Height**: `.leading-{tight|normal|relaxed}`

**Letter Spacing**: `.tracking-{tight|normal|wide|wider|widest}`

**Color**: `.text-primary`, `.text-secondary`, `.text-success`, `.text-warning`, `.text-danger`, `.text-color`, `.text-color-secondary`

**Alignment**: `.text-left`, `.text-center`, `.text-right`, `.text-justify`

### Layout

**Display**: `.hidden`, `.block`, `.inline`, `.inline-block`, `.flex`, `.inline-flex`, `.grid`, `.inline-grid`

**Flexbox**:
- Direction: `.flex-row`, `.flex-row-reverse`, `.flex-col`, `.flex-col-reverse`
- Wrap: `.flex-wrap`, `.flex-wrap-reverse`, `.flex-nowrap`
- Align: `.items-start`, `.items-end`, `.items-center`, `.items-baseline`, `.items-stretch`
- Justify: `.justify-start`, `.justify-end`, `.justify-center`, `.justify-between`, `.justify-around`, `.justify-evenly`
- Flex: `.flex-none`, `.flex-auto`, `.flex-initial`, `.flex-1`, `.flex-2`, `.flex-3`
- Shrink/Grow: `.shrink`, `.shrink-0`, `.grow`, `.grow-0`

**Grid**:
- Columns: `.grid-cols-{1|2|3|4|6|12}`
- Span: `.col-span-{1|2|3|4|6|12|full}`, `.row-span-{1|2|3|full}`

**Position**: `.static`, `.fixed`, `.absolute`, `.relative`, `.sticky`

**Width**: `.w-full`, `.w-auto`, `.w-fit`, `.w-min`, `.w-max`, `.min-w-*`, `.max-w-{none|xs|sm|md|lg|xl|2xl|...|7xl|full}`

**Height**: `.h-full`, `.h-screen`, `.h-auto`, `.h-fit`, `.min-h-*`

**Overflow**: `.overflow-{auto|hidden|visible|scroll}`, `.overflow-x-*`, `.overflow-y-*`

### Colors

**Background**: `.bg-primary`, `.bg-secondary`, `.bg-success`, `.bg-warning`, `.bg-danger`, `.bg-surface-card`, `.bg-surface-ground`

**Border**: `.border-primary`, `.border-secondary`, `.border-success`, `.border-warning`, `.border-danger`

### Responsive Prefixes

- `sm:` - min-width: 40em (640px)
- `md:` - min-width: 48em (768px)
- `lg:` - min-width: 64em (1024px)
- `mobile:` - max-width: 48em (768px)

Examples: `.sm:flex`, `.md:grid-cols-2`, `.lg:hidden`, `.mobile:flex-col`

### Animations

`.animate-fade-in`, `.animate-fade-in-up`, `.animate-slide-in`, `.animate-slide-in-down`, `.animate-slide-in-left`, `.animate-slide-in-right`, `.animate-scale-in`, `.animate-spin`, `.animate-bounce`, `.animate-pulse`

Control: `.animate-fast`, `.animate-slow`, `.animate-smooth`

### Focus

`.focus-ring`, `.focus-ring-primary`, `.focus-ring-error`, `.focus-ring-success`, `.focus-ring-warning`, `.focus-visible-only`, `.skip-link`

### Visibility & Interaction

`.visible`, `.invisible`, `.opacity-{0|25|50|75|100}`, `.cursor-{auto|default|pointer|wait|text|move|help|not-allowed}`, `.select-{none|text|all|auto}`, `.pointer-events-{none|auto}`, `.mobile-only`, `.desktop-only`

---

## Components

### PshAlertComponent

**Selector**: `psh-alert`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Alert type |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Alert size |
| `closable` | `boolean` | `false` | Show close button |
| `showIcon` | `boolean` | `true` | Show icon |
| `icon` | `string` | - | Custom Phosphor icon |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `role` | `'alert' \| 'status'` | auto | ARIA role |
| `ariaLabel` | `string` | - | ARIA label |
| `ariaLive` | `'polite' \| 'assertive'` | auto | ARIA live region |
| `dismissLabel` | `string` | `'Dismiss alert'` | Close button label |
| `content` | `string` | `''` | Alert content |

| Output | Type | Description |
|--------|------|-------------|
| `closed` | `void` | Emitted when closed |

---

### PshAvatarComponent

**Selector**: `psh-avatar`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large' \| 'xlarge'` | `'medium'` | Avatar size |
| `shape` | `'circle' \| 'square'` | `'circle'` | Avatar shape |
| `src` | `string` | - | Image URL |
| `alt` | `string` | `''` | Alt text |
| `initials` | `string` | - | Fallback initials |
| `icon` | `string` | - | Fallback Phosphor icon |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | - | Status indicator |
| `ariaLabel` | `string` | - | ARIA label |

---

### PshBadgeComponent

**Selector**: `psh-badge`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'disabled'` | `'primary'` | Badge variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Badge size |
| `displayType` | `'dot' \| 'counter' \| 'text'` | `'text'` | Display type |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Position when overlaid |
| `value` | `string \| number` | - | Badge content |

---

### PshButtonComponent

**Selector**: `psh-button`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `appearance` | `'filled' \| 'outline' \| 'rounded' \| 'text'` | `'filled'` | Button appearance |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | Button variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `fullWidth` | `boolean` | `false` | Full width (two-way) |
| `icon` | `string` | - | Phosphor icon name |
| `iconPosition` | `'left' \| 'right' \| 'only'` | `'left'` | Icon position |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |
| `ariaLabel` | `string` | - | ARIA label |
| `loadingText` | `string` | `'Loading...'` | Loading state label |
| `disabledText` | `string` | `'This action is currently unavailable'` | Disabled state label for screen readers |
| `iconOnlyText` | `string` | - | Label for icon-only buttons |

| Output | Type | Description |
|--------|------|-------------|
| `clicked` | `MouseEvent` | Click event |
| `disabledClick` | `MouseEvent` | Emitted when user clicks while button is disabled (not loading) |

---

### PshCardComponent

**Selector**: `psh-card`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Card variant (two-way) |
| `colorVariant` | `'default' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Color variant |
| `density` | `'compact' \| 'normal' \| 'spacious'` | `'normal'` | Spacing density |
| `title` | `string` | `''` | Card title |
| `description` | `string` | `''` | Card description |
| `hoverable` | `boolean` | `false` | Hover effect (two-way) |
| `interactive` | `boolean` | `false` | Clickable (two-way) |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |
| `showHeaderDivider` | `boolean` | `true` | Show header divider |
| `showFooterDivider` | `boolean` | `true` | Show footer divider |
| `showActionsDivider` | `boolean` | `true` | Show actions divider |
| `actionsAlignment` | `'left' \| 'center' \| 'right' \| 'space-between'` | `'right'` | Actions alignment |
| `cssClass` | `string` | `''` | Additional CSS classes |

| Output | Type | Description |
|--------|------|-------------|
| `clicked` | `MouseEvent \| KeyboardEvent` | Click event (if interactive) |

**Content Projection Slots**:
- Default: Main content
- `[card-actions]`: Action buttons

---

### PshCheckboxComponent

**Selector**: `psh-checkbox`

**Two-way bindable inputs** (with `[()]`):

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state (two-way) |
| `disabled` | `boolean` | `false` | Disabled state (two-way) |
| `indeterminate` | `boolean` | `false` | Indeterminate state (two-way) |

**Regular inputs**:

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `required` | `boolean` | `false` | Required state |
| `label` | `string` | `''` | Label text |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Checkbox size |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position |
| `ariaLabel` | `string` | - | ARIA label |
| `error` | `string` | - | Error message |
| `success` | `string` | - | Success message |

| Output | Type | Description |
|--------|------|-------------|
| `checkedChange` | `boolean` | Checked state change (user action only) |
| `disabledChange` | `boolean` | Disabled state change (user action only) |
| `indeterminateChange` | `boolean` | Indeterminate state change (user action only) |

| Method | Description |
|--------|-------------|
| `focus()` | Focuses the checkbox input element |
| `blur()` | Removes focus from the checkbox input element |

Implements `ControlValueAccessor` for reactive forms (`[formControl]`, `formControlName`). Outputs are not emitted during `writeValue()`/`setDisabledState()` calls.

---

### PshCollapseComponent

**Selector**: `psh-collapse`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `expanded` | `boolean` | `false` | Expanded state (two-way) |
| `variant` | `'default' \| 'outline'` | `'default'` | Collapse variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Collapse size |
| `title` | `string` | `''` | Header title |
| `disabled` | `boolean` | `false` | Disabled state |

| Output | Type | Description |
|--------|------|-------------|
| `expandedChange` | `boolean` | Expansion state change |

---

### PshDropdownComponent

**Selector**: `psh-dropdown`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `DropdownItem[]` | `[]` | Dropdown items |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'text'` | `'primary'` | Button variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Dropdown size |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Menu placement |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | `''` | Button label |

| Output | Type | Description |
|--------|------|-------------|
| `itemSelected` | `DropdownItem` | Item selection |

**DropdownItem interface**:
```typescript
interface DropdownItem<T = string> {
  content: string;
  value: T;
  icon?: string;
  disabled?: boolean;
  active?: boolean;
}
```

---

### PshInputComponent

**Selector**: `psh-input`

**Two-way bindable inputs** (with `[()]`):

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `string` | `''` | Input value (two-way) |
| `disabled` | `boolean` | `false` | Disabled state (two-way) |
| `readonly` | `boolean` | `false` | Readonly state (two-way, model) |
| `loading` | `boolean` | `false` | Loading state (two-way, model) |

**Regular inputs**:

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | `'text' \| 'password' \| 'email' \| 'tel' \| 'url' \| 'search' \| 'date' \| 'number'` | `'text'` | Input type |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Input variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Input size |
| `required` | `boolean` | `false` | Required state |
| `fullWidth` | `boolean` | `false` | Full width |
| `showLabel` | `boolean` | `true` | Show label |
| `label` | `string` | `''` | Label text |
| `placeholder` | `string` | `''` | Placeholder |
| `iconStart` | `string` | - | Start icon |
| `iconEnd` | `string` | - | End icon |
| `error` | `string` | - | Error message |
| `success` | `string` | - | Success message |
| `hint` | `string` | - | Hint text |
| `suggestions` | `string[] \| ((query: string) => Promise<string[]>)` | `[]` | Autocomplete suggestions |
| `ariaLabel` | `string` | - | ARIA label |

| Output | Type | Description |
|--------|------|-------------|
| `valueChange` | `string` | Value change (user action only) |
| `disabledChange` | `boolean` | Disabled state change (user action only) |
| `inputFocus` | `void` | Focus event |
| `inputBlur` | `void` | Blur event |
| `suggestionSelect` | `string` | Suggestion selected |

Implements `ControlValueAccessor` for reactive forms. `valueChange` and `disabledChange` are not emitted during `writeValue()`/`setDisabledState()` calls.

---

### PshSelectComponent

**Selector**: `psh-select`

**Two-way bindable inputs** (with `[()]`):

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `T \| T[] \| null` | `null` | Selected value (two-way) |
| `disabled` | `boolean` | `false` | Disabled state (two-way) |

**Regular inputs**:

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `options` | `(SelectOption<T> \| SelectOptionGroup<T>)[]` | `[]` | Options |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Select size |
| `loading` | `boolean` | `false` | Loading state |
| `multiple` | `boolean` | `false` | Multiple selection |
| `searchable` | `boolean` | `false` | Enable search |
| `clearable` | `boolean` | `false` | Show clear button |
| `fullWidth` | `boolean` | `false` | Full width |
| `required` | `boolean` | `false` | Required state |
| `label` | `string` | `''` | Label text |
| `placeholder` | `string` | `'Select an option'` | Placeholder |
| `error` | `string` | `''` | Error message |
| `success` | `string` | `''` | Success message |
| `hint` | `string` | `''` | Hint text |
| `maxSelections` | `number` | - | Max selections (multiple) |
| `minSelections` | `number` | - | Min selections (multiple) |

| Output | Type | Description |
|--------|------|-------------|
| `valueChange` | `T \| T[] \| null` | Value change (user action only) |
| `disabledChange` | `boolean` | Disabled state change (user action only) |
| `opened` | `void` | Dropdown opened |
| `closed` | `void` | Dropdown closed |
| `searched` | `string` | Search term changed |
| `scrollEnd` | `void` | Scrolled to end |

**SelectOption interface**:
```typescript
interface SelectOption<T> {
  label: string;
  value: T;
  icon?: string;
  disabled?: boolean;
  description?: string;
}
```

Implements `ControlValueAccessor` for reactive forms. `valueChange` and `disabledChange` are not emitted during `writeValue()`/`setDisabledState()` calls.

---

### PshMenuComponent

**Selector**: `psh-menu`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `MenuItem[]` | `[]` | Menu items |
| `mode` | `'vertical' \| 'horizontal'` | `'vertical'` | Display mode |
| `variant` | `'default' \| 'compact' \| 'expanded'` | `'default'` | Menu variant |

| Output | Type | Description |
|--------|------|-------------|
| `itemSelected` | `MenuItem` | Item selection |

**MenuItem interface**:
```typescript
interface MenuItem<T = string> {
  id: string;
  content: string;
  icon?: string;
  path?: string;
  disabled?: boolean;
  active?: boolean;
  children?: MenuItem<T>[];
  divider?: boolean;
  badge?: string | number;
  value?: T;
}
```

---

### PshModalComponent

**Selector**: `psh-modal`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `open` | `boolean` | `false` | Open state (two-way) |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Modal size |
| `title` | `string` | `'Modal Title'` | Modal title |
| `showClose` | `boolean` | `true` | Show close button |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `preventScroll` | `boolean` | `true` | Prevent body scroll |
| `showFooter` | `boolean` | `true` | Show default footer |
| `dismissLabel` | `string` | `'Close'` | Close button label |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `styleClass` | `string` | `''` | Custom CSS class for container |
| `backdropClass` | `string` | `''` | Custom CSS class for backdrop (useful for stacked modals) |

| Output | Type | Description |
|--------|------|-------------|
| `closed` | `void` | Modal closed |
| `confirmed` | `void` | Confirm clicked |

**Content Projection Slots**:
- Default: Modal body content
- `[modal-title]`: Custom title with HTML/components
- `[modal-footer]` with `#modalFooter`: Custom footer

**Stacked Modals Example**:
```html
<psh-modal [(open)]="isSecondaryOpen" backdropClass="stacked-modal">
  <p>Secondary modal with higher z-index</p>
</psh-modal>
```
```css
.stacked-modal {
  z-index: calc(var(--z-index-modal-backdrop) + 10);
}
```

---

### PshTableComponent

**Selector**: `psh-table`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `columns` | `TableColumn[]` | `[]` | Column definitions |
| `data` | `TableRow[]` | `[]` | Table data |
| `variant` | `'default' \| 'outline'` | `'default'` | Table variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Table size |
| `striped` | `boolean` | `false` | Striped rows |
| `hoverable` | `boolean` | `false` | Hover effect |
| `bordered` | `boolean` | `false` | Show borders |
| `loading` | `boolean` | `false` | Loading state |
| `globalSearch` | `boolean` | `false` | Enable search |
| `globalSearchPlaceholder` | `string` | `'Search...'` | Search placeholder |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `noResultsMessage` | `string` | `'No results found'` | No results message |
| `tableLayout` | `'auto' \| 'fixed'` | `'auto'` | Table layout (fixed respects column widths) |
| `truncateText` | `boolean` | `false` | Truncate text with ellipsis |
| `fullWidth` | `boolean` | `false` | Full width mode |

| Output | Type | Description |
|--------|------|-------------|
| `sortChange` | `TableSort` | Sort changed |
| `globalSearchChange` | `string` | Search term changed |
| `rowClick` | `TableRowClickEvent` | Row clicked |

**TableColumn interface**:
```typescript
interface TableColumn {
  key: string;
  label: string;
  path?: string;
  width?: string;
  sortable?: boolean;
  template?: TemplateRef<TableCellContext>;
  sortFn?: (a: any, b: any) => number;
}
```

**Usage note**: For tables with percentage-based column widths, use `tableLayout="fixed"` combined with `truncateText="true"` to ensure columns respect their defined widths and long text is properly truncated with ellipsis. Use `fullWidth="true"` when the table should expand to fill its container width.

---

### PshTabsComponent

**Selector**: `psh-tabs`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `tabs` | `Tab[]` | `[]` | Tab definitions |
| `variant` | `'default' \| 'underline' \| 'pills'` | `'default'` | Tabs variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tabs size |
| `activeIndex` | `number` | `0` | Active tab index (two-way) |
| `animated` | `boolean` | `true` | Enable animations |
| `ariaLabel` | `string` | - | ARIA label |

| Output | Type | Description |
|--------|------|-------------|
| `activeIndexChange` | `number` | Active index changed |
| `tabChange` | `TabChangeEvent` | Tab changed |

**Tab interface**:
```typescript
interface Tab {
  header: string;
  icon?: string;
  content: string;
  disabled?: boolean;
  ariaLabel?: string;
}
```

---

### PshTabBarComponent

**Selector**: `psh-tab-bar`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `TabBarItem[]` | `[]` | Tab bar items |
| `activeIndex` | `number` | `0` | Active index (two-way) |
| `disabled` | `boolean` | `false` | Disabled state |
| `position` | `'bottom' \| 'top'` | `'bottom'` | Bar position |
| `animated` | `boolean` | `true` | Enable animations |

| Output | Type | Description |
|--------|------|-------------|
| `tabChange` | `TabBarChangeEvent` | Tab changed |

---

### PshPaginationComponent

**Selector**: `psh-pagination`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `currentPage` | `number` | `1` | Current page (two-way) |
| `totalItems` | `number` | `0` | Total items |
| `itemsPerPage` | `number` | `10` | Items per page (two-way) |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Pagination size |
| `variant` | `'default' \| 'outline'` | `'default'` | Pagination variant |
| `showFirstLast` | `boolean` | `true` | Show first/last buttons |
| `showPrevNext` | `boolean` | `true` | Show prev/next buttons |
| `maxVisiblePages` | `number` | `5` | Max visible page buttons |
| `showItemsPerPage` | `boolean` | `false` | Show items per page selector |
| `itemsPerPageOptions` | `number[]` | `[10, 25, 50, 100]` | Options for items per page |

| Output | Type | Description |
|--------|------|-------------|
| `pageChange` | `number` | Page changed |
| `itemsPerPageChange` | `number` | Items per page changed |

---

### PshProgressbarComponent

**Selector**: `psh-progressbar`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `number` | `0` | Current value |
| `max` | `number` | `100` | Maximum value |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | Color variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Bar size |
| `mode` | `'default' \| 'striped' \| 'animated' \| 'indeterminate'` | `'default'` | Display mode |
| `showLabel` | `boolean` | `false` | Show percentage label |
| `labelPosition` | `'top' \| 'bottom' \| 'inline'` | `'top'` | Label position |

---

### PshRadioComponent

**Selector**: `psh-radio`

**Two-way bindable inputs** (with `[()]`):

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state (two-way) |
| `disabled` | `boolean` | `false` | Disabled state (two-way) |

**Regular inputs**:

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `required` | `boolean` | `false` | Required state |
| `label` | `string` | `''` | Label text |
| `name` | `string` | `''` | Radio group name (mandatory for grouping) |
| `value` | `any` | - | Radio value |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Radio size |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position |
| `error` | `string` | - | Error message |
| `success` | `string` | - | Success message |

| Output | Type | Description |
|--------|------|-------------|
| `checkedChange` | `boolean` | Checked state change (user action only) |
| `disabledChange` | `boolean` | Disabled state change (user action only) |

Implements `ControlValueAccessor` for reactive forms. Outputs are not emitted during `writeValue()`/`setDisabledState()` calls.

---

### PshSwitchComponent

**Selector**: `psh-switch`

**Two-way bindable inputs** (with `[()]`):

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state (two-way) |
| `disabled` | `boolean` | `false` | Disabled state (two-way) |

**Regular inputs**:

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `required` | `boolean` | `false` | Required state |
| `label` | `string` | `''` | Label text |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Switch size |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position |
| `error` | `string` | - | Error message |
| `success` | `string` | - | Success message |
| `ariaLabel` | `string` | - | ARIA label |
| `name` | `string` | - | Native input name attribute |
| `id` | `string` | auto-generated | Unique switch ID |

| Output | Type | Description |
|--------|------|-------------|
| `checkedChange` | `boolean` | Checked state change (user action only) |
| `disabledChange` | `boolean` | Disabled state change (user action only) |

Implements `ControlValueAccessor` for reactive forms. Outputs are not emitted during `writeValue()`/`setDisabledState()` calls.

---

### PshTagComponent

**Selector**: `psh-tag`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | Tag variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tag size |
| `icon` | `string` | - | Phosphor icon |
| `closable` | `boolean` | `false` | Show close button |
| `disabled` | `boolean` | `false` | Disabled state |
| `interactive` | `boolean` | `false` | Clickable |
| `closeLabel` | `string` | `'Remove'` | Close button label |

| Output | Type | Description |
|--------|------|-------------|
| `closed` | `void` | Tag closed |
| `clicked` | `void` | Tag clicked |

---

### PshTooltipComponent

**Selector**: `psh-tooltip`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `content` | `string` | `''` | Tooltip content |
| `variant` | `'light' \| 'dark'` | `'dark'` | Tooltip variant |
| `position` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Tooltip position |
| `showDelay` | `number` | `200` | Show delay (ms) |
| `hideDelay` | `number` | `100` | Hide delay (ms) |
| `maxWidth` | `number` | `200` | Max width (px) |
| `autoFlip` | `boolean` | `true` | Auto-flip if out of viewport |

---

### PshSpinLoaderComponent

**Selector**: `psh-spinloader`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'circle' \| 'dots' \| 'pulse'` | `'circle'` | Loader variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Loader size |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | Loader color |

---

### PshToastComponent & PshToastService

**Selector**: `psh-toast` (container)

**Service**: `PshToastService`

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `show` | `toast: Omit<Toast, 'id'>` | `string` | Show toast, returns ID |
| `info` | `message: string, options?` | `string` | Show info toast |
| `success` | `message: string, options?` | `string` | Show success toast |
| `warning` | `message: string, options?` | `string` | Show warning toast |
| `error` | `message: string, options?` | `string` | Show error toast |
| `danger` | `message: string, options?` | `string` | Show danger toast |
| `remove` | `id: string` | `void` | Remove toast by ID |
| `setPosition` | `position: ToastPosition` | `void` | Set toast position |

**Toast interface**:
```typescript
interface Toast {
  id?: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  duration?: number;
  icon?: string;
  showCloseButton?: boolean;
}
```

**ToastPosition**: `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`

---

### PshSidebarComponent

**Selector**: `psh-sidebar`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `open` | `boolean` | `false` | Open state (two-way) |
| `mode` | `'fixed' \| 'overlay'` | `'fixed'` | Display mode |
| `position` | `'left' \| 'right'` | `'left'` | Sidebar position |
| `width` | `string` | `'280px'` | Sidebar width |
| `breakpoint` | `string` | `'768px'` | Mobile breakpoint |
| `autoFocus` | `boolean` | `true` | Auto-focus on open |
| `ariaLabel` | `string` | `'Sidebar'` | ARIA label |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop (overlay) |
| `closeOnEscape` | `boolean` | `true` | Close on Escape (overlay) |

| Output | Type | Description |
|--------|------|-------------|
| `openChange` | `boolean` | Open state changed |
| `closed` | `void` | Sidebar closed |

---

### PshStepperComponent

**Selector**: `psh-stepper`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `activeStep` | `number` | `0` | Active step index (two-way) |
| `variant` | `'default' \| 'numbered' \| 'progress'` | `'default'` | Stepper variant |
| `linear` | `boolean` | `false` | Force linear navigation |

| Output | Type | Description |
|--------|------|-------------|
| `activeStepChange` | `number` | Active step changed |
| `stepChange` | `StepChangeEvent` | Step navigation |

**PshStepComponent** (child):

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | `''` | Step title |
| `subtitle` | `string` | - | Step subtitle |
| `icon` | `string` | - | Step icon |
| `disabled` | `boolean` | `false` | Disabled state |
| `completed` | `boolean` | `false` | Completed state |
| `loading` | `boolean` | `false` | Loading state |
| `error` | `string` | - | Error message |
| `warning` | `string` | - | Warning message |
| `success` | `string` | - | Success message |

---

### PshStatCardComponent

**Selector**: `psh-stat-card`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | `''` | Card title |
| `value` | `string \| number` | `''` | Main value |
| `icon` | `string` | - | Phosphor icon |
| `trend` | `number` | - | Trend percentage |
| `trendLabel` | `string` | - | Trend label |
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Card variant |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |

---

### PshHorizontalCardComponent

**Selector**: `psh-horizontal-card`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Card variant |
| `sideWidth` | `string` | `'200px'` | Side panel width |
| `gap` | `string` | `'1rem'` | Gap between panels |

**Content Projection Slots**:
- `[card-side]`: Side panel content
- Default: Main content

---

### PshInfoCardComponent

**Selector**: `psh-info-card`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | `''` | Card title |
| `data` | `InfoCardData[]` | `[]` | Data rows |
| `options` | `InfoCardOptions` | see below | Configuration options |
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'outlined'` | Card variant |
| `icon` | `string` | `'circle-dashed'` | Phosphor icon name |
| `ariaLabel` | `string` | - | Custom ARIA label |
| `cssClass` | `string` | `''` | Additional CSS classes |
| `customStyle` | `Record<string, string>` | `{}` | Custom inline styles |
| `interactive` | `boolean` | `false` | Makes card clickable |
| `hoverable` | `boolean` | `false` | Enables hover effect |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |
| `autoFullWidthOnMobile` | `boolean` | `true` | Full-width buttons on mobile |

| Output | Type | Description |
|--------|------|-------------|
| `clicked` | `MouseEvent \| KeyboardEvent` | Click event (if interactive) |

**Content Projection Slots**:
- `[card-header-actions]`: Action buttons in header (right side of title)
- `[card-actions]`: Action buttons in footer

**Layout Behavior**: The component uses `host: { style: 'display: block; height: 100%;' }` which enables equal-height cards in grid layouts. Uses `ViewEncapsulation.None` for style flexibility.

**InfoCardData interface**:
```typescript
interface InfoCardData {
  label: string;
  value: string | number | boolean | null | undefined;
  labelWidth?: string;
  valueWidth?: string;
  customClass?: string;
}
```

**InfoCardOptions interface**:
```typescript
interface InfoCardOptions {
  showEmptyState?: boolean;
  emptyStateMessage?: string;
  labelWidth?: string;
  valueWidth?: string;
}
```

---

## Services

### ThemeService

**Import**: `import { ThemeService } from 'ps-helix';`

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isDarkTheme` | `Signal<boolean>` | Current dark theme state |
| `themeName` | `Signal<'light' \| 'dark'>` | Current theme name |
| `themeInfo` | `Signal<ThemeInfo>` | Theme info object |
| `setDarkTheme(isDark)` | `void` | Set dark theme |
| `toggleTheme()` | `void` | Toggle theme |
| `updateTheme(name)` | `void` | Update theme by name |

### TranslationProvider

**Import**: `import { TRANSLATION_PROVIDER, provideTranslation } from 'ps-helix';`

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `translate` | `key: string, params?` | `string` | Sync translation |
| `translateAsync` | `key: string, params?` | `Observable<string>` | Async translation |
| `setLanguage` | `lang: string` | `void` | Set language |
| `getCurrentLanguage` | - | `string` | Get current language |
| `onLangChange` | - | `Observable<string>` | Language change observable |

### ScrollService

**Import**: `import { ScrollService } from 'ps-helix';`

Automatically scrolls to top on route navigation. Inject in `app.component.ts`.

### ModalService

**Import**: `import { ModalService } from 'ps-helix';`

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `activeModalsCount` | `Signal<number>` | Count of active modals |
| `getConfig()` | `Partial<ModalConfig>` | Get global config |
| `generateId()` | `string` | Generate unique ID |
| `register(id)` | `void` | Register modal |
| `unregister(id)` | `void` | Unregister modal |
| `isRegistered(id)` | `boolean` | Check if registered |

---

## Icons

Helix uses **Phosphor Icons**. Reference: https://phosphoricons.com/

Usage in components: Pass the icon name (without `ph-` prefix).

Examples: `'house'`, `'user'`, `'gear'`, `'check'`, `'x'`, `'warning'`, `'info'`, `'arrow-right'`

---

## Best Practices

1. **Always use design tokens** for spacing, colors, and typography
2. **Use utility classes** for layout and spacing adjustments
3. **Prefer signals** over BehaviorSubject for state management
4. **Use ChangeDetectionStrategy.OnPush** for all components
5. **Implement WCAG 2.1 AA** accessibility standards
6. **Use semantic HTML** with proper ARIA attributes
7. **Follow the component API** - don't override internal styles
8. **Use two-way binding** with model() inputs when needed
9. **Handle keyboard navigation** for interactive components
10. **Test with screen readers** for accessibility

---

## File Imports

```typescript
// Components
import {
  PshAlertComponent,
  PshAvatarComponent,
  PshBadgeComponent,
  PshButtonComponent,
  PshCardComponent,
  PshCheckboxComponent,
  PshCollapseComponent,
  PshDropdownComponent,
  PshInputComponent,
  PshMenuComponent,
  PshModalComponent,
  PshPaginationComponent,
  PshProgressbarComponent,
  PshRadioComponent,
  PshSelectComponent,
  PshSidebarComponent,
  PshSpinLoaderComponent,
  PshStatCardComponent,
  PshStepperComponent,
  PshSwitchComponent,
  PshTabBarComponent,
  PshTableComponent,
  PshTabsComponent,
  PshTagComponent,
  PshToastComponent,
  PshTooltipComponent,
  PshHorizontalCardComponent,
  PshInfoCardComponent
} from 'ps-helix';

// Services
import {
  ThemeService,
  PshToastService,
  ModalService,
  ScrollService,
  TRANSLATION_PROVIDER,
  provideTranslation
} from 'ps-helix';

// Types
import {
  AlertType,
  ButtonVariant,
  CardVariant,
  SelectOption,
  TableColumn,
  Toast,
  // ... etc
} from 'ps-helix';
```
