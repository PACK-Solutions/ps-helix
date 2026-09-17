import { PshFieldAppearance } from '../../types/semantic.types';
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
  TemplateRef,
  ViewContainerRef,
  viewChild,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { PshPortalService, PshPortalRef } from '../../a11y/portal.service';
import { PshOverlayPositionService } from '../../a11y/overlay-position.service';
import { InputType, InputSize, AutocompleteConfig, INPUT_LABELS } from './input.types';
import { pshIsEmptyValue, pshRequiredError } from '../../utils/required-validator';
import { pshJoinAriaIds } from '../../utils/aria';
import { INPUT_CONFIG } from './input.tokens';

@Component({
  selector: 'psh-input',
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    { provide: NG_VALIDATORS, useExisting: PshInputComponent, multi: true },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PshInputComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.psh-full-width]': 'fullWidth()',
    '[class.psh-small]': 'size() === "small"',
    '[class.psh-large]': 'size() === "large"',
    '[class.psh-error]': '!!error()',
    '[class.psh-success]': '!!success()',
    '[class.psh-disabled]': 'disabled()',
    '[class.psh-readonly]': 'readonly()',
    '[class.psh-loading]': 'loading()',
    '[class.psh-focused]': 'isFocused()',
    '[class.psh-has-start-icon]': '!!iconStart()',
    '[class.psh-has-end-icon]': '!!iconEnd() || type() === "password"',
    '[class.psh-outline]': 'appearance() === "outline"',
    '[class.psh-solid]': 'appearance() === "solid"',
  }
})
export class PshInputComponent implements ControlValueAccessor, FormValueControl<string>, Validator {
  private readonly config = inject(INPUT_CONFIG);

  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly portal = inject(PshPortalService);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly overlayPosition = inject(PshOverlayPositionService);

  // The autocomplete suggestions are teleported to a body-level overlay layer so
  // they escape any ancestor overflow / stacking context (a modal body, a
  // scrollable card…) instead of being clipped.
  private readonly suggestionsTpl = viewChild<TemplateRef<unknown>>('suggestionsTpl');
  private portalRef: PshPortalRef | null = null;
  private readonly repositionHandler = (): void => this.reposition();

  private static nextId = 0;
  readonly inputId = `psh-input-${PshInputComponent.nextId++}`;

  readonly value = model<string>('');
  readonly disabled = model<boolean>(false);
  readonly readonly = input(false);
  readonly loading = input(false);
  readonly touched = model(false);
/**
   * Emitted when the user finishes interacting with the control.
   *
   * Part of `FormUiControl`: the `Field` directive listens to **this**, not to
   * `touchedChange`, to mark the bound field as touched.
   */
  readonly touch = output<void>();

  appearance = input<PshFieldAppearance>(this.config.appearance ?? 'outline');
  size = input<InputSize>(this.config.size ?? 'medium');
  fullWidth = input(this.config.fullWidth ?? false);
  required = input(this.config.required ?? false);
  showLabel = input(this.config.showLabel ?? true);
  type = input<InputType>(this.config.type ?? 'text');
  placeholder = input(this.config.placeholder ?? '');
  label = input(this.config.label ?? '');
  ariaLabel = input<string | null>(null);
  iconStart = input<string>();
  iconEnd = input<string>();
  error = input<string | null | undefined>(null);
  success = input<string | null | undefined>(null);
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
  
  suggestions = input<string[] | ((query: string) => Promise<string[]>)>([]);
  autocompleteConfig = input<AutocompleteConfig>({
    minLength: 1,
    debounceTime: 300
  });

  private readonly suggestionsVisible = signal(false);
  private readonly focusedSignal = signal(false);
  private readonly filteredSuggestionsSignal = signal<string[]>([]);
  readonly focusedSuggestionIndex = signal(-1);
  private readonly passwordVisibleSignal = signal(false);
  
  private blurTimeoutId: number | null = null;
  private debounceTimeoutId: number | null = null;

