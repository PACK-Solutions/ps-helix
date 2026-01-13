export type ToastType = 'info' | 'success' | 'warning' | 'danger';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface Toast {
  id?: string;
  message: string;
  type: ToastType;
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
}
