/**
 * The configuration contract, asserted for every component at once.
 *
 * Two things are checked, and the second is the one that matters.
 *
 * **1. `provideHelix` reaches the component.** A default an application sets has to arrive.
 *
 * **2. Every key a config token declares is actually read.** Four tokens shipped a key that
 * nothing read — B4 renamed `variant` to `color` on tag and progressbar and to `appearance`
 * on table and pagination, and the default object kept the old name. The values happened to
 * agree, so nothing looked wrong; the defect was only visible the day someone changed the
 * default in one place and not the other.
 *
 * `satisfies` now catches a key that is not on the interface. It cannot catch a key that is
 * on the interface and that no input reads — which is what `itemsPerPageOptions` was. So the
 * config is handed to the component through a `Proxy` that records every property read, and
 * the test fails if a declared default went untouched.
 *
 * Most reads happen in the field initialisers (`input(this.config.x ?? …)`), so constructing
 * the component covers them — no `detectChanges`, and therefore no need to satisfy required
 * inputs that have nothing to do with configuration. A few keys are read inside a computed
 * instead (`stepper.ariaLabels`), so every signal on the instance is pulled once afterwards:
 * without that the test reports a key that is in fact wired, which is a worse failure than
 * the one it is looking for.
 */
import { InjectionToken, Type, isSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PshAlertComponent } from './components/alert/alert.component';
import { PshAvatarComponent } from './components/avatar/avatar.component';
import { PshBadgeComponent } from './components/badge/badge.component';
import { PshButtonComponent } from './components/button/button.component';
import { PshCardComponent } from './components/card/card.component';
import { PshCheckboxComponent, CHECKBOX_CONFIG } from './components/checkbox/checkbox.component';
import { PshCollapseComponent } from './components/collapse/collapse.component';
import { PshDropdownComponent } from './components/dropdown/dropdown.component';
import { PshHorizontalCardComponent } from './components/horizontal-card/horizontal-card.component';
import { PshInfoCardComponent } from './components/info-card/info-card.component';
import { PshInputComponent } from './components/input/input.component';
import { PshMenuComponent } from './components/menu/menu.component';
import { PshModalComponent, MODAL_CONFIG } from './components/modal/modal.component';
import { PshPaginationComponent, PAGINATION_CONFIG } from './components/pagination/pagination.component';
import { PshProgressbarComponent, PROGRESSBAR_CONFIG } from './components/progressbar/progressbar.component';
import { PshRadioComponent, RADIO_CONFIG } from './components/radio/radio.component';
import { PshRadioGroupComponent, RADIO_GROUP_CONFIG } from './components/radio/radio-group.component';
import { PshSelectComponent } from './components/select/select.component';
import { PshSidebarComponent, SIDEBAR_CONFIG } from './components/sidebar/sidebar.component';
import { PshSpinLoaderComponent, SPINLOADER_CONFIG } from './components/spinloader/spinloader.component';
import { PshStatCardComponent } from './components/stat-card/stat-card.component';
import {
  PshStateFlowIndicatorComponent,
  STATE_FLOW_INDICATOR_CONFIG,
} from './components/state-flow-indicator/state-flow-indicator.component';
import { PshStepperComponent, STEPPER_CONFIG } from './components/stepper/stepper.component';
import { PshSwitchComponent, SWITCH_CONFIG } from './components/switch/switch.component';
import { PshTabBarComponent, TAB_BAR_CONFIG } from './components/tab-bar/tab-bar.component';
import { PshTableComponent, TABLE_CONFIG } from './components/table/table.component';
import { PshTabsComponent, TABS_CONFIG } from './components/tabs/tabs.component';
import { PshTagComponent, TAG_CONFIG } from './components/tag/tag.component';
import { PshTextareaComponent } from './components/textarea/textarea.component';
import { PshTooltipComponent, TOOLTIP_CONFIG } from './components/tooltip/tooltip.component';

import { ALERT_CONFIG } from './components/alert/alert.tokens';
import { AVATAR_CONFIG } from './components/avatar/avatar.tokens';
import { BADGE_CONFIG } from './components/badge/badge.tokens';
import { BUTTON_CONFIG } from './components/button/button.tokens';
import { CARD_CONFIG } from './components/card/card.tokens';
import { COLLAPSE_CONFIG } from './components/collapse/collapse.tokens';
import { DROPDOWN_CONFIG } from './components/dropdown/dropdown.tokens';
import { HORIZONTAL_CARD_CONFIG } from './components/horizontal-card/horizontal-card.tokens';
import { INFO_CARD_CONFIG } from './components/info-card/info-card.tokens';
import { INPUT_CONFIG } from './components/input/input.tokens';
import { MENU_CONFIG } from './components/menu/menu.tokens';
import { SELECT_CONFIG } from './components/select/select.tokens';
import { STAT_CARD_CONFIG } from './components/stat-card/stat-card.tokens';
import { TEXTAREA_CONFIG } from './components/textarea/textarea.tokens';