  focused = output<void>();
  blurred = output<void>();
  suggestionSelected = output<string>();

  showSuggestions = computed(() => this.suggestionsVisible() && this.filteredSuggestions().length > 0);

  /**
   * The suggestions listbox is announced only when the input can actually produce one.
   *
   * A `role="combobox"` on a field with no popup tells a screen-reader user to expect one, so
   * this follows the `suggestions` input rather than being written on unconditionally.
   */
  protected readonly hasSuggestions = computed(() => {
    const source = this.suggestions();
    return typeof source === 'function' || source.length > 0;
  });

  protected readonly listboxId = `${this.inputId}-listbox`;

  /** The option the arrow keys are on — what a combobox reports through aria-activedescendant. */
  protected readonly activeDescendant = computed(() => {
    const index = this.focusedSuggestionIndex();
    return this.showSuggestions() && index >= 0 ? `${this.listboxId}-option-${index}` : null;
  });
  filteredSuggestions = computed(() => this.filteredSuggestionsSignal());
  /** Whether the control currently has focus. A state readout; the event is `focused`. */
  readonly isFocused = computed(() => this.focusedSignal());
  passwordVisible = computed(() => this.passwordVisibleSignal());
  
  effectiveType = computed(() => {
    if (this.type() === 'password') {
      return this.passwordVisible() ? 'text' : 'password';
    }
    return this.type();
  });

  computedAriaLabel = computed(() => this.ariaLabel() || this.label() || this.placeholder());
  passwordToggleLabel = computed(() => this.passwordVisible() ? INPUT_LABELS.hidePassword : INPUT_LABELS.showPassword);

  // Derived from the per-instance inputId: the message ids used to be the constants
  // 'error-message' / 'success-message' / 'hint-message', so two inputs in error on the
  // same page produced duplicate ids and a screen reader read the first one's message
  // for both. Same shape as textarea's describedBy.
  describedBy = computed(() => {
    const own = this.error()
      ? `${this.inputId}-error`
      : this.success()
        ? `${this.inputId}-success`
        : this.hint()
          ? `${this.inputId}-hint`
          : null;
    return pshJoinAriaIds(own, this.ariaDescribedBy());
  });

  state = computed(() => this.getState());

  private getState(): string {
    if (this.disabled()) return 'disabled';
    if (this.readonly()) return 'readonly';
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    if (this.success()) return 'success';
    if (this.isFocused()) return 'focused';
    return 'default';
  }

  constructor() {
    // A value change revalidates by itself; a change to `required` does not — Angular has
    // no reason to suspect the validator's answer moved. This is what the callback is for.
    effect(() => {
      this.required();
      this.onValidatorChange();
    });

    this.destroyRef.onDestroy(() => {
      if (this.blurTimeoutId) clearTimeout(this.blurTimeoutId);
      if (this.debounceTimeoutId) clearTimeout(this.debounceTimeoutId);
      this.closePanel();
    });
  }

  /** Attaches / detaches / repositions the teleported suggestions panel to match visibility. */
  private syncPanel(): void {
    if (this.showSuggestions()) {
      if (this.portalRef) this.reposition();
      else this.openPanel();
    } else if (this.portalRef) {
      this.closePanel();
    }
  }

  private openPanel(): void {
    const tpl = this.suggestionsTpl();
    if (!tpl || this.portalRef) return;
    this.portalRef = this.portal.attach(tpl, this.viewContainer);
    this.reposition();
    const view = (this.elementRef.nativeElement as HTMLElement).ownerDocument.defaultView;
    // Capture phase so inner (e.g. modal body) scrolls keep the panel aligned.
    view?.addEventListener('scroll', this.repositionHandler, true);
    view?.addEventListener('resize', this.repositionHandler);
  }

