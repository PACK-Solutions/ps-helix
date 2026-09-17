/**
 * Application-wide defaults for `psh-collapse`.
 *
 * Provide it to set a default once for every psh-collapse in the application:
 *
 *     provideHelix({ components: { collapse: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { CollapseConfig } from './collapse.types';

const COLLAPSE_DEFAULTS = {
  appearance: 'flat',
  size: 'medium',
  icon: 'caret-down',
  maxHeight: 'auto',
  defaultHeaderText: 'Collapsible section',
  disableAnimation: false,
} satisfies Partial<CollapseConfig>;

export const COLLAPSE_CONFIG = new InjectionToken<Partial<CollapseConfig>>('COLLAPSE_CONFIG', {
  factory: () => COLLAPSE_DEFAULTS,
});
