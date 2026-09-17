import { InjectionToken } from '@angular/core';
import { ToastConfig } from './toast.types';

const TOAST_DEFAULTS = {
  position: 'top-right',
  duration: 5000,
  maxToasts: 5,
  pauseOnHover: true,
  showIcon: true,
  showCloseButton: true,
  ariaLabel: 'Notifications',
} satisfies Partial<ToastConfig>;

export const TOAST_CONFIG = new InjectionToken<Partial<ToastConfig>>('TOAST_CONFIG', {
  factory: () => TOAST_DEFAULTS,
});
