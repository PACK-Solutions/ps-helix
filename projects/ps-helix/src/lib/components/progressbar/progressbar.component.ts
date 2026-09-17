import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, InjectionToken } from '@angular/core';
import { ProgressbarVariant, ProgressbarSize, ProgressbarMode, ProgressbarLabelPosition, ProgressbarConfig } from './progressbar.types';

const PROGRESSBAR_DEFAULTS = {
  value: 0,
  max: 100,
  color: 'primary',
  size: 'medium',
  showLabel: true,
  mode: 'default',
  labelPosition: 'top'
} satisfies Partial<ProgressbarConfig>;

export const PROGRESSBAR_CONFIG = new InjectionToken<Partial<ProgressbarConfig>>('PROGRESSBAR_CONFIG', {
  factory: () => PROGRESSBAR_DEFAULTS,
});

@Component({
  selector: 'psh-progressbar',
  imports: [],
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'progressbar-container',
    '[class.psh-small]': 'size() === "small"',
    '[class.psh-large]': 'size() === "large"',
    '[class.psh-label-bottom]': 'labelPosition() === "bottom"',
    '[class.psh-label-inline]': 'labelPosition() === "inline"',
    '[attr.data-state]': 'mode()',
    '[attr.aria-live]': '"polite"'
  }
})
export class PshProgressbarComponent {
  private config = inject(PROGRESSBAR_CONFIG);

  // Model inputs for two-way binding
  readonly value = input(this.config.value ?? 0);
  readonly max = input(this.config.max ?? 100);

  // Regular inputs
  readonly color = input<ProgressbarVariant>(this.config.color ?? 'primary');
  readonly size = input<ProgressbarSize>(this.config.size ?? 'medium');
  readonly showLabel = input(this.config.showLabel ?? true);
  readonly mode = input<ProgressbarMode>(this.config.mode ?? 'default');
  readonly label = input<string>();
  readonly labelPosition = input<ProgressbarLabelPosition>(this.config.labelPosition ?? 'top');
  readonly ariaLabel = input<string>();

  // Outputs
  completed = output<void>();
  thresholdReached = output<number>();

  // Computed values
  readonly percentage = computed(() => {
    const val = this.value();
    const maxVal = this.max();
    if (maxVal <= 0) return 0;
    return Math.min(100, Math.max(0, (val / maxVal) * 100));
  });

  readonly isIndeterminate = computed(() => this.mode() === 'indeterminate');
  readonly isStriped = computed(() => this.mode() === 'striped' || this.mode() === 'animated');
  readonly isAnimated = computed(() => this.mode() === 'animated');

  readonly computedAriaValueText = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    if (this.isIndeterminate()) {
      return this.label() || 'Loading...';
    }
    return `${Math.round(this.percentage())}%`;
  });

  readonly displayLabel = computed(() => {
    if (this.isIndeterminate()) {
      return this.label() || 'Loading...';
    }
    return this.label() || `${Math.round(this.percentage())}%`;
  });

  constructor() {
    let previousThreshold = -1;
    let hasCompleted = false;

    effect(() => {
      const percentage = this.percentage();
      const val = this.value();
      const maxVal = this.max();

      if (val >= maxVal && maxVal > 0 && !hasCompleted) {
        this.completed.emit();
        hasCompleted = true;
      }

      if (val < maxVal) {
        hasCompleted = false;
      }

      const thresholds = [25, 50, 75];
      for (const threshold of thresholds) {
        if (percentage >= threshold && previousThreshold < threshold) {
          this.thresholdReached.emit(threshold);
          previousThreshold = threshold;
        }
      }

      if (percentage < 25) {
        previousThreshold = -1;
      }
    });
  }
}