# Configuration

> **Generated from the config tokens — do not edit by hand.**
> Run `npm run docs:config` after changing a token's defaults.

Every component reads its defaults from an `InjectionToken`, so an application can set them
once instead of repeating an attribute on every instance.

```typescript
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
```

**A partial override stays partial.** Each component reads
`this.config.<key> ?? <its own literal>`, so `{ button: { size: 'large' } }` leaves the
button's colour and appearance where they were.

**An input always wins over the configuration.** The config sets the *default* of the input;
writing the attribute on an element overrides it for that element.

Three narrower functions exist for an application that wants one part of it —
`provideHelixTheme`, `provideHelixComponentDefaults` and `provideHelixToast`. Mixing them
with `provideHelix` is harmless: the later provider wins, as anywhere else in Angular.

Each token is also exported by name, for the cases a single component needs a different
default in one part of the application:

```typescript
import { BUTTON_CONFIG } from 'ps-helix';

@Component({ providers: [{ provide: BUTTON_CONFIG, useValue: { size: 'small' } }] })
```

**31 tokens, 226 settable defaults.**

---

### `alert`

`ALERT_CONFIG` · `Partial<AlertConfig>` · [alert.tokens.ts](src/lib/components/alert/alert.tokens.ts)

| Key | Default |
|---|---|
| `color` | `'info'` |
| `iconPosition` | `'left'` |
| `closable` | `false` |
| `size` | `'medium'` |
| `showIcon` | `true` |
| `labels` | `{ dismiss: 'Dismiss alert' }` |

### `avatar`

`AVATAR_CONFIG` · `Partial<AvatarConfig>` · [avatar.tokens.ts](src/lib/components/avatar/avatar.tokens.ts)

| Key | Default |
|---|---|
| `size` | `'medium'` |
| `shape` | `'circle'` |
| `alt` | `'User avatar'` |
| `icon` | `'user'` |

### `badge`

`BADGE_CONFIG` · `Partial<BadgeConfig>` · [badge.tokens.ts](src/lib/components/badge/badge.tokens.ts)

| Key | Default |
|---|---|
| `color` | `'primary'` |
| `size` | `'medium'` |
| `displayType` | `'text'` |
| `position` | `'top-right'` |
| `max` | `99` |
| `showZero` | `false` |
| `overlap` | `false` |
| `disabled` | `false` |

### `button`

