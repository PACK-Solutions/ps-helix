import { ChangeDetectionStrategy, Component, computed, inject, input, model, signal, output, effect, InjectionToken } from '@angular/core';
import { TooltipPosition, TooltipConfig } from './tooltip.types';

/**
 * Token d'injection pour la configuration globale des tooltips
 */
export const TOOLTIP_CONFIG = new InjectionToken<Partial<TooltipConfig>>('TOOLTIP_CONFIG', {
  factory: () => ({
    variant: 'dark',
    position: 'top',
    showDelay: 200,
    hideDelay: 100,
    maxWidth: 200,
  })
});

@Component({
  selector: 'psh-tooltip',
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
    '[style.display]': '"inline-block"',
    '[style.position]': '"relative"',
  }
})
export class PshTooltipComponent {
  private config = inject(TOOLTIP_CONFIG) as Required<TooltipConfig>;

  // Model inputs with defaults from config
  variant = model<'light' | 'dark'>(this.config.variant ?? 'dark');
  position = model<TooltipPosition>(this.config.position ?? 'top');
  showDelay = model(this.config.showDelay ?? 200);
  hideDelay = model(this.config.hideDelay ?? 100);
  maxWidth = model(this.config.maxWidth ?? 200);

  // Regular inputs
  content = input.required<string>();
  disabled = input(false);
  ariaLabel = input<string>();
  id = input<string>(this.generateUniqueId());

  // Outputs
  showed = output<void>();
  hidden = output<void>();

  // State (signal)
  isVisible = signal(false);

  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  // Computed values
  tooltipId = computed(() => `${this.id()}-tooltip`);
  triggerId = computed(() => `${this.id()}-trigger`);

  constructor() {
    effect(() => {
      if (this.isVisible()) {
        this.showed.emit();
      } else {
        this.hidden.emit();
      }
    });
  }

  show(): void {
    if (this.disabled()) return;

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (!this.isVisible() && !this.showTimeout) {
      this.showTimeout = setTimeout(() => {
        this.isVisible.set(true);
        this.showTimeout = null;
      }, this.showDelay());
    }
  }

  hide(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (this.isVisible() && !this.hideTimeout) {
      this.hideTimeout = setTimeout(() => {
        this.isVisible.set(false);
        this.hideTimeout = null;
      }, this.hideDelay());
    }
  }

  ngOnDestroy(): void {
    if (this.showTimeout) clearTimeout(this.showTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
  }

  private generateUniqueId(): string {
    return `psh-tooltip-${Math.random().toString(36).substr(2, 9)}`;
  }
}