  private closePanel(): void {
    const view = (this.elementRef.nativeElement as HTMLElement).ownerDocument.defaultView;
    view?.removeEventListener('scroll', this.repositionHandler, true);
    view?.removeEventListener('resize', this.repositionHandler);
    this.portalRef?.detach();
    this.portalRef = null;
  }

  private reposition(): void {
    if (!this.portalRef) return;
    const anchor = (this.elementRef.nativeElement as HTMLElement).querySelector(
      '.input-wrapper',
    ) as HTMLElement | null;
    if (!anchor) return;
    const side = this.overlayPosition.flipSide(anchor, 'bottom', {
      overlayHeight: this.portalRef.panel.offsetHeight,
    }) as 'top' | 'bottom';
    this.portalRef.position(anchor, side, 4);
  }

  private onChange = (_: string) => {};
  private onTouched = () => {};
  private onValidatorChange: () => void = () => {};

  writeValue(value: unknown): void {
    const safeValue = typeof value === 'string' ? value : '';
    this.value.set(safeValue);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

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
    this.focused.emit();

    const val = this.value();
    if (this.suggestions() && val.length >= this.autocompleteConfig().minLength) {
      this.updateSuggestions(val);
    }
  }

  handleBlur(): void {
    this.focusedSignal.set(false);
    this.blurred.emit();
    this.onTouched();
    this.touched.set(true);
    this.touch.emit();

    if (this.blurTimeoutId) clearTimeout(this.blurTimeoutId);
    this.blurTimeoutId = setTimeout(() => {
      this.suggestionsVisible.set(false);
      this.focusedSuggestionIndex.set(-1);
      this.syncPanel();
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
        this.focusedSuggestionIndex.update(i => (i < suggestions.length - 1 ? i + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedSuggestionIndex.update(i => (i > 0 ? i - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        if (currentIndex >= 0 && currentIndex < suggestions.length) {
          event.preventDefault();
          const selected = suggestions[currentIndex];
          if (selected !== undefined) {
            this.handleSuggestionClick(selected);
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.suggestionsVisible.set(false);
        this.focusedSuggestionIndex.set(-1);
        this.syncPanel();
        break;
    }
  }

  handleSuggestionClick(suggestion: string): void {
    this.value.set(suggestion);
    this.onChange(suggestion);
    this.suggestionSelected.emit(suggestion);
    this.suggestionsVisible.set(false);
    this.focusedSuggestionIndex.set(-1);
    this.syncPanel();
  }

  togglePasswordVisibility(): void {
    this.passwordVisibleSignal.update(v => !v);
  }

  protected hasLabelContent(): boolean {
    return !!this.elementRef.nativeElement.querySelector('[psh-input-label]');
  }

  focus(): void {
    const inputEl = this.elementRef.nativeElement.querySelector('input');
    inputEl?.focus();
  }

  focusSelect(): void {
    this.focus();
  }

  private debouncedUpdateSuggestions(value: string): void {
    if (this.debounceTimeoutId) clearTimeout(this.debounceTimeoutId);
    this.debounceTimeoutId = setTimeout(() => {
      this.updateSuggestions(value);
      this.debounceTimeoutId = null;
    }, this.autocompleteConfig().debounceTime);
  }

  private async updateSuggestions(value: string): Promise<void> {
    const provider = this.suggestions();

    try {
      let results: string[] = [];
      if (typeof provider === 'function') {
        results = await provider(value);
      } else if (Array.isArray(provider)) {
        results = provider.filter(s => s.toLowerCase().includes(value.toLowerCase()));
      }
      
      this.filteredSuggestionsSignal.set(results);
      this.suggestionsVisible.set(results.length > 0);
      this.syncPanel();
    } catch (error) {
      // Fail gracefully (hide stale suggestions) but surface the error so a
      // failing provider is not silently swallowed during development.
      this.filteredSuggestionsSignal.set([]);
      this.suggestionsVisible.set(false);
      this.syncPanel();
      console.error('[psh-input] Suggestion provider failed:', error);
    }
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