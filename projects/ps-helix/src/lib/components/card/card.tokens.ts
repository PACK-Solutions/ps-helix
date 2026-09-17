/**
 * Application-wide defaults for `psh-card`.
 *
 * Provide it to set a default once for every psh-card in the application:
 *
 *     provideHelix({ components: { card: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { CardConfig } from './card.types';

const CARD_DEFAULTS = {
  appearance: 'flat',
  color: 'neutral',
  density: 'normal',
  hoverable: false,
  interactive: false,
  bodyPadding: true,
  showHeaderDivider: true,
  showFooterDivider: true,
  showActionsDivider: true,
  actionsAlignment: 'right',
} satisfies Partial<CardConfig>;

export const CARD_CONFIG = new InjectionToken<Partial<CardConfig>>('CARD_CONFIG', {
  factory: () => CARD_DEFAULTS,
});
