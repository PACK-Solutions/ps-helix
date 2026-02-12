import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  input,
  Output,
  signal,
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

  // CVA-managed state: plain signals + manual @Input/@Output to prevent
  // auto-emission during writeValue()/setDisabledState().
  checked = signal(this.config.checked ?? false);
  @Input('checked') set checkedInput(v: boolean) { this.checked.set(v); }

  disabled = signal(this.config.disabled ?? false);
  @Input('disabled') set disabledInput(v: boolean) { this.disabled.set(v); }

  indeterminate = signal(this.config.indeterminate ?? false);
  @Input('indeterminate') set indeterminateInput(v: boolean) { this.indeterminate.set(v); }

  required = input(this.config.required ?? false);

  // Outputs — EventEmitter to decouple from signal writes.
  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() disabledChange = new EventEmitter<boolean>();
  @Output() indeterminateChange = new EventEmitter<boolean>();

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
      this.checkedChange.emit(this.checked());
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