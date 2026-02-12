import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  input,
  model,
  Output,
  output,
  signal,
  ChangeDetectorRef,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
export class PshInputComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  private static nextId = 0;
  readonly inputId = `psh-input-${PshInputComponent.nextId++}`;

  // CVA-managed state: plain signals + manual @Input/@Output to prevent
  // auto-emission during writeValue()/setDisabledState().
  value = signal('');
  @Input('value') set valueInput(v: string) { this.value.set(v ?? ''); }

  disabled = signal(false);
  @Input('disabled') set disabledInput(v: boolean) { this.disabled.set(v); }

  // Non-CVA model inputs (two-way bindable, not written by CVA methods)
  readonly = model(false);
  loading = model(false);

  // Configuration inputs (one-directional)
  variant = input<InputVariant>('outlined');
  size = input<InputSize>('medium');
  fullWidth = input(false);

  // Regular inputs
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

  // State
  private suggestionsVisible = signal(false);
  private focusedSignal = signal(false);
  private filteredSuggestionsSignal = signal<string[]>([]);
  focusedSuggestionIndex = signal(-1);
  private passwordVisibleSignal = signal(false);
  private blurTimeoutId: number | null = null;
  private debounceTimeoutId: number | null = null;

  // Outputs — valueChange/disabledChange use EventEmitter to decouple from signal writes.
  @Output() valueChange = new EventEmitter<string>();
  @Output() disabledChange = new EventEmitter<boolean>();
  inputFocus = output<void>();
  inputBlur = output<void>();
  suggestionSelect = output<string>();

  // Computed values
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

  // ControlValueAccessor implementation
  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value.set(value ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Event handlers
  handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.valueChange.emit(value);
    this.onChange(value);

    if (this.suggestions()) {
      this.debouncedUpdateSuggestions(value);
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
      this.valueChange.emit(suggestion);
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

  focusSelect(): void {
    const input = this.elementRef.nativeElement.querySelector('input');
    if (input) {
      input.focus();
    }
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
