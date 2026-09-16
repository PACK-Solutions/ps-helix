/**
 * Application-wide defaults for `psh-dropdown`.
 *
 * Provide it to set a default once for every psh-dropdown in the application:
 *
 *     provideHelix({ components: { dropdown: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { DropdownConfig } from './dropdown.types';

const DROPDOWN_DEFAULTS = {
  appearance: 'solid',
  color: 'primary',
  size: 'medium',
  placement: 'bottom-start',
  iconOnly: false,
  disabled: false,
  label: 'Dropdown Menu',
} satisfies Partial<DropdownConfig>;

export const DROPDOWN_CONFIG = new InjectionToken<Partial<DropdownConfig>>('DROPDOWN_CONFIG', {
  factory: () => DROPDOWN_DEFAULTS,
});
