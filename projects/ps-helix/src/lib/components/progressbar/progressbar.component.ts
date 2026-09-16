import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, InjectionToken } from '@angular/core';
import { ProgressbarVariant, ProgressbarSize, ProgressbarMode, ProgressbarLabelPosition, ProgressbarConfig } from './progressbar.types';

export const PROGRESSBAR_CONFIG = new InjectionToken<Partial<ProgressbarConfig>>('PROGRESSBAR_CONFIG', {
  factory: () => ({
    value: 0,
    max: 100,
    variant: 'primary',
    size: 'medium',
    showLabel: true,
    mode: 'default',
    labelPosition: 'top'
  })
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
  value = input(this.config.value ?? 0);
  max = input(this.config.max ?? 100);

  // Regular inputs
  color = input<ProgressbarVariant>(this.config.color ?? 'primary');
  size = input<ProgressbarSize>(this.config.size ?? 'medium');
  showLabel = input(this.config.showLabel ?? true);
  mode = input<ProgressbarMode>(this.config.mode ?? 'default');
  label = input<string>();
  labelPosition = input<ProgressbarLabelPosition>(this.config.labelPosition ?? 'top');
  ariaLabel = input<string>();

  // Outputs
  completed = output<void>();
  thresholdReached = output<number>();

  // Computed values
  percentage = computed(() => {
    const val = this.value();
    const maxVal = this.max();
    if (maxVal <= 0) return 0;
    return Math.min(100, Math.max(0, (val / maxVal) * 100));
  });

  isIndeterminate = computed(() => this.mode() === 'indeterminate');
  isStriped = computed(() => this.mode() === 'striped' || this.mode() === 'animated');
  isAnimated = computed(() => this.mode() === 'animated');

  computedAriaValueText = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    if (this.isIndeterminate()) {
      return this.label() || 'Loading...';
    }
    return `${Math.round(this.percentage())}%`;
  });

  displayLabel = computed(() => {
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