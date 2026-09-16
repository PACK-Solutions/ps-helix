/**
 * Application-wide defaults for `psh-textarea`.
 *
 * Provide it to set a default once for every psh-textarea in the application:
 *
 *     provideHelix({ components: { textarea: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { TextareaConfig } from './textarea.types';

const TEXTAREA_DEFAULTS = {
  appearance: 'outline',
  size: 'medium',
  resize: 'vertical',
  rows: 4,
  required: false,
  fullWidth: false,
  showLabel: true,
  showCharacterCount: false,
  autoSize: false,
  label: '',
  placeholder: '',
} satisfies Partial<TextareaConfig>;

export const TEXTAREA_CONFIG = new InjectionToken<Partial<TextareaConfig>>('TEXTAREA_CONFIG', {
  factory: () => TEXTAREA_DEFAULTS,
});
