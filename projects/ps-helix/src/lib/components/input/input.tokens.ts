/**
 * Application-wide defaults for `psh-input`.
 *
 * Provide it to set a default once for every psh-input in the application:
 *
 *     provideHelix({ components: { input: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { InputConfig } from './input.types';

const INPUT_DEFAULTS = {
  appearance: 'outline',
  size: 'medium',
  type: 'text',
  required: false,
  fullWidth: false,
  showLabel: true,
  label: '',
  placeholder: '',
} satisfies Partial<InputConfig>;

export const INPUT_CONFIG = new InjectionToken<Partial<InputConfig>>('INPUT_CONFIG', {
  factory: () => INPUT_DEFAULTS,
});
