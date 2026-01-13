import { InjectionToken } from '@angular/core';
import { ToastConfig } from './toast.types';

export const TOAST_CONFIG = new InjectionToken<Partial<ToastConfig>>('TOAST_CONFIG', {
  factory: () => ({
    position: 'top-right',
    duration: 5000,
    maxToasts: 5,
    pauseOnHover: true,
    showIcon: true,
    showCloseButton: true
  })
});
