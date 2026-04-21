import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { ButtonAppearance, ButtonVariant, ButtonSize, ButtonIconPosition } from './button.types';

@Component({
  selector: 'psh-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.full-width]': 'fullWidth()',
  },
})
export class PshButtonComponent {
  appearance = input<ButtonAppearance>('filled');
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  disabled = input(false);
  loading = input(false);
  fullWidth = model(false);
  iconPosition = input<ButtonIconPosition>('left');
  icon = input<string>();
  ariaLabel = input<string>();
  loadingText = input('Loading...');
  disabledText = input('This action is currently unavailable');
  iconOnlyText = input<string>();
  type = input<'button' | 'submit' | 'reset'>('button');

  // Outputs
  clicked = output<MouseEvent>();

  // Computed values
  computedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    if (this.loading()) return this.loadingText();
    if (this.disabled()) return this.disabledText();
    if (this.iconPosition() === 'only') {
      return this.iconOnlyText() || 'Button';
    }
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
}