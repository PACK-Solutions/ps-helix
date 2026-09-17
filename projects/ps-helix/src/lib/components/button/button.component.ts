import { PshControlAppearance } from '../../types/semantic.types';
import { pshResolveConfigValue } from '../../utils/config-value';
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
  private readonly projectedText = signal<string | undefined>(undefined);

  readonly appearance = input<PshControlAppearance>(this.config.appearance ?? 'solid');
  readonly color = input<ButtonColor>(this.config.color ?? 'primary');
  readonly size = input<ButtonSize>(this.config.size ?? 'medium');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly fullWidth = input(this.config.fullWidth ?? false);
  readonly iconPosition = input<ButtonIconPosition>(this.config.iconPosition ?? 'left');
  readonly icon = input<string>();
  readonly ariaLabel = input<string>();
  readonly loadingTextInput = input<string | undefined>(undefined, { alias: 'loadingText' });
  readonly loadingText = computed(
    () => this.loadingTextInput() ?? pshResolveConfigValue(this.config.loadingText) ?? 'Loading...',
  );
  readonly disabledTextInput = input<string | undefined>(undefined, { alias: 'disabledText' });
  readonly disabledText = computed(
    () => this.disabledTextInput() ?? pshResolveConfigValue(this.config.disabledText) ?? 'This action is currently unavailable',
  );
  readonly iconOnlyText = input<string>();
  readonly type = input<'button' | 'submit' | 'reset'>(this.config.type ?? 'button');

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

  readonly computedAriaLabel = computed(() => {
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

  readonly state = computed(() => {
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