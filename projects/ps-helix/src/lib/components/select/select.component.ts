import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  DestroyRef,
  ChangeDetectorRef,
  AfterContentInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { SelectOption, SelectOptionGroup, SelectSize, SearchConfig } from './select.types';

@Component({
  selector: 'psh-select',
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PshSelectComponent,
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
    '[class.loading]': 'loading()',
  }
})
export class PshSelectComponent<T = unknown> implements ControlValueAccessor, FormValueControl<T | T[] | null>, AfterContentInit {
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  readonly selectId = `select-${Math.random().toString(36).substring(2, 11)}`;

  readonly value = model<T | T[] | null>(null);
  readonly disabled = model<boolean>(false);
  touched = model(false);

  size = input<SelectSize>('medium');
  searchable = input(false);
  multiple = input(false);
  clearable = input(false);
  loading = input(false);
  fullWidth = input(false);
  required = input(false);

  options = input<(SelectOption<T> | SelectOptionGroup<T>)[]>([]);
  label = input('');
  ariaLabel = input<string | null>(null);
  placeholder = input<string>('Sélectionner une option');
  multiplePlaceholder = input<string>('Sélectionner des options');
  error = input('');
  success = input('');
  hint = input('');
  maxSelections = input<number | undefined>(undefined);
  minSelections = input<number | undefined>(undefined);
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  searchConfig = input<SearchConfig>({
    debounceTime: 300,
    placeholder: 'Rechercher...',
    minLength: 1
  });

  private isOpenSignal = signal(false);
  private searchTermSignal = signal('');
  private selectedLabelSignal = signal('');
  private focusedOptionIndex = signal(-1);
  private hasLabelContentSignal = signal(false);
  private initializedSignal = signal(false);
  private activeDescendantId = signal<string | null>(null);

  opened = output<void>();
  closed = output<void>();
  scrollEnd = output<void>();
  searched = output<string>();

  isOpen = computed(() => this.isOpenSignal());
  searchTerm = computed(() => this.searchTermSignal());
  hasLabelContent = computed(() => this.hasLabelContentSignal());
  activeDescendant = computed(() => this.activeDescendantId());

  computedAriaLabel = computed(() => {
    return this.ariaLabel() || this.label() || this.placeholder();
  });

  selectedLabel = computed(() => {
    if (!this.initializedSignal() || !this.hasValue()) {
      return this.multiple() ? this.multiplePlaceholder() : this.placeholder();
    }
    return this.selectedLabelSignal() || (this.multiple() ? this.multiplePlaceholder() : this.placeholder());
  });

  filteredOptions = computed(() => {
    const term = this.searchTermSignal().toLowerCase();
    const opts = this.options();

    if (!term) return opts;

    return opts.map(opt => {
      if (this.isOptionGroup(opt)) {
        const filteredOptions = opt.options.filter(o =>
          o.label.toLowerCase().includes(term) ||
          o.description?.toLowerCase().includes(term)
        );
        return filteredOptions.length > 0 ? { ...opt, options: filteredOptions } : null;
      }
      return opt.label.toLowerCase().includes(term) ||
             opt.description?.toLowerCase().includes(term)
        ? opt
        : null;
    }).filter((opt): opt is (SelectOption<T> | SelectOptionGroup<T>) => opt !== null);
  });

