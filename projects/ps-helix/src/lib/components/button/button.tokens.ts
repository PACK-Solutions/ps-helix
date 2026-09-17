/**
 * Application-wide defaults for `psh-button`.
 *
 * Provide it to set a default once for every psh-button in the application:
 *
 *     provideHelix({ components: { button: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { ButtonConfig } from './button.types';

const BUTTON_DEFAULTS = {
  appearance: 'solid',
  color: 'primary',
  size: 'medium',
  type: 'button',
  iconPosition: 'left',
  fullWidth: false,
  loadingText: 'Loading...',
  disabledText: 'This action is currently unavailable',
} satisfies Partial<ButtonConfig>;

export const BUTTON_CONFIG = new InjectionToken<Partial<ButtonConfig>>('BUTTON_CONFIG', {
  factory: () => BUTTON_DEFAULTS,
});