import {
  PSH_CONFIG_TOKENS,
  provideHelix,
  provideHelixComponentDefaults,
  provideHelixTheme,
  provideHelixToast,
} from './provide-helix';
import { TOAST_CONFIG } from './components/toast/toast.tokens';
import { PSH_THEME_OPTIONS, CUSTOMER_CONTEXT_SERVICE } from './services/theme/theme.service';

/** Every component that takes a config token, with the token it takes. */
const CASES: [name: string, component: Type<unknown>, token: InjectionToken<object>][] = [
  ['alert', PshAlertComponent, ALERT_CONFIG],
  ['avatar', PshAvatarComponent, AVATAR_CONFIG],
  ['badge', PshBadgeComponent, BADGE_CONFIG],
  ['button', PshButtonComponent, BUTTON_CONFIG],
  ['card', PshCardComponent, CARD_CONFIG],
  ['checkbox', PshCheckboxComponent, CHECKBOX_CONFIG],
  ['collapse', PshCollapseComponent, COLLAPSE_CONFIG],
  ['dropdown', PshDropdownComponent, DROPDOWN_CONFIG],
  ['horizontal-card', PshHorizontalCardComponent, HORIZONTAL_CARD_CONFIG],
  ['info-card', PshInfoCardComponent, INFO_CARD_CONFIG],
  ['input', PshInputComponent, INPUT_CONFIG],
  ['menu', PshMenuComponent, MENU_CONFIG],
  ['modal', PshModalComponent, MODAL_CONFIG],
  ['pagination', PshPaginationComponent, PAGINATION_CONFIG],
  ['progressbar', PshProgressbarComponent, PROGRESSBAR_CONFIG],
  ['radio', PshRadioComponent, RADIO_CONFIG],
  ['radio-group', PshRadioGroupComponent, RADIO_GROUP_CONFIG],
  ['select', PshSelectComponent, SELECT_CONFIG],
  ['sidebar', PshSidebarComponent, SIDEBAR_CONFIG],
  ['spinloader', PshSpinLoaderComponent, SPINLOADER_CONFIG],
  ['stat-card', PshStatCardComponent, STAT_CARD_CONFIG],
  ['state-flow-indicator', PshStateFlowIndicatorComponent, STATE_FLOW_INDICATOR_CONFIG],
  ['stepper', PshStepperComponent, STEPPER_CONFIG],
  ['switch', PshSwitchComponent, SWITCH_CONFIG],
  ['tab-bar', PshTabBarComponent, TAB_BAR_CONFIG],
  ['table', PshTableComponent, TABLE_CONFIG],
  ['tabs', PshTabsComponent, TABS_CONFIG],
  ['tag', PshTagComponent, TAG_CONFIG],
  ['textarea', PshTextareaComponent, TEXTAREA_CONFIG],
  ['tooltip', PshTooltipComponent, TOOLTIP_CONFIG],
];

