import { PshControlAppearance } from '../../types/semantic.types';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonColor, ButtonSize, ButtonIconPosition } from './button.types';
import { BUTTON_CONFIG } from './button.tokens';

@Component({
  selector: 'psh-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.psh-full-width]': 'fullWidth()',
    '(click)': 'onHostClick($event)',
  },
})
export class PshButtonComponent implements AfterContentChecked {
  private readonly config = inject(BUTTON_CONFIG);

  private elementRef = inject(ElementRef);
  private projectedText = signal<string | undefined>(undefined);

  appearance = input<PshControlAppearance>(this.config.appearance ?? 'solid');
  color = input<ButtonColor>(this.config.color ?? 'primary');
  size = input<ButtonSize>(this.config.size ?? 'medium');
  disabled = input(false);
  loading = input(false);
  fullWidth = input(this.config.fullWidth ?? false);
  iconPosition = input<ButtonIconPosition>(this.config.iconPosition ?? 'left');
  icon = input<string>();
  ariaLabel = input<string>();
  loadingText = input(this.config.loadingText ?? 'Loading...');
  disabledText = input(this.config.disabledText ?? 'This action is currently unavailable');
  iconOnlyText = input<string>();
  type = input<'button' | 'submit' | 'reset'>(this.config.type ?? 'button');

  clicked = output<MouseEvent>();
  disabledClicked = output<MouseEvent>();

  ngAfterContentChecked(): void {
    const button = this.elementRef.nativeElement.querySelector('button');
    if (button) {
      const ngContentElement = button.querySelector('.psh-button-content');
      if (ngContentElement) {
        const textContent = ngContentElement.textContent?.trim() || '';
        const currentProjectedText = this.projectedText();
        if (textContent && textContent !== currentProjectedText) {
          this.projectedText.set(textContent);
        } else if (!textContent && currentProjectedText) {
          this.projectedText.set(undefined);
        }
      }
    }
  }

  computedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    if (this.loading()) return this.loadingText();
    if (this.disabled()) return this.disabledText();
    if (this.iconPosition() === 'only') {
      return this.iconOnlyText() || 'Button';
    }
    const projected = this.projectedText();
    if (projected) return projected;
    return undefined;
  });

  state = computed(() => {
    if (this.disabled()) return 'disabled';
    if (this.loading()) return 'loading';
    return 'default';
  });


  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }

  onHostClick(event: MouseEvent): void {
    if (this.disabled() && !this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      this.disabledClicked.emit(event);
    }
  }
}