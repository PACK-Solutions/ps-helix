import { Injectable, inject, signal } from '@angular/core';
import { TOAST_CONFIG } from './toast.tokens';
import { Toast, ToastPosition } from './toast.types';

@Injectable({
  providedIn: 'root'
})
export class PshToastService {
  private _toasts = signal<Toast[]>([]);
  private _position = signal<ToastPosition>('top-right');
  private config = inject(TOAST_CONFIG);

  readonly toasts = this._toasts.asReadonly();
  readonly position = this._position.asReadonly();

  show(toast: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID();
    const newToast: Toast = {
      ...toast,
      id,
      type: toast.type || 'info',
      duration: toast.duration ?? this.config.duration ?? 5000
    };

    const maxToasts = this.config.maxToasts ?? 5;
    this._toasts.update(toasts => {
      const currentToasts = [...toasts];
      while (currentToasts.length >= maxToasts) {
        currentToasts.shift();
      }
      return [...currentToasts, newToast];
    });

    return id;
  }

  remove(id: string) {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  info(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'info', ...options });
  }

  success(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'success', ...options });
  }

  warning(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'warning', ...options });
  }

  error(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'danger', ...options });
  }

  danger(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'danger', ...options });
  }

  setPosition(position: ToastPosition) {
    this._position.set(position);
  }
}

/** @deprecated Use PshToastService instead */
export const ToastService = PshToastService;
