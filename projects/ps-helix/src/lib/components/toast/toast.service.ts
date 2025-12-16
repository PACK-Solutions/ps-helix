import { Injectable, inject, signal } from '@angular/core';
import { TOAST_CONFIG, TOAST_STYLES } from './toast.component';
import { Toast, ToastPosition, ToastConfig } from './toast.types';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  private _position = signal<ToastPosition>('top-right');
  private config = inject(TOAST_CONFIG);
  private customStyles = inject(TOAST_STYLES, { optional: true }) ?? [];

  readonly toasts = this._toasts.asReadonly();
  readonly position = this._position.asReadonly();

  /**
   * Récupère la configuration du toast
   */
  getConfig(): Partial<ToastConfig> {
    return this.config;
  }

  /**
   * Récupère les styles personnalisés
   */
  getCustomStyles(): Record<string, string>[] {
    return this.customStyles;
  }

  /**
   * Affiche un nouveau toast
   */
  show(toast: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID();
    const newToast: Toast = {
      ...toast,
      id,
      type: toast.type || 'info',
      duration: toast.duration ?? this.config.duration ?? 5000
    };

    // Limiter le nombre de toasts
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

  /**
   * Supprime un toast
   */
  remove(id: string) {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  /**
   * Affiche un toast d'information
   */
  info(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'info', ...options });
  }

  /**
   * Affiche un toast de succès
   */
  success(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'success', ...options });
  }

  /**
   * Affiche un toast d'avertissement
   */
  warning(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'warning', ...options });
  }

  /**
   * Affiche un toast d'erreur
   */
  error(message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    return this.show({ message, type: 'danger', ...options });
  }

  /**
   * Change la position des toasts
   */
  setPosition(position: ToastPosition) {
    this._position.set(position);
  }
}