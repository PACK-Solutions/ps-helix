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
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import {
  TEXTAREA_LABELS,
  TextareaResize,
  TextareaSize,
  TextareaVariant,
} from './textarea.types';

@Component({
  selector: 'psh-textarea',
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PshTextareaComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.full-width]': 'fullWidth()',
    '[class.small]': 'size() === "small"',
    '[class.large]': 'size() === "large"',
    '[class.outlined]': 'variant() === "outlined"',
    '[class.filled]': 'variant() === "filled"',
    '[class.error]': 'hasError()',
    '[class.success]': '!!success() && !hasError()',
    '[class.disabled]': 'disabled()',
    '[class.readonly]': 'readonly()',
    '[class.focused]': 'focused()',
    '[class.auto-size]': 'autoSize()',
    '[class.over-limit]': 'isOverLimit()',
  },
})
export class PshTextareaComponent
  implements ControlValueAccessor, FormValueControl<string>, OnInit
{
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  private static nextId = 0;
  readonly textareaId = `psh-textarea-${PshTextareaComponent.nextId++}`;

  readonly value = model<string>('');
  readonly disabled = model<boolean>(false);
  readonly readonly = model<boolean>(false);
  readonly touched = model<boolean>(false);

  variant = input<TextareaVariant>('outlined');
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
  private readonly controlInvalidSignal = signal<boolean>(false);

  inputFocus = output<void>();
  inputBlur = output<void>();

  @ViewChild('textareaRef')
  private textareaRef?: ElementRef<HTMLTextAreaElement>;

  focused = computed(() => this.focusedSignal());

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
    () => !!this.error() || this.isOverLimit() || this.controlInvalidSignal(),
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
    if (this.focused()) return 'focused';
    return 'default';
  });

  characterCountLabel = TEXTAREA_LABELS.characterCountSuffix;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      this.value();
      this.autoSize();
      this.rows();
      if (this.autoSize()) {
        queueMicrotask(() => this.applyAutoSize());
      }
    });
  }

  ngOnInit(): void {
    const control = this.ngControl?.control;
    if (!control) return;

    this.controlInvalidSignal.set(!!control.invalid && !!control.touched);

    control.statusChanges?.subscribe(() => {
      this.controlInvalidSignal.set(!!control.invalid && !!control.touched);
      this.cdr.markForCheck();
    });
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

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
    this.inputFocus.emit();
  }

  handleBlur(): void {
    this.focusedSignal.set(false);
    this.touched.set(true);
    this.onTouched();
    this.inputBlur.emit();
    if (this.ngControl?.control) {
      this.controlInvalidSignal.set(
        !!this.ngControl.control.invalid && !!this.ngControl.control.touched,
      );
    }
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
    return !!this.elementRef.nativeElement.querySelector('[textarea-label]');
  }
}
