/**
 * Application-wide defaults for `psh-info-card`.
 *
 * Provide it to set a default once for every psh-info-card in the application:
 *
 *     provideHelix({ components: { infoCard: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { InfoCardConfig } from './info-card.types';

const INFO_CARD_DEFAULTS = {
  appearance: 'outline',
  icon: 'circle-dashed',
  hoverable: false,
  interactive: false,
  copyable: false,
  copyButtonLabel: 'Copier',
  copyFeedbackText: 'Copié',
  autoFullWidthOnMobile: true,
} satisfies Partial<InfoCardConfig>;

export const INFO_CARD_CONFIG = new InjectionToken<Partial<InfoCardConfig>>('INFO_CARD_CONFIG', {
  factory: () => INFO_CARD_DEFAULTS,
});