  constructor() {
    const clickHandler = (event: MouseEvent) => {
      if (this.isOpen()) {
        const target = event.target as HTMLElement;
        if (!this.elementRef.nativeElement.contains(target)) {
          this.close();
        }
      }
    };

    document.addEventListener('click', clickHandler);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('click', clickHandler);
    });
  }

  ngAfterContentInit() {
    Promise.resolve().then(() => {
      const hasLabel = !!this.elementRef.nativeElement.querySelector('[select-label]');
      this.hasLabelContentSignal.set(hasLabel);
      this.initializedSignal.set(true);
      this.cdr.markForCheck();
    });
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled() || this.loading()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggle();
        } else if (this.focusedOptionIndex() >= 0) {
          const options = this.flattenOptions(this.filteredOptions());
          const option = options[this.focusedOptionIndex()];
          if (option) this.select(option);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggle();
        } else {
          this.focusNextOption();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.focusPreviousOption();
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
        }
        break;

      case 'Tab':
        if (this.isOpen()) {
          this.close();
        }
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusFirstOption();
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusLastOption();
        }
        break;
    }
  }

  handleOptionKeyDown(event: KeyboardEvent, option: SelectOption<T>): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.select(option);
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  private focusNextOption(): void {
    const options = this.flattenOptions(this.filteredOptions());
    if (options.length === 0) return;

    const currentIndex = this.focusedOptionIndex();
    const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
    this.focusedOptionIndex.set(nextIndex);
    const nextOption = options[nextIndex];
    if (nextOption) {
      this.updateActiveDescendant(nextOption);
    }
    this.scrollOptionIntoView();
  }

  private focusPreviousOption(): void {
    const options = this.flattenOptions(this.filteredOptions());
    if (options.length === 0) return;

    const currentIndex = this.focusedOptionIndex();
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
    this.focusedOptionIndex.set(previousIndex);
    const prevOption = options[previousIndex];
    if (prevOption) {
      this.updateActiveDescendant(prevOption);
    }
    this.scrollOptionIntoView();
  }

  private focusFirstOption(): void {
    const options = this.flattenOptions(this.filteredOptions());
    if (options.length === 0) return;

    this.focusedOptionIndex.set(0);
    const firstOption = options[0];
    if (firstOption) {
      this.updateActiveDescendant(firstOption);
    }
    this.scrollOptionIntoView();
  }

  private focusLastOption(): void {
    const options = this.flattenOptions(this.filteredOptions());
    if (options.length === 0) return;

    const lastIndex = options.length - 1;
    this.focusedOptionIndex.set(lastIndex);
    const lastOption = options[lastIndex];
    if (lastOption) {
      this.updateActiveDescendant(lastOption);
    }
    this.scrollOptionIntoView();
  }

  private scrollOptionIntoView(): void {
    requestAnimationFrame(() => {
      const activeId = this.activeDescendantId();
      if (activeId) {
        const option = this.elementRef.nativeElement.querySelector(`#${activeId}`);
        if (option) {
          option.scrollIntoView({ block: 'nearest' });
        }
      }
    });
  }

  private updateActiveDescendant(option: SelectOption<T>): void {
    const optionId = `${this.selectId}-option-${String(option.value)}`;
    this.activeDescendantId.set(optionId);
    this.cdr.markForCheck();
  }

  isFocused(option: SelectOption<T>): boolean {
    const activeId = this.activeDescendantId();
    if (!activeId) return false;
    const optionId = `${this.selectId}-option-${String(option.value)}`;
    return activeId === optionId;
  }

  private onChange = (_: unknown) => {};
  private onTouched = () => {};

  writeValue(value: unknown): void {
    this.initializedSignal.set(true);
    this.value.set(value as T | T[] | null);
    this.updateSelectedLabel();
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

  isOptionGroup(option: SelectOption<T> | SelectOptionGroup<T>): option is SelectOptionGroup<T> {
    return 'options' in option;
  }

  getOptionKey(option: SelectOption<T> | SelectOptionGroup<T>): string {
    return this.isOptionGroup(option) ? `group-${option.label}` : `option-${String(option.value)}`;
  }

  hasValue(): boolean {
    const currentValue = this.value();
    if (this.multiple()) {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
    return currentValue !== null && currentValue !== undefined;
  }

  focus(): void {
    const trigger = this.elementRef.nativeElement.querySelector('.select-trigger');
    if (trigger) {
      trigger.focus();
    }
  }

  focusSelect(): void {
    this.focus();
  }

  select(option: SelectOption<T>): void {
    if (!this.disabled() && !option.disabled) {
      this.activeDescendantId.set(null);

      if (this.multiple()) {
        const currentValue = this.value();
        const values = Array.isArray(currentValue) ? [...currentValue] : [];
        const index = values.findIndex(v => this.compareWith()(v, option.value));
        let changed = false;

        if (index === -1) {
          const maxSelections = this.maxSelections();
          if (!maxSelections || values.length < maxSelections) {
            values.push(option.value);
            changed = true;
          }
        } else {
          const minSelections = this.minSelections();
          if (!minSelections || values.length > minSelections) {
            values.splice(index, 1);
            changed = true;
          }
        }

        if (changed) {
          this.value.set(values);
          this.onChange(values);
          this.updateSelectedLabel();
        }
      } else {
        this.value.set(option.value);
        this.onChange(option.value);
        this.updateSelectedLabel();
        this.close();
      }

      this.onTouched();
      this.touched.set(true);
    }
  }

  isSelected(option: SelectOption<T>): boolean {
    const currentValue = this.value();
    if (this.multiple() && Array.isArray(currentValue)) {
      return currentValue.some(v => this.compareWith()(v, option.value));
    }
    return currentValue !== null && this.compareWith()(currentValue as T, option.value);
  }

  toggle(): void {
    if (!this.disabled() && !this.loading()) {
      const newValue = !this.isOpenSignal();
      this.isOpenSignal.set(newValue);
      if (newValue) {
        this.opened.emit();
      } else {
        this.activeDescendantId.set(null);
        this.closed.emit();
      }
    }
  }

  close(): void {
    if (this.isOpenSignal()) {
      this.isOpenSignal.set(false);
      this.focusedOptionIndex.set(-1);
      this.activeDescendantId.set(null);
      this.searchTermSignal.set('');
      this.closed.emit();
    }
  }

  clear(event: Event): void {
    event.stopPropagation();
    if (!this.disabled() && !this.loading()) {
      const newValue = this.multiple() ? [] : null;
      this.value.set(newValue);
      this.onChange(newValue);
      this.updateSelectedLabel();
      this.onTouched();
      this.touched.set(true);
    }
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTermSignal.set(term);
    if (term.length >= (this.searchConfig().minLength ?? 1)) {
      this.searched.emit(term);
    }
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (
      element.scrollHeight - element.scrollTop === element.clientHeight
    ) {
      this.scrollEnd.emit();
    }
  }

  private updateSelectedLabel(): void {
    const currentValue = this.value();
    const currentOptions = this.flattenOptions(this.options());

    if (this.multiple() && Array.isArray(currentValue)) {
      const selected = currentOptions.filter(opt =>
        currentValue.some(v => this.compareWith()(v, opt.value))
      );
      if (selected.length > 0) {
        const labels = selected.map(opt => opt.label);
        this.selectedLabelSignal.set(labels.join(', '));
      } else {
        this.selectedLabelSignal.set('');
      }
    } else {
      const selected = currentOptions.find(opt =>
        currentValue !== null && this.compareWith()(opt.value, currentValue as T)
      );
      if (selected) {
        this.selectedLabelSignal.set(selected.label);
      } else {
        this.selectedLabelSignal.set('');
      }
    }
    this.cdr.markForCheck();
  }

  private flattenOptions(options: (SelectOption<T> | SelectOptionGroup<T>)[]): SelectOption<T>[] {
    return options.reduce((acc, opt) => {
      if (this.isOptionGroup(opt)) {
        return [...acc, ...opt.options];
      }
      return [...acc, opt];
    }, [] as SelectOption<T>[]);
  }
}