describe('component config tokens', () => {
  describe('every declared default is read by the component', () => {
    it.each(CASES)('%s', (_name, component, token) => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [component] });
      const defaults = TestBed.inject(token) as Record<string, unknown>;
      const declared = Object.keys(defaults);
      expect(declared.length).toBeGreaterThan(0);

      const read = new Set<string>();
      const spy = new Proxy(defaults, {
        get(target, key) {
          read.add(String(key));
          return Reflect.get(target, key);
        },
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [component],
        providers: [{ provide: token, useValue: spy }],
      });
      const fixture = TestBed.createComponent(component);

      // Some keys are read inside a computed (`stepper.ariaLabels`), which does not run
      // until something reads it. Pull on every signal the instance exposes so those
      // count as read — otherwise the test reports a key that is wired perfectly well.
      for (const value of Object.values(fixture.componentInstance as object)) {
        if (isSignal(value)) {
          try {
            value();
          } catch {
            // a computed that needs a required input; not what this test is about
          }
        }
      }

      // A key nobody reads is a default an application can set with no effect.
      expect(declared.filter(key => !read.has(key))).toEqual([]);
    });
  });

  describe('provideHelix', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('carries a component default all the way to the component', () => {
      TestBed.configureTestingModule({
        imports: [PshButtonComponent],
        providers: [provideHelix({ components: { button: { size: 'large' } } })],
      });
      const fixture = TestBed.createComponent(PshButtonComponent);
      expect(fixture.componentInstance.size()).toBe('large');
    });

    it('leaves the keys it was not given at the library default', () => {
      TestBed.configureTestingModule({
        imports: [PshButtonComponent],
        providers: [provideHelix({ components: { button: { size: 'large' } } })],
      });
      const fixture = TestBed.createComponent(PshButtonComponent);
      expect(fixture.componentInstance.appearance()).toBe('solid');
      expect(fixture.componentInstance.color()).toBe('primary');
    });

    it('configures several components in one call', () => {
      TestBed.configureTestingModule({
        imports: [PshTagComponent, PshAlertComponent],
        providers: [
          provideHelix({
            components: { tag: { size: 'large' }, alert: { closable: true } },
          }),
        ],
      });
      expect(TestBed.createComponent(PshTagComponent).componentInstance.size()).toBe('large');
      expect(TestBed.createComponent(PshAlertComponent).componentInstance.closable()).toBe(true);
    });

    it('passes theme options through, without the customerContext key', () => {
      TestBed.configureTestingModule({
        providers: [provideHelix({ theme: { targetContrast: 'AAA' } })],
      });
      expect(TestBed.inject(PSH_THEME_OPTIONS)).toEqual({ targetContrast: 'AAA' });
    });

    it('registers the customer context service when one is given', () => {
      class Brand {
        primaryColor = () => '#123456';
        secondaryColor = () => '#654321';
      }
      TestBed.configureTestingModule({
        providers: [provideHelix({ theme: { customerContext: Brand } })],
      });
      expect(TestBed.inject(CUSTOMER_CONTEXT_SERVICE)).toBeInstanceOf(Brand);
    });

    it('provides nothing when called with nothing', () => {
      TestBed.configureTestingModule({ providers: [provideHelix()] });
      expect(TestBed.inject(PSH_THEME_OPTIONS, null)).toBeNull();
    });
  });

  describe('the narrower providers', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('provideHelixTheme sets the theme alone', () => {
      TestBed.configureTestingModule({ providers: [provideHelixTheme({ targetContrast: 'AAA' })] });
      expect(TestBed.inject(PSH_THEME_OPTIONS)).toEqual({ targetContrast: 'AAA' });
    });

    it('provideHelixComponentDefaults sets component defaults alone', () => {
      TestBed.configureTestingModule({
        imports: [PshTagComponent],
        providers: [provideHelixComponentDefaults({ tag: { closable: true } })],
      });
      expect(TestBed.createComponent(PshTagComponent).componentInstance.closable()).toBe(true);
    });

    it('provideHelixToast sets the toast config alone', () => {
      TestBed.configureTestingModule({ providers: [provideHelixToast({ maxToasts: 2 })] });
      expect(TestBed.inject(TOAST_CONFIG).maxToasts).toBe(2);
    });
  });

  describe('a prose default may be a function', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('reads it, rather than storing what it returned once', () => {
      const language = signal('fr');
      const placeholder = () =>
        language() === 'fr' ? 'Sélectionner une option' : 'Select an option';

      TestBed.configureTestingModule({
        imports: [PshSelectComponent],
        providers: [provideHelix({ components: { select: { placeholder } } })],
      });
      const fixture = TestBed.createComponent(PshSelectComponent);
      fixture.componentRef.setInput('options', []);

      expect(fixture.componentInstance.placeholder()).toBe('Sélectionner une option');

      // The whole reason the thunk form exists: an application that switches language
      // after the component is on screen.
      language.set('en');
      expect(fixture.componentInstance.placeholder()).toBe('Select an option');
    });

    it('still accepts a plain string, unchanged', () => {
      TestBed.configureTestingModule({
        imports: [PshSelectComponent],
        providers: [provideHelix({ components: { select: { placeholder: 'Choisir' } } })],
      });
      const fixture = TestBed.createComponent(PshSelectComponent);
      fixture.componentRef.setInput('options', []);

      expect(fixture.componentInstance.placeholder()).toBe('Choisir');
    });

    it('lets the element override whatever the configuration says', () => {
      TestBed.configureTestingModule({
        imports: [PshSelectComponent],
        providers: [provideHelix({ components: { select: { placeholder: () => 'from config' } } })],
      });
      const fixture = TestBed.createComponent(PshSelectComponent);
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('placeholder', 'from the element');

      expect(fixture.componentInstance.placeholder()).toBe('from the element');
    });
  });

  describe('the token map', () => {
    it('names one token per component, and the same token the component injects', () => {
      TestBed.resetTestingModule();
      const byToken = new Map(CASES.map(([, , token]) => [token, true]));
      for (const token of Object.values(PSH_CONFIG_TOKENS)) {
        // toast has no component-level config test above: it is driven by its service.
        if (token === TOAST_CONFIG) continue;
        expect(byToken.has(token as InjectionToken<object>)).toBe(true);
      }
      expect(Object.keys(PSH_CONFIG_TOKENS).length).toBe(CASES.length + 1);
    });
  });
});
