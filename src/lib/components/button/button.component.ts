import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonVariant, ButtonSize, ButtonIconPosition } from '../../types/button.types';
import { ButtonService } from './button.service';
import { BUTTON_CONFIG } from './button.config';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ButtonService]
})
export class LibButtonComponent {
  private buttonService = inject(ButtonService);
  private config = inject(BUTTON_CONFIG);

  // Model inputs with defaults from config
  variant = model.required<ButtonVariant>();
  size = model<ButtonSize>(this.config.size ?? 'medium');
  disabled = model(this.config.disabled ?? false);
  loading = model(this.config.loading ?? false);
  fullWidth = model(this.config.fullWidth ?? false);
  showLabel = model(this.config.showLabel ?? false);
  iconPosition = model<ButtonIconPosition>(this.config.iconPosition ?? 'left');

  // Regular inputs
  icon = input<string>();
  ariaLabel = input<string>();

  // Outputs
  clicked = output<MouseEvent>();
  sizeChange = output<ButtonSize>();
  variantChange = output<ButtonVariant>();
  disabledChange = output<boolean>();

  // Computed values
  customStyles = computed(() => {
    const styles = this.buttonService.getCustomStyles();
    return Object.assign({}, ...styles);
  });

  computedAriaLabel = computed(() => 
    this.ariaLabel() || this.buttonService.generateAriaLabel(this.variant(), this.iconPosition())
  );

  shouldShowContent = computed(() => 
    this.buttonService.shouldShowLabel(this.iconPosition())
  );

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}