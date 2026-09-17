import { ChangeDetectionStrategy, Component, computed, input, output , inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeSize, BadgePosition, BadgeDisplayType } from './badge.types';
import { PshColor } from '../../types/semantic.types';
import { BADGE_CONFIG } from './badge.tokens';

const DEFAULT_CONFIG = {
  color: 'primary' as PshColor,
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
  private readonly config = inject(BADGE_CONFIG);


  readonly color = input<PshColor>(this.config.color ?? DEFAULT_CONFIG.color);

  /**
   * Disabled is a state, not a colour. It used to be the seventh value of the colour union
   * — `variant="disabled"` — which meant a disabled badge could not also be a danger
   * badge, and which is not how `disabled` is spelled anywhere else in the library.
   */
  readonly disabled = input(this.config.disabled ?? false);
  readonly size = input<BadgeSize>(this.config.size ?? DEFAULT_CONFIG.size);
  readonly displayType = input<BadgeDisplayType>(this.config.displayType ?? DEFAULT_CONFIG.displayType);
  readonly content = input<string>('');
  readonly visible = input(true);
  readonly value = input<T>();
  readonly max = input(this.config.max ?? DEFAULT_CONFIG.max);
  readonly showZero = input(this.config.showZero ?? DEFAULT_CONFIG.showZero);
  readonly position = input<BadgePosition>(this.config.position ?? DEFAULT_CONFIG.position);
  readonly overlap = input(this.config.overlap ?? false);
  readonly ariaLabel = input<string>();
  readonly formatter = input<((value: T) => string) | undefined>();

  readonly clicked = output<void>();

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
    this.clicked.emit();
  }
}
