import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  computed,
  contentChildren,
  inject,
  input,
  model,
  output,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';

import { PshRadioComponent } from './radio.component';
import { PSH_RADIO_GROUP, PshRadioGroupApi } from './radio-group.token';
import { RadioSize } from './radio.types';
import { pshUniqueId } from '../../utils/unique-id';
import { pshRequiredError } from '../../utils/required-validator';
import { pshJoinAriaIds } from '../../utils/aria';

export interface RadioGroupConfig {
  size: RadioSize;
  orientation: 'vertical' | 'horizontal';
  required: boolean;
}

export const RADIO_GROUP_CONFIG = new InjectionToken<Partial<RadioGroupConfig>>(
  'RADIO_GROUP_CONFIG',
  { factory: () => ({ size: 'medium', orientation: 'vertical', required: false }) },
);

/**
 * A set of radio buttons, and the thing that carries the form contract for them.
 *
 * `psh-radio` never could. The value of a radio in a form is not a boolean per button, it is
 * *which one of the set is selected* — so there was nothing to bind a form control to, and
 * `formControlName`, `[(ngModel)]` and `[formField]` all did nothing on a radio. The group is
 * what was missing, not a fix to the radio.
 *
 * It owns the value; the radios ask. That also removes the reason `psh-radio` avoided
 * `model()`: a radio no longer has its own value to guard against echoing.
 *
 * Supports all three binding styles:
 *
 * @example
 * <psh-radio-group [(value)]="plan" label="Plan">        <!-- plain two-way -->
 * <psh-radio-group formControlName="plan">               <!-- Reactive Forms -->
 * <psh-radio-group [field]="f.plan">                     <!-- Signal Forms -->
 *   <psh-radio value="free" label="Free" />
 *   <psh-radio value="pro" label="Pro" />
 * </psh-radio-group>
 */
@Component({
  selector: 'psh-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALIDATORS, useExisting: PshRadioGroupComponent, multi: true },
    { provide: NG_VALUE_ACCESSOR, useExisting: PshRadioGroupComponent, multi: true },
    { provide: PSH_RADIO_GROUP, useExisting: PshRadioGroupComponent },
  ],
  host: {
    role: 'radiogroup',
    '[class.psh-radio-group]': 'true',
    '[class.psh-horizontal]': 'orientation() === "horizontal"',
    '[class.psh-radio-group-disabled]': 'disabled()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'labelId()',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.aria-required]': 'required() || null',
    '[attr.aria-invalid]': 'error() ? "true" : null',
    '[attr.aria-orientation]': 'orientation()',
    '(keydown)': 'handleKeydown($event)',
    '(focusout)': 'handleFocusOut($event)',
  },
})
export class PshRadioGroupComponent<T = unknown>
  implements ControlValueAccessor, FormValueControl<T | null>, PshRadioGroupApi<T>, Validator
{
  private readonly config = inject(RADIO_GROUP_CONFIG);
  private readonly uniqueId = pshUniqueId('radio-group');

  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  /** Required by `FormValueControl`: the group is what a field binds to. */
  readonly value = model<T | null>(null);
  readonly disabled = model(false);
  readonly touched = model(false);

  /**
   * Emitted when the user leaves the group.
   *
   * `FormUiControl` declares this, and the `Field` directive listens to **it** rather than to
   * `touchedChange`, so blur-based rules such as `debounce('blur')` depend on it.
   */
  readonly touch = output<void>();

  /**
   * The shared `name`. Defaults to a generated one so two groups on a page never merge into
   * a single native radio set by accident.
   */
  readonly name = input(this.uniqueId);
  readonly required = input(this.config.required ?? false);
  readonly size = input<RadioSize>(this.config.size ?? 'medium');
  readonly orientation = input<'vertical' | 'horizontal'>(
    this.config.orientation ?? 'vertical',
  );

  /** Visible group label, rendered as a `<legend>`-equivalent and referenced by ARIA. */
  readonly label = input('');
  readonly ariaLabel = input<string>();
  readonly error = input<string | null | undefined>(null);
  readonly success = input<string | null | undefined>(null);
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

  protected readonly radios = contentChildren(PshRadioComponent);

  protected readonly labelId = computed(() =>
    this.label() && !this.ariaLabel() ? `${this.uniqueId}-label` : null,
  );
  protected readonly errorId = computed(() =>
    this.error() ? `${this.uniqueId}-error` : null,
  );
  protected readonly successId = computed(() =>
    this.success() ? `${this.uniqueId}-success` : null,
  );
  protected readonly hintId = computed(() => (this.hint() ? `${this.uniqueId}-hint` : null));

  // Same order as the template's @if/@else-if chain: aria-describedby must name the message
  // that is actually rendered, not the first one that happens to be set.
  protected readonly describedBy = computed(() =>
    pshJoinAriaIds(
      this.errorId() ?? this.successId() ?? this.hintId(),
      this.ariaDescribedBy(),
    ),
  );

  /** Called by a child radio. The group owns the value, so the radio asks rather than sets. */
  select(value: T): void {
    if (this.disabled()) return;
    if (this.value() === value) return;

    // `value` is a model, so setting it already emits `valueChange`. Declaring one as well
    // is NG1054: "Output 'valueChange' is bound to both 'value' and 'valueChange'".
    this.value.set(value);
    this.onChange(value);
    this.markTouched();
  }

  markTouched(): void {
    this.onTouched();
    this.touched.set(true);
    this.touch.emit();
  }

  /**
   * Arrow keys move *and select*, which is the APG radiogroup behaviour — a radio set has no
   * "focused but unselected" state to navigate through. Disabled radios are skipped, and the
   * ends wrap.
   */
  protected handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    const enabled = this.radios().filter(radio => !radio.isDisabled());
    if (enabled.length === 0) return;

    const current = enabled.findIndex(radio => radio.isChecked());
    let next: number;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = current < 0 ? 0 : (current + 1) % enabled.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = current < 0 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = enabled.length - 1;
        break;
      default:
        return;
    }

    const target = enabled[next];
    if (!target) return;

    event.preventDefault();
    this.select(target.value() as T);
    target.focus();
  }

  /**
   * Touched when focus leaves the *group*, not when it moves between its radios — arrow
   * navigation blurs one radio and focuses the next, which is not the user leaving.
   */
  protected handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    const host = (event.currentTarget as HTMLElement) ?? null;
    if (next && host?.contains(next)) return;
    this.markTouched();
  }

  constructor() {
    // A value change revalidates by itself; a change to `required` does not — Angular has
    // no reason to suspect the validator's answer moved. This is what the callback is for.
    effect(() => {
      this.required();
      this.onValidatorChange();
    });
  }

  writeValue(value: T | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  /** Focuses the selected radio, or the first enabled one when nothing is selected. */
  focus(): void {
    const enabled = this.radios().filter(radio => !radio.isDisabled());
    const target = enabled.find(radio => radio.isChecked()) ?? enabled[0];
    target?.focus();
  }

  /**
   * Makes `required` a real constraint rather than an asterisk.
   *
   * Re-run whenever `required` or the value changes: `registerOnValidatorChange` gives us
   * the callback that tells Angular to revalidate, and an effect fires it.
   */
  validate(): ValidationErrors | null {
    return pshRequiredError(this.required(), this.value() === null || this.value() === undefined);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

}
