import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeSize, BadgeVariant, BadgePosition, BadgeDisplayType } from './badge.types';

const DEFAULT_CONFIG = {
  variant: 'primary' as BadgeVariant,
  size: 'medium' as BadgeSize,
  displayType: 'text' as BadgeDisplayType,
  max: 99,
  showZero: false,
  position: 'top-right' as BadgePosition
};

@Component({
  selector: 'psh-badge',
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshBadgeComponent<T = number> {

  readonly variant = input<BadgeVariant>(DEFAULT_CONFIG.variant);
  readonly size = input<BadgeSize>(DEFAULT_CONFIG.size);
  readonly displayType = input<BadgeDisplayType>(DEFAULT_CONFIG.displayType);
  readonly content = input<string>('');
  readonly visible = input(true);
  readonly value = input<T>();
  readonly max = input(DEFAULT_CONFIG.max);
  readonly showZero = input(DEFAULT_CONFIG.showZero);
  readonly position = input<BadgePosition>(DEFAULT_CONFIG.position);
  readonly overlap = input(false);
  readonly ariaLabel = input<string>();
  readonly formatter = input<((value: T) => string) | undefined>();

  readonly badgeClick = output<void>();
  readonly valueChange = output<T>();

  readonly computedRole = computed(() =>
    this.displayType() === 'counter' ? 'status' : 'img'
  );

  readonly computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    const content = this.content();
    if (content) return content;

    return this.displayValue();
  });

  readonly state = computed(() => {
    if (!this.visible()) return 'hidden';
    if (this.overlap()) return 'overlap';
    return this.displayType();
  });

  private readonly isDot = computed(() => this.displayType() === 'dot');
  private readonly isCounter = computed(() => this.displayType() === 'counter');
  private readonly hasValue = computed(() => this.value() !== undefined);

  private readonly shouldDisplay = computed(() => {
    const currentValue = this.value();
    if (typeof currentValue !== 'number') return true;
    return currentValue > 0 || this.showZero();
  });

  private readonly formattedCustomValue = computed(() => {
    const formatter = this.formatter();
    const currentValue = this.value();

    if (!formatter || currentValue === null || currentValue === undefined) {
      return null;
    }

    return formatter(currentValue);
  });

  private readonly formattedNumericValue = computed(() => {
    const currentValue = this.value();

    if (typeof currentValue !== 'number') {
      return currentValue !== undefined ? String(currentValue) : '';
    }

    if (!this.shouldDisplay()) {
      return this.content() || '';
    }

    const maxValue = this.max();
    return currentValue > maxValue ? `${maxValue}+` : `${currentValue}`;
  });

  readonly displayValue = computed(() => {
    if (this.isDot()) {
      return '';
    }

    if (!this.isCounter() || !this.hasValue()) {
      return this.content();
    }

    const customFormatted = this.formattedCustomValue();
    if (customFormatted !== null) {
      return customFormatted;
    }

    return this.formattedNumericValue();
  });

  onBadgeClick(): void {
    this.badgeClick.emit();
  }
}
