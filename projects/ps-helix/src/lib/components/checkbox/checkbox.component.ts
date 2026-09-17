import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  input,
  isDevMode,
  model,
  output,
  viewChild,
  effect
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import type { FormCheckboxControl } from '@angular/forms/signals';
import { CheckboxSize, CheckboxConfig, CheckboxLabelPosition } from './checkbox.types';
import { pshUniqueId } from '../../utils/unique-id';
import { pshRequiredError } from '../../utils/required-validator';
import { pshJoinAriaIds } from '../../utils/aria';

const CHECKBOX_DEFAULTS = {
  checked: false,
  disabled: false,
  required: false,
  indeterminate: false,
  size: 'medium',
  labelPosition: 'right',
  label: ''
} satisfies Partial<CheckboxConfig>;

export const CHECKBOX_CONFIG = new InjectionToken<Partial<CheckboxConfig>>('CHECKBOX_CONFIG', {
  factory: () => CHECKBOX_DEFAULTS,
});

@Component({
  selector: 'psh-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALIDATORS, useExisting: PshCheckboxComponent, multi: true },{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PshCheckboxComponent,
    multi: true
  }],
  host: {
    '[class.psh-checkbox-disabled]': 'disabled()',
    '[class.psh-checkbox-error]': '!!error()',
    '[class.psh-checkbox-success]': '!!success()',
    '[class.psh-checkbox-small]': 'size() === "small"',
    '[class.psh-checkbox-large]': 'size() === "large"',
    '[class.psh-checkbox-checked]': 'checked() && !indeterminate()',
    '[class.psh-checkbox-indeterminate]': 'indeterminate()',
    '[attr.data-state]': 'state()',
    '[attr.aria-checked]': 'ariaChecked()'
  }
})
export class PshCheckboxComponent
  implements ControlValueAccessor, FormCheckboxControl, AfterViewInit, Validator
{
  private readonly config = inject(CHECKBOX_CONFIG);
  private readonly checkboxInput = viewChild<ElementRef<HTMLInputElement>>('checkboxInput');
  /** Holds the `label` input or the projected content — whichever provides the visible label. */
  private readonly labelSlot = viewChild<ElementRef<HTMLElement>>('labelSlot');

  protected readonly uniqueId = pshUniqueId('checkbox');

  private onChange = (_: boolean) => {};
  private onTouched = () => {};
  private onValidatorChange: () => void = () => {};

  readonly checked = model(this.config.checked ?? false);
  readonly disabled = model(this.config.disabled ?? false);
  readonly indeterminate = model(this.config.indeterminate ?? false);
  readonly touched = model(false);
/**
   * Emitted when the user finishes interacting with the control.
   *
   * Part of `FormUiControl`: the `Field` directive listens to **this**, not to
   * `touchedChange`, to mark the bound field as touched.
   */
  readonly touch = output<void>();

  readonly required = input(this.config.required ?? false);
  readonly label = input(this.config.label ?? '');
  readonly error = input<string | null | undefined>(this.config.error);
  readonly success = input<string | null | undefined>(this.config.success);
  /** Guidance shown when there is neither an error nor a success message. */
  readonly hint = input<string | null | undefined>(null);

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
  readonly ariaLabel = input<string | undefined>(this.config.ariaLabel);
  readonly size = input<CheckboxSize>(this.config.size ?? 'medium');
  readonly labelPosition = input<CheckboxLabelPosition>(this.config.labelPosition ?? 'right');

  readonly ariaChecked = computed(() => this.indeterminate() ? 'mixed' : (this.checked() ? 'true' : 'false'));
  readonly computedAriaLabel = computed(() => this.ariaLabel() || undefined);

  // Error, success and hint are mutually exclusive in the template (@if/@else if), so
  // aria-describedby references whichever message is actually rendered — in the same order.
  // Pointing at an id the template did not render leaves a dangling reference that no test
  // in this repository would catch.
  readonly describedBy = computed(() => {
    const own = this.error()
      ? `${this.uniqueId}-error`
      : this.success()
        ? `${this.uniqueId}-success`
        : this.hint()
          ? `${this.uniqueId}-hint`
          : null;
    return pshJoinAriaIds(own, this.ariaDescribedBy());
  });

  readonly state = computed(() => {
    if (this.disabled()) return 'disabled';
    if (this.indeterminate()) return 'indeterminate';
    if (this.error()) return 'error';
    if (this.success()) return 'success';
    return this.checked() ? 'checked' : 'unchecked';
  });

  ngAfterViewInit(): void {
    if (!isDevMode()) return;

    // Read the rendered label slot rather than the `label` input alone: a projected
    // label (`<psh-checkbox>Accept terms</psh-checkbox>`) is just as accessible, and
    // `contentChild` cannot see a bare text node. Checked once, after the first render.
    const hasVisibleLabel = !!this.labelSlot()?.nativeElement.textContent?.trim();
    if (!hasVisibleLabel && !this.ariaLabel()) {
      console.warn(
        '[psh-checkbox] No accessible label provided. Please use label input, ariaLabel input, or projected content.'
      );
    }
  }

  protected toggle(): void {
    if (!this.disabled()) {
      const newValue = !this.checked();
      this.checked.set(newValue);
      this.indeterminate.set(false);
      this.onChange(newValue);
      this.markTouched();
    }
  }

  /**
   * Blur, not toggle. Tabbing through a required checkbox without ticking it still means the
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

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  constructor() {
    // A value change revalidates by itself; a change to `required` does not — Angular has
    // no reason to suspect the validator's answer moved. This is what the callback is for.
    effect(() => {
      this.required();
      this.onValidatorChange();
    });
  }

  writeValue(value: unknown): void { this.checked.set(!!value); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  focus(): void { this.checkboxInput()?.nativeElement.focus(); }
  blur(): void { this.checkboxInput()?.nativeElement.blur(); }

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