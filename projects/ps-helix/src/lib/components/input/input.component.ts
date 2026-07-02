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
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { PshPortalService, PshPortalRef } from '../../a11y/portal.service';
import { PshOverlayPositionService } from '../../a11y/overlay-position.service';
import { InputType, InputVariant, InputSize, AutocompleteConfig, INPUT_LABELS } from './input.types';

@Component({
  selector: 'psh-input',
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PshInputComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.full-width]': 'fullWidth()',
    '[class.small]': 'size() === "small"',
    '[class.large]': 'size() === "large"',
    '[class.error]': '!!error()',
    '[class.success]': '!!success()',
    '[class.disabled]': 'disabled()',
    '[class.readonly]': 'readonly()',
    '[class.loading]': 'loading()',
    '[class.focused]': 'focused()',
    '[class.has-start-icon]': '!!iconStart()',
    '[class.has-end-icon]': '!!iconEnd() || type() === "password"',
    '[class.outlined]': 'variant() === "outlined"',
    '[class.filled]': 'variant() === "filled"',
  }
})
export class PshInputComponent implements ControlValueAccessor, FormValueControl<string> {
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
  readonly readonly = model(false);
  readonly loading = model(false);
  readonly touched = model(false);

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

  private readonly suggestionsVisible = signal(false);
  private readonly focusedSignal = signal(false);
  private readonly filteredSuggestionsSignal = signal<string[]>([]);
  readonly focusedSuggestionIndex = signal(-1);
  private readonly passwordVisibleSignal = signal(false);
  
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

  computedAriaLabel = computed(() => this.ariaLabel() || this.label() || this.placeholder());
  passwordToggleLabel = computed(() => this.passwordVisible() ? INPUT_LABELS.hidePassword : INPUT_LABELS.showPassword);

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
    this.inputFocus.emit();

    const val = this.value();
    if (this.suggestions() && val.length >= this.autocompleteConfig().minLength) {
      this.updateSuggestions(val);
    }
  }

  handleBlur(): void {
    this.focusedSignal.set(false);
    this.inputBlur.emit();
    this.onTouched();
    this.touched.set(true);

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
    this.suggestionSelect.emit(suggestion);
    this.suggestionsVisible.set(false);
    this.focusedSuggestionIndex.set(-1);
    this.syncPanel();
  }

  togglePasswordVisibility(): void {
    this.passwordVisibleSignal.update(v => !v);
  }

  protected hasLabelContent(): boolean {
    return !!this.elementRef.nativeElement.querySelector('[input-label]');
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
}