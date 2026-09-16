import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
  InjectionToken,
  effect
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import type { FormCheckboxControl } from '@angular/forms/signals';
import { SwitchSize, SwitchConfig } from './switch.types';
import { pshUniqueId } from '../../utils/unique-id';
import { pshRequiredError } from '../../utils/required-validator';
import { pshJoinAriaIds } from '../../utils/aria';

const SWITCH_DEFAULTS = {
  checked: false,
  disabled: false,
  required: false,
  size: 'medium',
  labelPosition: 'right'
} satisfies Partial<SwitchConfig>;

export const SWITCH_CONFIG = new InjectionToken<Partial<SwitchConfig>>('SWITCH_CONFIG', {
  factory: () => SWITCH_DEFAULTS,
});

@Component({
  selector: 'psh-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALIDATORS, useExisting: PshSwitchComponent, multi: true },{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PshSwitchComponent,
    multi: true
  }],
  host: {
    '[class.psh-switch-wrapper]': 'true',
    '[class.psh-switch-disabled]': 'disabled()',
    '[class.psh-switch-error]': '!!error()',
    '[class.psh-switch-success]': '!!success()'
  }
})
export class PshSwitchComponent implements ControlValueAccessor, FormCheckboxControl, Validator {
  private config = inject(SWITCH_CONFIG);
  private uniqueId = pshUniqueId('switch');

  private switchInput = viewChild<ElementRef<HTMLInputElement>>('switchInput');

  private onChange = (_value: boolean) => {};
  private onTouched = () => {};
  private onValidatorChange: () => void = () => {};

  readonly checked = model(this.config.checked ?? false);
  readonly disabled = model(this.config.disabled ?? false);
  touched = model(false);

  /**
   * Emitted when the user finishes interacting with the control.
   *
   * Part of `FormUiControl`: the `Field` directive listens to **this**, not to
   * `touchedChange`, to mark the bound field as touched.
   */
  readonly touch = output<void>();

  required = input(this.config.required ?? false);
  size = input<SwitchSize>(this.config.size ?? 'medium');
  labelPosition = input<'left' | 'right'>(this.config.labelPosition ?? 'right');

  label = input('');
  error = input<string | null | undefined>(null);
  success = input<string | null | undefined>(null);
  /** Guidance shown when there is neither an error nor a success message. */
  hint = input<string | null | undefined>(null);

  /**
   * Extra ids for `aria-describedby`. **Merged** with the control's own — the id of its error,
   * success or hint message — never replacing them.
   */
  readonly ariaDescribedBy = input<string>();

  /**
   * Ids of the elements that name this control, for the cases a visible `<label>` cannot
   * cover. Merged with anything the control already points at.
   */
  readonly ariaLabelledBy = input<string>();
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
  hintId = computed(() => this.hint() ? `${this.id()}-hint` : null);
  // error, success and hint are mutually exclusive in the template (@if/@else if), so
  // aria-describedby references whichever message is actually rendered — in the same order.
  describedBy = computed(() =>
    pshJoinAriaIds(
      this.errorId() ?? this.successId() ?? this.hintId(),
      this.ariaDescribedBy(),
    ),
  );

  toggle(): void {
    if (!this.disabled()) {
      this.checked.update(v => !v);
      this.onChange(this.checked());
      this.markTouched();
    }
  }

  /**
   * Blur, not toggle. Tabbing through a required switch without flipping it still means the
   * user has been there, which is what a field needs to know before showing "required".
   */
  protected handleBlur(): void {
    this.markTouched();
  }

  private markTouched(): void {
    this.onTouched();
    this.touched.set(true);
    this.touch.emit();
  }

  constructor() {
    // A value change revalidates by itself; a change to `required` does not — Angular has
    // no reason to suspect the validator's answer moved. This is what the callback is for.
    effect(() => {
      this.required();
      this.onValidatorChange();
    });
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

  /**
   * Makes `required` a real constraint rather than an asterisk.
   *
   * Re-run whenever `required` or the value changes: `registerOnValidatorChange` gives us
   * the callback that tells Angular to revalidate, and an effect fires it.
   */
  validate(): ValidationErrors | null {
    return pshRequiredError(this.required(), !this.checked());
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

}
