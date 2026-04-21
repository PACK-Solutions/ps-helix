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
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { TextareaResize, TextareaSize, TextareaVariant } from './textarea.types';

@Component({
  selector: 'psh-textarea',
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PshTextareaComponent implements ControlValueAccessor {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  protected ngControl = inject(NgControl, { optional: true, self: true });

  private static nextId = 0;
  readonly textareaId = `psh-textarea-${PshTextareaComponent.nextId++}`;
  readonly helperId = `${this.textareaId}-helper`;
  readonly counterId = `${this.textareaId}-counter`;
  readonly errorId = `${this.textareaId}-error`;

  // Shared state (source of truth for both CVA and FormValueControl)
  value = model<string>('');
  disabled = model(false);
  readonly = model(false);

  // Required config
  label = input.required<string>();

  // Config inputs
  placeholder = input('');
  helperText = input('');
  rows = input(4);
  maxLength = input<number | undefined>(undefined);
  showCharacterCount = input(false);
  resize = input<TextareaResize>('vertical');
  autoSize = input(false);

  // Complementary inputs
  required = input(false);
  showLabel = input(true);
  ariaLabel = input<string | null>(null);
  error = input<string | null | undefined>(null);
  size = input<TextareaSize>('medium');
  variant = input<TextareaVariant>('outlined');
  fullWidth = input(false);

  // Outputs
  valueChange = output<string>();
  textareaFocus = output<void>();
  textareaBlur = output<void>();

  // UI state
  private focusedSignal = signal(false);
  focused = computed(() => this.focusedSignal());

  // Derived values
  characterCount = computed(() => this.value().length);

  isOverLimit = computed(() => {
    const max = this.maxLength();
    return max !== undefined && this.characterCount() > max;
  });

  characterCountDisplay = computed(() => {
    const max = this.maxLength();
    const count = this.characterCount();
    return max !== undefined ? `${count} / ${max}` : `${count}`;
  });

  hasError = computed(() => {
    if (this.error()) return true;
    if (this.isOverLimit()) return true;
    const control = this.ngControl?.control;
    if (control && control.invalid && (control.touched || control.dirty)) return true;
    return false;
  });

  errorMessage = computed(() => {
    if (this.error()) return this.error();
    if (this.isOverLimit()) return 'Maximum length exceeded';
    return null;
  });

  state = computed(() => {
    if (this.disabled()) return 'disabled';
    if (this.readonly()) return 'readonly';
    if (this.hasError()) return 'error';
    if (this.focused()) return 'focused';
    return 'default';
  });

  computedAriaLabel = computed(() => this.ariaLabel() || this.label() || this.placeholder());

  ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    if (this.helperText()) ids.push(this.helperId);
    if (this.showCharacterCount()) ids.push(this.counterId);
    if (this.hasError() && this.errorMessage()) ids.push(this.errorId);
    return ids.length > 0 ? ids.join(' ') : null;
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Auto-resize effect
    effect(() => {
      const currentValue = this.value();
      if (!this.autoSize()) return;
      queueMicrotask(() => this.resizeToContent(currentValue));
    });
  }

  private resizeToContent(_value: string): void {
    const textarea = this.elementRef.nativeElement.querySelector('textarea');
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  // ControlValueAccessor implementation
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null | undefined): void {
    this.value.set(value ?? '');
    this.cdr.markForCheck();
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

  // Event handlers
  handleInput(event: Event): void {
    const next = (event.target as HTMLTextAreaElement).value;
    this.value.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  handleFocus(): void {
    this.focusedSignal.set(true);
    this.textareaFocus.emit();
  }

  handleBlur(): void {
    this.focusedSignal.set(false);
    this.onTouched();
    this.textareaBlur.emit();
  }

  focusTextarea(): void {
    const textarea = this.elementRef.nativeElement.querySelector('textarea');
    textarea?.focus();
  }
}
