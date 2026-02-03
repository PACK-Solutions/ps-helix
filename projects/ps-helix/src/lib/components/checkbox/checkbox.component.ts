import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  model,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxSize, CheckboxConfig } from './checkbox.types';

export const CHECKBOX_CONFIG = new InjectionToken<Partial<CheckboxConfig>>('CHECKBOX_CONFIG', {
  factory: () => ({
    checked: false,
    disabled: false,
    required: false,
    indeterminate: false,
    size: 'medium',
    labelPosition: 'right',
    label: ''
  })
});

let checkboxIdCounter = 0;

@Component({
  selector: 'psh-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PshCheckboxComponent,
    multi: true
  }],
  host: {
    '[class.checkbox-disabled]': 'disabled()',
    '[class.checkbox-error]': '!!error()',
    '[class.checkbox-success]': '!!success()',
    '[class.checkbox-small]': 'size() === "small"',
    '[class.checkbox-large]': 'size() === "large"',
    '[attr.data-state]': 'state()'
  }
})
export class PshCheckboxComponent implements ControlValueAccessor {
  private config = inject(CHECKBOX_CONFIG);
  private uniqueId = `checkbox-${++checkboxIdCounter}`;

  private checkboxInput = viewChild<ElementRef<HTMLInputElement>>('checkboxInput');

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  checked = model(this.config.checked ?? false);
  disabled = model(this.config.disabled ?? false);
  required = model(this.config.required ?? false);
  indeterminate = model(this.config.indeterminate ?? false);

  label = input(this.config.label ?? '');
  error = input('');
  success = input('');
  ariaLabel = input<string>();
  size = input<CheckboxSize>(this.config.size ?? 'medium');
  labelPosition = input<'left' | 'right'>(this.config.labelPosition ?? 'right');

  ariaChecked = computed<'true' | 'false' | 'mixed'>(() =>
    this.indeterminate() ? 'mixed' : (this.checked() ? 'true' : 'false')
  );

  computedAriaLabel = computed(() => this.ariaLabel());

  errorMessageId = computed(() => this.error() ? `${this.uniqueId}-error` : undefined);
  successMessageId = computed(() => this.success() ? `${this.uniqueId}-success` : undefined);

  ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    if (this.errorMessageId()) ids.push(this.errorMessageId()!);
    if (this.successMessageId()) ids.push(this.successMessageId()!);
    return ids.length > 0 ? ids.join(' ') : undefined;
  });

  state = computed(() => this.getState());

  constructor() {
    effect(() => {
      if (!this.label() && !this.ariaLabel()) {
        console.warn(
          '[psh-checkbox] No accessible label provided. Please use label input or ariaLabel input.'
        );
      }
    }, { allowSignalWrites: false });
  }

  private getState(): string {
    if (this.disabled()) return 'disabled';
    if (this.indeterminate()) return 'indeterminate';
    if (this.error()) return 'error';
    if (this.success()) return 'success';
    return this.checked() ? 'checked' : 'unchecked';
  }

  protected toggle(): void {
    if (!this.disabled()) {
      this.checked.update(v => !v);
      this.indeterminate.set(false);
      this.onChange(this.checked());
      this.onTouched();
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
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
    const input = this.checkboxInput();
    if (input?.nativeElement) {
      input.nativeElement.focus();
    }
  }

  blur(): void {
    const input = this.checkboxInput();
    if (input?.nativeElement) {
      input.nativeElement.blur();
    }
  }
}