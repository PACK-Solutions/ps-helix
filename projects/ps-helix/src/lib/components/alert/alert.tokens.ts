/**
 * Application-wide defaults for `psh-alert`.
 *
 * Provide it to set a default once for every psh-alert in the application:
 *
 *     provideHelix({ components: { alert: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { AlertConfig } from './alert.types';

const ALERT_DEFAULTS = {
  color: 'info',
  iconPosition: 'left',
  closable: false,
  size: 'medium',
  showIcon: true,
  labels: { dismiss: 'Dismiss alert' },
} satisfies Partial<AlertConfig>;

export const ALERT_CONFIG = new InjectionToken<Partial<AlertConfig>>('ALERT_CONFIG', {
  factory: () => ALERT_DEFAULTS,
});
