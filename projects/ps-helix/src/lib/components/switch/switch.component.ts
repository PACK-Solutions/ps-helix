import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  viewChild,
  InjectionToken,
  effect
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SwitchSize, SwitchConfig } from './switch.types';

/**
 * Token d'injection pour la configuration globale des switches
 */
export const SWITCH_CONFIG = new InjectionToken<Partial<SwitchConfig>>('SWITCH_CONFIG', {
  factory: () => ({
    checked: false,
    disabled: false,
    required: false,
    size: 'medium',
    labelPosition: 'right'
  })
});

/**
 * Token d'injection pour les styles personnalisés
 */
export const SWITCH_STYLES = new InjectionToken<Record<string, string>[]>('SWITCH_STYLES', {
  factory: () => []
});

@Component({
  selector: 'psh-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PshSwitchComponent,
    multi: true
  }],
  host: {
    '[class.switch-wrapper]': 'true',
    '[class.switch-disabled]': 'disabled()',
    '[class.switch-error]': '!!error()',
    '[class.switch-success]': '!!success()'
  }
})
export class PshSwitchComponent implements ControlValueAccessor {
  private config = inject(SWITCH_CONFIG);
  private styles = inject(SWITCH_STYLES, { optional: true }) ?? [];
  private uniqueId = `switch-${crypto.randomUUID()}`;

  private switchInput = viewChild<any>('switchInput');

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  // Model inputs with defaults from config
  checked = model(this.config.checked ?? false);
  disabled = model(this.config.disabled ?? false);
  required = model(this.config.required ?? false);
  size = model<SwitchSize>(this.config.size ?? 'medium');
  labelPosition = model<'left' | 'right'>(this.config.labelPosition ?? 'right');

  // Regular inputs
  label = input('');
  error = input('');
  success = input('');
  ariaLabel = input<string>();
  name = input<string>();
  id = input<string>(this.uniqueId);

  // Outputs
  checkedChange = output<boolean>();

  // Computed values
  computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    const labelText = this.label();
    if (labelText) return labelText;

    return 'Switch';
  });

  customStyles = computed(() => Object.assign({}, ...this.styles));

  // Computed helpers publics
  readonly isChecked = computed(() => this.checked());
  readonly isDisabled = computed(() => this.disabled());
  readonly hasError = computed(() => !!this.error());
  readonly hasSuccess = computed(() => !!this.success());

  // IDs uniques pour l'accessibilité
  errorId = computed(() => this.error() ? `${this.id()}-error` : null);
  successId = computed(() => this.success() ? `${this.id()}-success` : null);
  describedBy = computed(() => {
    const ids = [this.errorId(), this.successId()].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : null;
  });

  constructor() {
    effect(() => {
      if (this.checked()) {
        this.onChange(true);
      } else {
        this.onChange(false);
      }
    });
  }

  toggle(): void {
    if (!this.disabled()) {
      this.checked.update(v => !v);
      this.onTouched();
      this.checkedChange.emit(this.checked());
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checked.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Méthodes publiques pour contrôle programmatique
  focus(): void {
    const input = this.switchInput();
    if (input?.nativeElement) {
      input.nativeElement.focus();
    }
  }

  blur(): void {
    const input = this.switchInput();
    if (input?.nativeElement) {
      input.nativeElement.blur();
    }
  }
}