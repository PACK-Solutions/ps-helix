/**
 * One call to configure the design system.
 *
 * Before this, an application that wanted to set the theme contrast target, its brand colours,
 * a toast position and a default size for buttons had to import four tokens by name and
 * assemble the `Provider[]` itself — for tokens that were never exported deliberately, only by
 * `export *` ricochet, and that nothing in the documentation listed. There were twenty-two
 * `InjectionToken`s in the library and exactly one `provide*` function, which returned a bare
 * `Provider` rather than `EnvironmentProviders`.
 *
 *     bootstrapApplication(App, {
 *       providers: [
 *         provideHelix({
 *           theme: { targetContrast: 'AAA', customerContext: BrandService },
 *           components: {
 *             button: { size: 'large', appearance: 'outline' },
 *             modal: { dismissLabel: 'Fermer', confirmLabel: 'Valider' },
 *             toast: { position: 'bottom-right' },
 *           },
 *         }),
 *       ],
 *     });
 *
 * The three finer-grained functions exist for the applications that want one part of it:
 * `provideHelixTheme`, `provideHelixComponentDefaults` and `provideHelixToast`. `provideHelix`
 * is those three composed, so mixing them is harmless — the later provider wins, as it does
 * anywhere else in Angular.
 *
 * **A defaults object is merged with nothing.** Each component reads
 * `this.config.<key> ?? <its own literal>`, so a partial override leaves every other key at
 * the library default. That is why `{ button: { size: 'large' } }` does not reset the
 * button's colour or appearance.
 */
import {
  EnvironmentProviders,
  Provider,
  Type,
  makeEnvironmentProviders,
} from '@angular/core';

import {
  CUSTOMER_CONTEXT_SERVICE,
  CustomerContextService,
  PSH_THEME_OPTIONS,
  PshThemeOptions,
} from './services/theme/theme.service';

import { ALERT_CONFIG } from './components/alert/alert.tokens';
import { AVATAR_CONFIG } from './components/avatar/avatar.tokens';
import { BADGE_CONFIG } from './components/badge/badge.tokens';
import { BUTTON_CONFIG } from './components/button/button.tokens';
import { CARD_CONFIG } from './components/card/card.tokens';
import { CHECKBOX_CONFIG } from './components/checkbox/checkbox.component';
import { COLLAPSE_CONFIG } from './components/collapse/collapse.tokens';
import { DROPDOWN_CONFIG } from './components/dropdown/dropdown.tokens';
import { HORIZONTAL_CARD_CONFIG } from './components/horizontal-card/horizontal-card.tokens';
import { INFO_CARD_CONFIG } from './components/info-card/info-card.tokens';
import { INPUT_CONFIG } from './components/input/input.tokens';
import { MENU_CONFIG } from './components/menu/menu.tokens';
import { MODAL_CONFIG } from './components/modal/modal.component';
import { PAGINATION_CONFIG } from './components/pagination/pagination.component';
import { PROGRESSBAR_CONFIG } from './components/progressbar/progressbar.component';
import { RADIO_CONFIG } from './components/radio/radio.component';
import { RADIO_GROUP_CONFIG, RadioGroupConfig } from './components/radio/radio-group.component';
import { SELECT_CONFIG } from './components/select/select.tokens';
import { SIDEBAR_CONFIG } from './components/sidebar/sidebar.component';
import { SPINLOADER_CONFIG } from './components/spinloader/spinloader.component';
import { STAT_CARD_CONFIG } from './components/stat-card/stat-card.tokens';
import { STATE_FLOW_INDICATOR_CONFIG } from './components/state-flow-indicator/state-flow-indicator.component';
import { STEPPER_CONFIG } from './components/stepper/stepper.component';
import { SWITCH_CONFIG } from './components/switch/switch.component';
import { TAB_BAR_CONFIG } from './components/tab-bar/tab-bar.component';
import { TABLE_CONFIG } from './components/table/table.component';
import { TABS_CONFIG } from './components/tabs/tabs.component';
import { TAG_CONFIG } from './components/tag/tag.component';
import { TEXTAREA_CONFIG } from './components/textarea/textarea.tokens';
import { TOAST_CONFIG } from './components/toast/toast.tokens';
import { TOOLTIP_CONFIG } from './components/tooltip/tooltip.component';

