/**
 * Application-wide defaults for `psh-horizontal-card`.
 *
 * Provide it to set a default once for every psh-horizontal-card in the application:
 *
 *     provideHelix({ components: { horizontalCard: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { HorizontalCardConfig } from './horizontal-card.types';

const HORIZONTAL_CARD_DEFAULTS = {
  appearance: 'elevated',
  hoverable: false,
  interactive: false,
  sideWidth: 'var(--psh-size-48)',
  gap: 'var(--psh-spacing-md)',
  sidePadding: '0',
  contentPadding: 'var(--psh-spacing-md)',
  mobileHeight: 'var(--psh-size-48)',
} satisfies Partial<HorizontalCardConfig>;

export const HORIZONTAL_CARD_CONFIG = new InjectionToken<Partial<HorizontalCardConfig>>('HORIZONTAL_CARD_CONFIG', {
  factory: () => HORIZONTAL_CARD_DEFAULTS,
});
