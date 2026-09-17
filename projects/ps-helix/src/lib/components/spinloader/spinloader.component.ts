import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal, InjectionToken, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SpinLoaderVariant, SpinLoaderSize, SpinLoaderColor, SpinLoaderConfig } from './spinloader.types';

const SPINLOADER_DEFAULTS = {
  variant: 'circle',
  size: 'medium',
  color: 'primary'
} satisfies Partial<SpinLoaderConfig>;

export const SPINLOADER_CONFIG = new InjectionToken<Partial<SpinLoaderConfig>>('SPINLOADER_CONFIG', {
  factory: () => SPINLOADER_DEFAULTS,
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
    '[class.psh-small]': 'size() === "small"',
    '[class.psh-large]': 'size() === "large"',
    '[class.psh-reduce-motion]': 'reduceMotion()',
  }
})
export class PshSpinLoaderComponent {
  private config = inject(SPINLOADER_CONFIG);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  variant = input<SpinLoaderVariant>(this.config.variant ?? 'circle');
  size = input<SpinLoaderSize>(this.config.size ?? 'medium');
  color = input<SpinLoaderColor>(this.config.color ?? 'primary');
  label = input<string>();
  ariaLabel = input<string>('Chargement en cours');
  ariaLive = input<'polite' | 'assertive'>('polite');

  reduceMotion = signal(false);

  constructor() {
    // Read the media query once at construction so the very first browser render is
    // already correct, and keep the listener for later OS-level changes. Not an effect:
    // there is no signal dependency to track, and the listener needs explicit teardown.
    if (!this.isBrowser) return;

    const view = this.document.defaultView;
    if (!view || typeof view.matchMedia !== 'function') return;

    const mediaQuery = view.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduceMotion.set(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => this.reduceMotion.set(e.matches);
    mediaQuery.addEventListener('change', handler);
    this.destroyRef.onDestroy(() => mediaQuery.removeEventListener('change', handler));
  }
}
