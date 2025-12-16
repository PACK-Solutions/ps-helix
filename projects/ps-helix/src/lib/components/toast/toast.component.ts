import { ChangeDetectionStrategy, Component, computed, effect, inject, InjectionToken, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastType, ToastConfig } from './toast.types';
import { ToastService } from './toast.service';

/**
 * Token d'injection pour la configuration globale des toasts
 */
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

/**
 * Token d'injection pour les styles personnalisés
 */
export const TOAST_STYLES = new InjectionToken<Record<string, string>[]>('TOAST_STYLES', {
  factory: () => []
});

@Component({
  selector: 'psh-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnDestroy {
  private toastService = inject(ToastService);
  public config = inject(TOAST_CONFIG);
  private styles = inject(TOAST_STYLES, { optional: true }) ?? [];

  private pausedToastIds = signal<Set<string>>(new Set());
  private timeoutMap = new Map<string, number>();
  private scheduledToastIds = new Set<string>();

  readonly toasts = this.toastService.toasts;
  readonly position = this.toastService.position;
  readonly customStyles = computed(() => Object.assign({}, ...this.styles));

  constructor() {
    effect(() => {
      const currentToasts = this.toasts();

      currentToasts.forEach(toast => {
        if (toast.id && !this.scheduledToastIds.has(toast.id)) {
          this.scheduledToastIds.add(toast.id);

          if (toast.duration && toast.duration > 0) {
            this.scheduleRemoval(toast.id, toast.duration);
          }
        }
      });

      const currentToastIds = new Set(currentToasts.map(t => t.id).filter(Boolean) as string[]);
      this.scheduledToastIds.forEach(id => {
        if (!currentToastIds.has(id)) {
          this.scheduledToastIds.delete(id);
        }
      });
    });
  }

  handleDismiss(id: string | undefined): void {
    if (id) {
      this.clearTimeout(id);
      this.toastService.remove(id);
    }
  }

  handleMouseEnter(id: string): void {
    if (this.config.pauseOnHover) {
      this.pausedToastIds.update(set => {
        const newSet = new Set(set);
        newSet.add(id);
        return newSet;
      });
      this.clearTimeout(id);
    }
  }

  handleMouseLeave(id: string): void {
    if (this.config.pauseOnHover) {
      this.pausedToastIds.update(set => {
        const newSet = new Set(set);
        newSet.delete(id);
        return newSet;
      });
      const toast = this.toasts().find(t => t.id === id);
      if (toast?.duration && toast.duration > 0) {
        this.scheduleRemoval(id, toast.duration);
      }
    }
  }

  getDefaultIcon(type: ToastType): string {
    const icons: Record<ToastType, string> = {
      info: 'info',
      success: 'check-circle',
      warning: 'warning',
      danger: 'warning-octagon'
    };
    return icons[type] || 'info';
  }

  shouldShowCloseButton(toast: Toast): boolean {
    if (toast.showCloseButton !== undefined) {
      return toast.showCloseButton;
    }
    return this.config.showCloseButton !== false;
  }

  private scheduleRemoval(id: string, duration: number): void {
    this.clearTimeout(id);
    const timeoutId = window.setTimeout(() => {
      this.toastService.remove(id);
      this.timeoutMap.delete(id);
    }, duration);
    this.timeoutMap.set(id, timeoutId);
  }

  private clearTimeout(id: string): void {
    const timeoutId = this.timeoutMap.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      this.timeoutMap.delete(id);
    }
  }

  ngOnDestroy(): void {
    this.timeoutMap.forEach(timeoutId => {
      window.clearTimeout(timeoutId);
    });
    this.timeoutMap.clear();
    this.scheduledToastIds.clear();
  }
}