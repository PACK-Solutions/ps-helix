import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { Toast, ToastType } from './toast.types';
import { PshToastService } from './toast.service';
import { TOAST_CONFIG } from './toast.tokens';

@Component({
  selector: 'psh-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'handleEscapeKey()'
  }
})
export class PshToastComponent implements OnDestroy {
  private toastService = inject(PshToastService);
  public config = inject(TOAST_CONFIG);

  private timeoutMap = new Map<string, number>();
  private scheduledToastIds = new Set<string>();

  readonly toasts = this.toastService.toasts;
  readonly position = this.toastService.position;

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

  handleEscapeKey(): void {
    const toasts = this.toasts();
    const lastToast = toasts[toasts.length - 1];
    if (lastToast?.id) {
      this.handleDismiss(lastToast.id);
    }
  }

  handleDismiss(id: string | undefined): void {
    if (id) {
      this.clearTimeout(id);
      this.toastService.remove(id);
    }
  }

  handleMouseEnter(id: string): void {
    if (this.config.pauseOnHover) {
      this.clearTimeout(id);
    }
  }

  handleMouseLeave(id: string): void {
    if (this.config.pauseOnHover) {
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

  getCloseButtonAriaLabel(toast: Toast): string {
    return toast.closeButtonAriaLabel ?? this.config.closeButtonAriaLabel ?? 'Close notification';
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

export { ToastComponent } from './toast.compat';
