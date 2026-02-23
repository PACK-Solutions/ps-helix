import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  ChangeDetectorRef,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { InputType, InputVariant, InputSize, AutocompleteConfig, INPUT_LABELS } from './input.types';

@Component({
  selector: 'psh-input',
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PshInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PshInputComponent implements ControlValueAccessor, FormValueControl<string> {
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  private static nextId = 0;
  readonly inputId = `psh-input-${PshInputComponent.nextId++}`;

  readonly value = model<string>('');
  readonly disabled = model<boolean>(false);
  readonly readonly = model(false);
  loading = model(false);

  touched = model(false);

  variant = input<InputVariant>('outlined');
  size = input<InputSize>('medium');
  fullWidth = input(false);

  required = input(false);
  showLabel = input(true);
  type = input<InputType>('text');
  placeholder = input('');
  label = input('');
  ariaLabel = input<string | null>(null);
  iconStart = input<string>();
  iconEnd = input<string>();
  error = input<string | null | undefined>(null);
  success = input<string | null | undefined>(null);
  hint = input<string | null | undefined>(null);
  suggestions = input<string[] | ((query: string) => Promise<string[]>)>([]);
  autocompleteConfig = input<AutocompleteConfig>({
    minLength: 1,
    debounceTime: 300
  });

  private suggestionsVisible = signal(false);
  private focusedSignal = signal(false);
  private filteredSuggestionsSignal = signal<string[]>([]);
  focusedSuggestionIndex = signal(-1);
  private passwordVisibleSignal = signal(false);
  private blurTimeoutId: number | null = null;
  private debounceTimeoutId: number | null = null;

  inputFocus = output<void>();
  inputBlur = output<void>();
  suggestionSelect = output<string>();

  showSuggestions = computed(() => this.suggestionsVisible() && this.filteredSuggestions().length > 0);
  filteredSuggestions = computed(() => this.filteredSuggestionsSignal());
  focused = computed(() => this.focusedSignal());
  passwordVisible = computed(() => this.passwordVisibleSignal());
  effectiveType = computed(() => {
    if (this.type() === 'password') {
      return this.passwordVisible() ? 'text' : 'password';
    }
    return this.type();
  });

  computedAriaLabel = computed(() => {
    return this.ariaLabel() || this.label() || this.placeholder();
  });

  passwordToggleLabel = computed(() => {
    return this.passwordVisible() ? INPUT_LABELS.hidePassword : INPUT_LABELS.showPassword;
  });

  state = computed(() => this.getState());

  private getState(): string {
    if (this.disabled()) return 'disabled';
    if (this.readonly()) return 'readonly';
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    if (this.success()) return 'success';
    if (this.focused()) return 'focused';
    return 'default';
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.blurTimeoutId !== null) {
        clearTimeout(this.blurTimeoutId);
      }
      if (this.debounceTimeoutId !== null) {
        clearTimeout(this.debounceTimeoutId);
      }
    });
  }

  private onChange = (_: unknown) => {};
  private onTouched = () => {};

  writeValue(value: unknown): void {
    this.value.set((value as string) ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (_: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);

    if (this.suggestions()) {
      this.debouncedUpdateSuggestions(val);
    }
  }

  handleFocus(): void {
    this.focusedSignal.set(true);
    this.inputFocus.emit();

    if (this.suggestions() && this.value().length >= this.autocompleteConfig().minLength) {
      this.updateSuggestions(this.value());
    }
  }

  handleBlur(): void {
    this.focusedSignal.set(false);
    this.inputBlur.emit();
    this.onTouched();
    this.touched.set(true);

    if (this.blurTimeoutId !== null) {
      clearTimeout(this.blurTimeoutId);
    }
    this.blurTimeoutId = window.setTimeout(() => {
      this.suggestionsVisible.set(false);
      this.focusedSuggestionIndex.set(-1);
      this.blurTimeoutId = null;
    }, 200);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions()) return;

    const suggestions = this.filteredSuggestions();
    const currentIndex = this.focusedSuggestionIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedSuggestionIndex.update(i =>
          i < suggestions.length - 1 ? i + 1 : 0
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusedSuggestionIndex.update(i =>
          i > 0 ? i - 1 : suggestions.length - 1
        );
        break;

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < suggestions.length) {
          const selectedSuggestion = suggestions[currentIndex];
          if (selectedSuggestion) {
            this.handleSuggestionClick(selectedSuggestion);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.suggestionsVisible.set(false);
        this.focusedSuggestionIndex.set(-1);
        break;
    }
  }

  handleSuggestionClick(suggestion: string): void {
    if (suggestion) {
      this.value.set(suggestion);
      this.onChange(suggestion);
      this.suggestionSelect.emit(suggestion);
      this.suggestionsVisible.set(false);
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisibleSignal.update(v => !v);
  }

  protected hasLabelContent(): boolean {
    return !!this.elementRef.nativeElement.querySelector('[input-label]');
  }

  focus(): void {
    const inputEl = this.elementRef.nativeElement.querySelector('input');
    if (inputEl) {
      inputEl.focus();
    }
  }

  focusSelect(): void {
    this.focus();
  }

  private debouncedUpdateSuggestions(value: string): void {
    if (this.debounceTimeoutId !== null) {
      clearTimeout(this.debounceTimeoutId);
    }

    const debounceTime = this.autocompleteConfig().debounceTime;
    this.debounceTimeoutId = window.setTimeout(() => {
      this.updateSuggestions(value);
      this.debounceTimeoutId = null;
    }, debounceTime);
  }

  private async updateSuggestions(value: string) {
    const suggestionsValue = this.suggestions();

    if (typeof suggestionsValue === 'function') {
      try {
        const results = await suggestionsValue(value);
        if (Array.isArray(results)) {
          this.filteredSuggestionsSignal.set(results);
          this.suggestionsVisible.set(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.filteredSuggestionsSignal.set([]);
      }
    } else if (Array.isArray(suggestionsValue)) {
      const filtered = suggestionsValue.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      this.filteredSuggestionsSignal.set(filtered);
      this.suggestionsVisible.set(true);
    }
  }
}
