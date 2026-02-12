import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
  signal,
  viewChild,
  InjectionToken
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SwitchSize, SwitchConfig } from './switch.types';

export const SWITCH_CONFIG = new InjectionToken<Partial<SwitchConfig>>('SWITCH_CONFIG', {
  factory: () => ({
    checked: false,
    disabled: false,
    required: false,
    size: 'medium',
    labelPosition: 'right'
  })
});

@Component({
  selector: 'psh-switch',
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
  private uniqueId = `switch-${crypto.randomUUID()}`;

  private switchInput = viewChild<ElementRef<HTMLInputElement>>('switchInput');

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  // CVA-managed state: plain signals + manual @Input/@Output to prevent
  // auto-emission during writeValue()/setDisabledState().
  checked = signal(this.config.checked ?? false);
  @Input('checked') set checkedInput(v: boolean) { this.checked.set(v); }

  disabled = signal(this.config.disabled ?? false);
  @Input('disabled') set disabledInput(v: boolean) { this.disabled.set(v); }

  // Outputs — EventEmitter to decouple from signal writes.
  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() disabledChange = new EventEmitter<boolean>();

  // Configuration inputs (not CVA-managed, not written internally)
  required = input(this.config.required ?? false);
  size = input<SwitchSize>(this.config.size ?? 'medium');
  labelPosition = input<'left' | 'right'>(this.config.labelPosition ?? 'right');

  // Regular inputs
  label = input('');
  error = input('');
  success = input('');
  ariaLabel = input<string>();
  name = input<string>();
  id = input<string>(this.uniqueId);

  computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    const labelText = this.label();
    if (labelText) return labelText;

    return 'Switch';
  });
  errorId = computed(() => this.error() ? `${this.id()}-error` : null);
  successId = computed(() => this.success() ? `${this.id()}-success` : null);
  describedBy = computed(() => {
    const ids = [this.errorId(), this.successId()].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : null;
  });

  toggle(): void {
    if (!this.disabled()) {
      this.checked.update(v => !v);
      this.onChange(this.checked());
      this.checkedChange.emit(this.checked());
      this.onTouched();
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