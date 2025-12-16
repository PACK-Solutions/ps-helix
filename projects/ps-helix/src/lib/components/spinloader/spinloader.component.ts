import { ChangeDetectionStrategy, Component, effect, inject, input, signal, InjectionToken } from '@angular/core';
import { SpinLoaderVariant, SpinLoaderSize, SpinLoaderColor, SpinLoaderConfig } from './spinloader.types';

export const SPINLOADER_CONFIG = new InjectionToken<Partial<SpinLoaderConfig>>('SPINLOADER_CONFIG', {
  factory: () => ({
    variant: 'circle',
    size: 'medium',
    color: 'primary'
  })
});

@Component({
  selector: 'psh-spinloader',
  imports: [],
  templateUrl: './spinloader.component.html',
  styleUrls: ['./spinloader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'status',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-live]': 'ariaLive()',
    '[attr.aria-busy]': 'true',
    '[attr.data-state]': 'variant()',
    '[class.small]': 'size() === "small"',
    '[class.large]': 'size() === "large"',
    '[class.reduce-motion]': 'reduceMotion()',
  }
})
export class PshSpinLoaderComponent {
  private config = inject(SPINLOADER_CONFIG);

  variant = input<SpinLoaderVariant>(this.config.variant ?? 'circle');
  size = input<SpinLoaderSize>(this.config.size ?? 'medium');
  color = input<SpinLoaderColor>(this.config.color ?? 'primary');
  label = input<string>();
  ariaLabel = input<string>('Chargement en cours');
  ariaLive = input<'polite' | 'assertive'>('polite');

  reduceMotion = signal(false);

  constructor() {
    effect(() => {
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reduceMotion.set(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => this.reduceMotion.set(e.matches);
        mediaQuery.addEventListener('change', handler);
      }
    });
  }
}
