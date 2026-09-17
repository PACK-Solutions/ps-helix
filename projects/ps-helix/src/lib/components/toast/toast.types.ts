import { PshColor } from '../../types/semantic.types';
import { PshConfigValue } from '../../utils/config-value';
/**
 * @deprecated since 7.0.0 — use {@link PshColor}. Every component now shares one
 * semantic colour union, so this alias exists only to ease the migration.
 */
export type ToastType = PshColor;

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface Toast {
  id?: string;
  message: string;
  color: ToastType;
  duration?: number;
  icon?: string;
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
}

export interface ToastConfig {
  position: ToastPosition;
  duration: number;
  maxToasts: number;
  pauseOnHover: boolean;
  showIcon: boolean;
  showCloseButton: boolean;
  closeButtonAriaLabel?: string;
  /** Accessible name of the notification region */
  ariaLabel?: PshConfigValue<string>;
}
