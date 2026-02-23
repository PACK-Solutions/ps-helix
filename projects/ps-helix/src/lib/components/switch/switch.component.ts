import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  viewChild,
  InjectionToken
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormCheckboxControl } from '@angular/forms/signals';
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
export class PshSwitchComponent implements ControlValueAccessor, FormCheckboxControl {
  private config = inject(SWITCH_CONFIG);
  private uniqueId = `switch-${crypto.randomUUID()}`;

  private switchInput = viewChild<ElementRef<HTMLInputElement>>('switchInput');

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  readonly checked = model(this.config.checked ?? false);
  readonly disabled = model(this.config.disabled ?? false);
  touched = model(false);

  required = input(this.config.required ?? false);
  size = input<SwitchSize>(this.config.size ?? 'medium');
  labelPosition = input<'left' | 'right'>(this.config.labelPosition ?? 'right');

  label = input('');
  error = input('');
  success = input('');
  ariaLabel = input<string>();
  name = input<string>('');
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
      this.onTouched();
      this.touched.set(true);
    }
  }

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

  focus(): void {
    const el = this.switchInput();
    if (el?.nativeElement) {
      el.nativeElement.focus();
    }
  }

  blur(): void {
    const el = this.switchInput();
    if (el?.nativeElement) {
      el.nativeElement.blur();
    }
  }
}
