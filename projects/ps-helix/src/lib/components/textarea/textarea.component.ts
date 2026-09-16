import { PshFieldAppearance } from '../../types/semantic.types';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { pshIsEmptyValue, pshRequiredError } from '../../utils/required-validator';
import {
  TEXTAREA_LABELS,
  TextareaResize,
  TextareaSize,
  } from './textarea.types';

@Component({
  selector: 'psh-textarea',
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  providers: [
    { provide: NG_VALIDATORS, useExisting: PshTextareaComponent, multi: true },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PshTextareaComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.psh-full-width]': 'fullWidth()',
    '[class.psh-small]': 'size() === "small"',
    '[class.psh-large]': 'size() === "large"',
    '[class.psh-outline]': 'appearance() === "outline"',
    '[class.psh-solid]': 'appearance() === "solid"',
    '[class.psh-error]': 'hasError()',
    '[class.psh-success]': '!!success() && !hasError()',
    '[class.psh-disabled]': 'disabled()',
    '[class.psh-readonly]': 'readonly()',
    '[class.psh-focused]': 'isFocused()',
    '[class.psh-auto-size]': 'autoSize()',
    '[class.psh-over-limit]': 'isOverLimit()',
  },
})
export class PshTextareaComponent
  implements ControlValueAccessor, FormValueControl<string>, Validator
{
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);

  private static nextId = 0;
  readonly textareaId = `psh-textarea-${PshTextareaComponent.nextId++}`;

  readonly value = model<string>('');
  readonly disabled = model<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly touched = model<boolean>(false);
/**
   * Emitted when the user finishes interacting with the control.
   *
   * Part of `FormUiControl`: the `Field` directive listens to **this**, not to
   * `touchedChange`, to mark the bound field as touched.
   */
  readonly touch = output<void>();

  appearance = input<PshFieldAppearance>('outline');
  size = input<TextareaSize>('medium');
  resize = input<TextareaResize>('vertical');
  rows = input<number>(4);
  maxLength = input<number | undefined>(undefined);
  autoSize = input<boolean>(false);
  showCharacterCount = input<boolean>(false);
  fullWidth = input<boolean>(false);
  required = input<boolean>(false);
  showLabel = input<boolean>(true);
  label = input<string>('');
  placeholder = input<string>('');
  hint = input<string | null | undefined>(null);
  error = input<string | null | undefined>(null);
  success = input<string | null | undefined>(null);
  ariaLabel = input<string | null>(null);

  private readonly focusedSignal = signal<boolean>(false);

  focused = output<void>();
  blurred = output<void>();

  @ViewChild('textareaRef')
  private textareaRef?: ElementRef<HTMLTextAreaElement>;

  /** Whether the control currently has focus. A state readout; the event is `focused`. */
  readonly isFocused = computed(() => this.focusedSignal());

  effectiveResize = computed<TextareaResize>(() =>
    this.autoSize() ? 'none' : this.resize(),
  );

  characterCount = computed(() => ({
    current: (this.value() ?? '').length,
    max: this.maxLength(),
  }));

  isOverLimit = computed(() => {
    const max = this.maxLength();
    if (max === undefined) return false;
    return this.characterCount().current > max;
  });

  isAtLimit = computed(() => {
    const max = this.maxLength();
    if (max === undefined) return false;
    return this.characterCount().current >= max;
  });

  shouldShowCount = computed(
    () => this.showCharacterCount() || this.maxLength() !== undefined,
  );

  hasError = computed(
    () => !!this.error() || this.isOverLimit(),
  );

  computedAriaLabel = computed(
    () => this.ariaLabel() || this.label() || this.placeholder() || null,
  );

  describedBy = computed(() => {
    if (this.error()) return `${this.textareaId}-error`;
    if (this.success()) return `${this.textareaId}-success`;
    if (this.hint()) return `${this.textareaId}-hint`;
    return null;
  });

  state = computed(() => {
    if (this.disabled()) return 'disabled';
    if (this.readonly()) return 'readonly';
    if (this.hasError()) return 'error';
    if (this.success()) return 'success';
    if (this.isFocused()) return 'focused';
    return 'default';
  });

  characterCountLabel = TEXTAREA_LABELS.characterCountSuffix;

  constructor() {
    // A value change revalidates by itself; a change to `required` does not — Angular has
    // no reason to suspect the validator's answer moved. This is what the callback is for.
    effect(() => {
      this.required();
      this.onValidatorChange();
    });

    effect(() => {
      this.value();
      this.autoSize();
      this.rows();
      if (this.autoSize()) {
        queueMicrotask(() => this.applyAutoSize());
      }
    });
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  writeValue(value: unknown): void {
    const safeValue = typeof value === 'string' ? value : '';
    this.value.set(safeValue);
    this.cdr.markForCheck();
    if (this.autoSize()) {
      queueMicrotask(() => this.applyAutoSize());
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
  }

  handleFocus(): void {
    this.focusedSignal.set(true);
    this.focused.emit();
  }

  handleBlur(): void {
    this.focusedSignal.set(false);
    this.touched.set(true);
    this.onTouched();
    this.touch.emit();
    this.blurred.emit();
  }

  focus(): void {
    this.textareaRef?.nativeElement.focus();
  }

  private applyAutoSize(): void {
    const el = this.textareaRef?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  protected hasLabelContent(): boolean {
    return !!this.elementRef.nativeElement.querySelector('[psh-textarea-label]');
  }

  /**
   * Makes `required` a real constraint rather than an asterisk.
   *
   * Re-run whenever `required` or the value changes: `registerOnValidatorChange` gives us
   * the callback that tells Angular to revalidate, and an effect fires it.
   */
  validate(): ValidationErrors | null {
    return pshRequiredError(this.required(), pshIsEmptyValue(this.value()));
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

}