import { AlertConfig } from './components/alert/alert.types';
import { AvatarConfig } from './components/avatar/avatar.types';
import { BadgeConfig } from './components/badge/badge.types';
import { ButtonConfig } from './components/button/button.types';
import { CardConfig } from './components/card/card.types';
import { CheckboxConfig } from './components/checkbox/checkbox.types';
import { CollapseConfig } from './components/collapse/collapse.types';
import { DropdownConfig } from './components/dropdown/dropdown.types';
import { HorizontalCardConfig } from './components/horizontal-card/horizontal-card.types';
import { InfoCardConfig } from './components/info-card/info-card.types';
import { InputConfig } from './components/input/input.types';
import { MenuConfig } from './components/menu/menu.types';
import { ModalConfig } from './components/modal/modal.types';
import { PaginationConfig } from './components/pagination/pagination.types';
import { ProgressbarConfig } from './components/progressbar/progressbar.types';
import { RadioConfig } from './components/radio/radio.types';
import { SelectConfig } from './components/select/select.types';
import { SidebarConfig } from './components/sidebar/sidebar.types';
import { SpinLoaderConfig } from './components/spinloader/spinloader.types';
import { StatCardConfig } from './components/stat-card/stat-card.types';
import { StateFlowIndicatorConfig } from './components/state-flow-indicator/state-flow-indicator.types';
import { StepperConfig } from './components/stepper/stepper.types';
import { SwitchConfig } from './components/switch/switch.types';
import { TabBarConfig } from './components/tab-bar/tab-bar.types';
import { TableConfig } from './components/table/table.types';
import { TabsConfig } from './components/tabs/tabs.types';
import { TagConfig } from './components/tag/tag.types';
import { TextareaConfig } from './components/textarea/textarea.types';
import { ToastConfig } from './components/toast/toast.types';
import { TooltipConfig } from './components/tooltip/tooltip.types';

/**
 * Per-component defaults, keyed by the component's own name.
 *
 * Every key is optional and every value is a `Partial`: set only what you want to change.
 */
export interface PshComponentDefaults {
  alert?: Partial<AlertConfig>;
  avatar?: Partial<AvatarConfig>;
  badge?: Partial<BadgeConfig>;
  button?: Partial<ButtonConfig>;
  card?: Partial<CardConfig>;
  checkbox?: Partial<CheckboxConfig>;
  collapse?: Partial<CollapseConfig>;
  dropdown?: Partial<DropdownConfig>;
  horizontalCard?: Partial<HorizontalCardConfig>;
  infoCard?: Partial<InfoCardConfig>;
  input?: Partial<InputConfig>;
  menu?: Partial<MenuConfig>;
  modal?: Partial<ModalConfig>;
  pagination?: Partial<PaginationConfig>;
  progressbar?: Partial<ProgressbarConfig>;
  radio?: Partial<RadioConfig>;
  radioGroup?: Partial<RadioGroupConfig>;
  select?: Partial<SelectConfig>;
  sidebar?: Partial<SidebarConfig>;
  spinloader?: Partial<SpinLoaderConfig>;
  statCard?: Partial<StatCardConfig>;
  stateFlowIndicator?: Partial<StateFlowIndicatorConfig>;
  stepper?: Partial<StepperConfig>;
  switch?: Partial<SwitchConfig>;
  tabBar?: Partial<TabBarConfig>;
  table?: Partial<TableConfig>;
  tabs?: Partial<TabsConfig>;
  tag?: Partial<TagConfig>;
  textarea?: Partial<TextareaConfig>;
  toast?: Partial<ToastConfig>;
  tooltip?: Partial<TooltipConfig>;
}

