/**
 * Application-wide defaults for `psh-menu`.
 *
 * Provide it to set a default once for every psh-menu in the application:
 *
 *     provideHelix({ components: { menu: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { MenuConfig } from './menu.types';

const MENU_DEFAULTS = {
  mode: 'vertical',
  variant: 'default',
  collapsible: false,
} satisfies Partial<MenuConfig>;

export const MENU_CONFIG = new InjectionToken<Partial<MenuConfig>>('MENU_CONFIG', {
  factory: () => MENU_DEFAULTS,
});