`BUTTON_CONFIG` · `Partial<ButtonConfig>` · [button.tokens.ts](src/lib/components/button/button.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'solid'` |
| `color` | `'primary'` |
| `size` | `'medium'` |
| `type` | `'button'` |
| `iconPosition` | `'left'` |
| `fullWidth` | `false` |
| `loadingText` | `'Loading...'` |
| `disabledText` | `'This action is currently unavailable'` |

### `card`

`CARD_CONFIG` · `Partial<CardConfig>` · [card.tokens.ts](src/lib/components/card/card.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'flat'` |
| `color` | `'neutral'` |
| `density` | `'normal'` |
| `hoverable` | `false` |
| `interactive` | `false` |
| `bodyPadding` | `true` |
| `showHeaderDivider` | `true` |
| `showFooterDivider` | `true` |
| `showActionsDivider` | `true` |
| `actionsAlignment` | `'right'` |

### `checkbox`

`CHECKBOX_CONFIG` · `Partial<CheckboxConfig>` · [checkbox.component.ts](src/lib/components/checkbox/checkbox.component.ts)

| Key | Default |
|---|---|
| `checked` | `false` |
| `disabled` | `false` |
| `required` | `false` |
| `indeterminate` | `false` |
| `size` | `'medium'` |
| `labelPosition` | `'right'` |
| `label` | `''` |

### `collapse`

`COLLAPSE_CONFIG` · `Partial<CollapseConfig>` · [collapse.tokens.ts](src/lib/components/collapse/collapse.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'flat'` |
| `size` | `'medium'` |
| `icon` | `'caret-down'` |
| `maxHeight` | `'auto'` |
| `defaultHeaderText` | `'Collapsible section'` |
| `disableAnimation` | `false` |

### `dropdown`

`DROPDOWN_CONFIG` · `Partial<DropdownConfig>` · [dropdown.tokens.ts](src/lib/components/dropdown/dropdown.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'solid'` |
| `color` | `'primary'` |
| `size` | `'medium'` |
| `placement` | `'bottom-start'` |
| `iconOnly` | `false` |
| `disabled` | `false` |
| `label` | `'Dropdown Menu'` |

### `horizontalCard`

`HORIZONTAL_CARD_CONFIG` · `Partial<HorizontalCardConfig>` · [horizontal-card.tokens.ts](src/lib/components/horizontal-card/horizontal-card.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'elevated'` |
| `hoverable` | `false` |
| `interactive` | `false` |
| `sideWidth` | `'var(--psh-size-48)'` |
| `gap` | `'var(--psh-spacing-md)'` |
| `sidePadding` | `'0'` |
| `contentPadding` | `'var(--psh-spacing-md)'` |
| `mobileHeight` | `'var(--psh-size-48)'` |

### `infoCard`

`INFO_CARD_CONFIG` · `Partial<InfoCardConfig>` · [info-card.tokens.ts](src/lib/components/info-card/info-card.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'outline'` |
| `icon` | `'circle-dashed'` |
| `hoverable` | `false` |
| `interactive` | `false` |
| `copyable` | `false` |
| `copyButtonLabel` | `'Copy'` |
| `copyFeedbackText` | `'Copied'` |
| `autoFullWidthOnMobile` | `true` |
| `emptyStateMessage` | `'No information available'` |
| `notProvidedText` | `'Not provided'` |

### `input`

`INPUT_CONFIG` · `Partial<InputConfig>` · [input.tokens.ts](src/lib/components/input/input.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'outline'` |
| `size` | `'medium'` |
| `type` | `'text'` |
| `required` | `false` |
| `showPasswordLabel` | `INPUT_LABELS.showPassword` |
| `hidePasswordLabel` | `INPUT_LABELS.hidePassword` |
| `fullWidth` | `false` |
| `showLabel` | `true` |
| `label` | `''` |
| `placeholder` | `''` |

### `menu`

`MENU_CONFIG` · `Partial<MenuConfig>` · [menu.tokens.ts](src/lib/components/menu/menu.tokens.ts)

| Key | Default |
|---|---|
| `mode` | `'vertical'` |
| `variant` | `'default'` |
| `collapsible` | `false` |

### `modal`

`MODAL_CONFIG` · `Partial<ModalConfig>` · [modal.component.ts](src/lib/components/modal/modal.component.ts)

| Key | Default |
|---|---|
| `size` | `'medium'` |
| `showClose` | `true` |
| `closeOnBackdrop` | `true` |
| `closeOnEscape` | `true` |
| `preventScroll` | `true` |
| `showFooter` | `true` |
| `dismissLabel` | `'Close'` |
| `confirmLabel` | `'Confirm'` |
| `cancelLabel` | `'Cancel'` |

### `pagination`

`PAGINATION_CONFIG` · `Partial<PaginationConfig>` · [pagination.component.ts](src/lib/components/pagination/pagination.component.ts)

| Key | Default |
|---|---|
| `size` | `'medium'` |
| `appearance` | `'flat'` |
| `showFirstLast` | `true` |
| `showPrevNext` | `true` |
| `maxVisiblePages` | `5` |
| `showItemsPerPage` | `false` |
| `itemsPerPageOptions` | `[5, 10, 25, 50]` |
| `firstLabel` | `'First'` |
| `previousLabel` | `'Previous'` |
| `nextLabel` | `'Next'` |
| `lastLabel` | `'Last'` |
| `pageLabel` | `'Page'` |
| `itemsLabel` | `'items'` |
| `itemsPerPageLabel` | `'Items per page'` |
| `ariaLabel` | `'Pagination navigation'` |

### `progressbar`

`PROGRESSBAR_CONFIG` · `Partial<ProgressbarConfig>` · [progressbar.component.ts](src/lib/components/progressbar/progressbar.component.ts)

| Key | Default |
|---|---|
| `value` | `0` |
| `max` | `100` |
| `color` | `'primary'` |
| `size` | `'medium'` |
| `showLabel` | `true` |
| `mode` | `'default'` |
| `labelPosition` | `'top'` |

### `radioGroup`

`RADIO_GROUP_CONFIG` · `Partial<RadioGroupConfig>` · [radio-group.component.ts](src/lib/components/radio/radio-group.component.ts)

| Key | Default |
|---|---|
| `size` | `'medium'` |
| `orientation` | `'vertical'` |
| `required` | `false` |

### `radio`

`RADIO_CONFIG` · `Partial<RadioConfig>` · [radio.component.ts](src/lib/components/radio/radio.component.ts)

| Key | Default |
|---|---|
| `checked` | `false` |
| `disabled` | `false` |
| `required` | `false` |
| `size` | `'medium'` |
| `labelPosition` | `'right'` |

### `select`

`SELECT_CONFIG` · `Partial<SelectConfig>` · [select.tokens.ts](src/lib/components/select/select.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'outline'` |
| `size` | `'medium'` |
| `searchable` | `false` |
| `clearable` | `false` |
| `fullWidth` | `false` |
| `placeholder` | `'Select an option'` |
| `multiplePlaceholder` | `'Select options'` |
| `noResultsText` | `'No results'` |
| `clearLabel` | `'Clear selection'` |
| `searchPlaceholder` | `'Search...'` |

### `sidebar`

`SIDEBAR_CONFIG` · `Partial<SidebarConfig>` · [sidebar.component.ts](src/lib/components/sidebar/sidebar.component.ts)

| Key | Default |
|---|---|
| `mode` | `'fixed'` |
| `position` | `'left'` |
| `width` | `'250px'` |
| `breakpoint` | `'768px'` |
| `autoFocus` | `true` |
| `ariaLabel` | `'Sidebar navigation'` |
| `closeOnBackdrop` | `true` |
| `closeOnEscape` | `true` |

### `spinloader`

`SPINLOADER_CONFIG` · `Partial<SpinLoaderConfig>` · [spinloader.component.ts](src/lib/components/spinloader/spinloader.component.ts)

| Key | Default |
|---|---|
| `variant` | `'circle'` |
| `size` | `'medium'` |
| `color` | `'primary'` |
| `ariaLabel` | `'Loading'` |

### `statCard`

`STAT_CARD_CONFIG` · `Partial<StatCardConfig>` · [stat-card.tokens.ts](src/lib/components/stat-card/stat-card.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'elevated'` |
| `layout` | `'horizontal'` |
| `hoverable` | `false` |
| `interactive` | `false` |
| `rowDirection` | `false` |

### `stateFlowIndicator`

`STATE_FLOW_INDICATOR_CONFIG` · `Partial<StateFlowIndicatorConfig>` · [state-flow-indicator.component.ts](src/lib/components/state-flow-indicator/state-flow-indicator.component.ts)

| Key | Default |
|---|---|
| `linear` | `true` |
| `ariaLabels` | `DEFAULT_ARIA_LABELS` |
| `ariaLabel` | `'Progress indicator'` |

### `stepper`

`STEPPER_CONFIG` · `Partial<StepperConfig>` · [stepper.component.ts](src/lib/components/stepper/stepper.component.ts)

| Key | Default |
|---|---|
| `variant` | `'default'` |
| `linear` | `true` |
| `ariaLabels` | `DEFAULT_ARIA_LABELS` |
| `ariaLabel` | `'Step navigation'` |

### `switch`

`SWITCH_CONFIG` · `Partial<SwitchConfig>` · [switch.component.ts](src/lib/components/switch/switch.component.ts)

| Key | Default |
|---|---|
| `checked` | `false` |
| `disabled` | `false` |
| `required` | `false` |
| `size` | `'medium'` |
| `labelPosition` | `'right'` |

### `tabBar`

`TAB_BAR_CONFIG` · `Partial<TabBarConfig>` · [tab-bar.component.ts](src/lib/components/tab-bar/tab-bar.component.ts)

| Key | Default |
|---|---|
| `disabled` | `false` |
| `position` | `'bottom'` |
| `animated` | `true` |
| `ariaLabel` | `'Tab navigation'` |

### `table`

`TABLE_CONFIG` · `Partial<TableConfig>` · [table.component.ts](src/lib/components/table/table.component.ts)

| Key | Default |
|---|---|
| `appearance` | `'flat'` |
| `size` | `'medium'` |
| `striped` | `false` |
| `hoverable` | `false` |
| `bordered` | `false` |
| `loading` | `false` |
| `emptyMessage` | `'No data available'` |
| `noResultsMessage` | `'No results found'` |
| `globalSearch` | `false` |
| `globalSearchPlaceholder` | `'Search in all columns...'` |
| `tableLayout` | `'auto'` |
| `truncateText` | `false` |
| `fullWidth` | `false` |
| `expandable` | `false` |
| `singleExpand` | `false` |
| `expandColumnLabel` | `'Expand'` |
| `expandRowLabel` | `'Expand row'` |
| `collapseRowLabel` | `'Collapse row'` |
| `sortedAscendingLabel` | `'sorted ascending'` |
| `sortedDescendingLabel` | `'sorted descending'` |
| `resultsFoundLabel` | `'results found'` |

### `tabs`

`TABS_CONFIG` · `Partial<TabsConfig>` · [tabs.component.ts](src/lib/components/tabs/tabs.component.ts)

| Key | Default |
|---|---|
| `ariaLabel` | `'Tab navigation'` |
| `variant` | `'default'` |
| `size` | `'medium'` |
| `activeIndex` | `0` |
| `animated` | `true` |

### `tag`

`TAG_CONFIG` · `Partial<TagConfig>` · [tag.component.ts](src/lib/components/tag/tag.component.ts)

| Key | Default |
|---|---|
| `color` | `'primary'` |
| `size` | `'medium'` |
| `closable` | `false` |
| `disabled` | `false` |
| `interactive` | `false` |
| `closeLabel` | `'Remove tag'` |

### `textarea`

`TEXTAREA_CONFIG` · `Partial<TextareaConfig>` · [textarea.tokens.ts](src/lib/components/textarea/textarea.tokens.ts)

| Key | Default |
|---|---|
| `appearance` | `'outline'` |
| `size` | `'medium'` |
| `resize` | `'vertical'` |
| `rows` | `4` |
| `required` | `false` |
| `characterCountSuffix` | `TEXTAREA_LABELS.characterCountSuffix` |
| `fullWidth` | `false` |
| `showLabel` | `true` |
| `showCharacterCount` | `false` |
| `autoSize` | `false` |
| `label` | `''` |
| `placeholder` | `''` |

### `toast`

`TOAST_CONFIG` · `Partial<ToastConfig>` · [toast.tokens.ts](src/lib/components/toast/toast.tokens.ts)

| Key | Default |
|---|---|
| `position` | `'top-right'` |
| `duration` | `5000` |
| `maxToasts` | `5` |
| `pauseOnHover` | `true` |
| `showIcon` | `true` |
| `showCloseButton` | `true` |
| `ariaLabel` | `'Notifications'` |

### `tooltip`

`TOOLTIP_CONFIG` · `Partial<TooltipConfig>` · [tooltip.component.ts](src/lib/components/tooltip/tooltip.component.ts)

| Key | Default |
|---|---|
| `variant` | `'dark'` |
| `position` | `'top'` |
| `showDelay` | `200` |
| `hideDelay` | `100` |
| `maxWidth` | `200` |
| `autoFlip` | `true` |
