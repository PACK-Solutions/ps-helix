/**
 * Application-wide defaults for `psh-badge`.
 *
 * Provide it to set a default once for every psh-badge in the application:
 *
 *     provideHelix({ components: { badge: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { BadgeConfig } from './badge.types';

const BADGE_DEFAULTS = {
  color: 'primary',
  size: 'medium',
  displayType: 'text',
  position: 'top-right',
  max: 99,
  showZero: false,
  overlap: false,
  disabled: false,
} satisfies Partial<BadgeConfig>;

export const BADGE_CONFIG = new InjectionToken<Partial<BadgeConfig>>('BADGE_CONFIG', {
  factory: () => BADGE_DEFAULTS,
});
