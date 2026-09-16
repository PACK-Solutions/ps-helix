/**
 * Application-wide defaults for `psh-stat-card`.
 *
 * Provide it to set a default once for every psh-stat-card in the application:
 *
 *     provideHelix({ components: { statCard: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { StatCardConfig } from './stat-card.types';

const STAT_CARD_DEFAULTS = {
  appearance: 'elevated',
  layout: 'horizontal',
  hoverable: false,
  interactive: false,
  rowDirection: false,
} satisfies Partial<StatCardConfig>;

export const STAT_CARD_CONFIG = new InjectionToken<Partial<StatCardConfig>>('STAT_CARD_CONFIG', {
  factory: () => STAT_CARD_DEFAULTS,
});