/** Theme configuration: the contrast floor, and where brand colours come from. */
export interface PshThemeConfig extends PshThemeOptions {
  /**
   * A service supplying the application's brand colours. The theme derives its whole palette
   * from them in OKLCH and raises any pair that would fall under the contrast target.
   */
  customerContext?: Type<CustomerContextService>;
}

export interface PshConfig {
  theme?: PshThemeConfig;
  components?: PshComponentDefaults;
}

/**
 * The map every provider here walks.
 *
 * `satisfies Record<keyof Required<PshComponentDefaults>, unknown>` is what keeps the two in
 * step: a component added to the interface without a token here, or a token here that the
 * interface does not name, fails the build. Without it, a missing entry would be a key an
 * application can set and nothing reads.
 */
const TOKEN_BY_KEY = {
  alert: ALERT_CONFIG,
  avatar: AVATAR_CONFIG,
  badge: BADGE_CONFIG,
  button: BUTTON_CONFIG,
  card: CARD_CONFIG,
  checkbox: CHECKBOX_CONFIG,
  collapse: COLLAPSE_CONFIG,
  dropdown: DROPDOWN_CONFIG,
  horizontalCard: HORIZONTAL_CARD_CONFIG,
  infoCard: INFO_CARD_CONFIG,
  input: INPUT_CONFIG,
  menu: MENU_CONFIG,
  modal: MODAL_CONFIG,
  pagination: PAGINATION_CONFIG,
  progressbar: PROGRESSBAR_CONFIG,
  radio: RADIO_CONFIG,
  radioGroup: RADIO_GROUP_CONFIG,
  select: SELECT_CONFIG,
  sidebar: SIDEBAR_CONFIG,
  spinloader: SPINLOADER_CONFIG,
  statCard: STAT_CARD_CONFIG,
  stateFlowIndicator: STATE_FLOW_INDICATOR_CONFIG,
  stepper: STEPPER_CONFIG,
  switch: SWITCH_CONFIG,
  tabBar: TAB_BAR_CONFIG,
  table: TABLE_CONFIG,
  tabs: TABS_CONFIG,
  tag: TAG_CONFIG,
  textarea: TEXTAREA_CONFIG,
  toast: TOAST_CONFIG,
  tooltip: TOOLTIP_CONFIG,
} as const satisfies Record<keyof Required<PshComponentDefaults>, unknown>;

/** Every component config token, in one place, for an application that wants to enumerate them. */
export const PSH_CONFIG_TOKENS = TOKEN_BY_KEY;

function componentProviders(defaults: PshComponentDefaults): Provider[] {
  const providers: Provider[] = [];
  for (const key of Object.keys(defaults) as (keyof PshComponentDefaults)[]) {
    const value = defaults[key];
    if (value === undefined) continue;
    providers.push({ provide: TOKEN_BY_KEY[key], useValue: value });
  }
  return providers;
}

function themeProviders(theme: PshThemeConfig): Provider[] {
  const { customerContext, ...options } = theme;
  const providers: Provider[] = [{ provide: PSH_THEME_OPTIONS, useValue: options }];
  if (customerContext) {
    providers.push({ provide: CUSTOMER_CONTEXT_SERVICE, useClass: customerContext });
  }
  return providers;
}

/** Theme only: contrast target and brand colours. */
export function provideHelixTheme(theme: PshThemeConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders(themeProviders(theme));
}

/** Component defaults only. */
export function provideHelixComponentDefaults(
  defaults: PshComponentDefaults,
): EnvironmentProviders {
  return makeEnvironmentProviders(componentProviders(defaults));
}

/** Toast only — the one component driven entirely by a service rather than by inputs. */
export function provideHelixToast(config: Partial<ToastConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: TOAST_CONFIG, useValue: config }]);
}

/** Theme and component defaults in one call. */
export function provideHelix(config: PshConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    ...(config.theme ? themeProviders(config.theme) : []),
    ...(config.components ? componentProviders(config.components) : []),
  ]);
}
