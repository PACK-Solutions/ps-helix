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
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { SelectOption, SelectOptionGroup, SelectSize, SelectVariant, SearchConfig } from './select.types';

interface FlatOption<T> {
  option: SelectOption<T>;
  effectiveDisabled: boolean;
}

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
    '[class.outlined]': 'variant() === "outlined"',
    '[class.filled]': 'variant() === "filled"',
    '[class.error]': '!!error()',
    '[class.success]': '!!success()',
    '[class.disabled]': 'disabled()',
    '[class.loading]': 'loading()',
    '[attr.aria-expanded]': 'isOpen().toString()',
    '[attr.data-state]': 'state()'
  }
})
export class PshSelectComponent<T = unknown> implements ControlValueAccessor, FormValueControl<T | T[] | null> {
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly selectId = `psh-sel-${Math.random().toString(36).substring(2, 11)}`;

  readonly value = model<T | T[] | null>(null);
  readonly disabled = model<boolean>(false);
  readonly touched = model<boolean>(false);

  size = input<SelectSize>('medium');
  variant = input<SelectVariant>('outlined');
  searchable = input(false);
  multiple = input(false);
  clearable = input(false);
  loading = input(false);
  fullWidth = input(false);
  required = input(false);

  options = input<(SelectOption<T> | SelectOptionGroup<T>)[]>([]);
  label = input('');
  placeholder = input<string>('Sélectionner une option');
  multiplePlaceholder = input<string>('Sélectionner des options');
  error = input<string | null | undefined>(null);
  success = input<string | null | undefined>(null);
  hint = input<string | null | undefined>(null);
  ariaLabel = input<string | null>(null);
  maxSelections = input<number | undefined>(undefined);
  minSelections = input<number | undefined>(undefined);
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  searchConfig = input<SearchConfig>({
    debounceTime: 300,
    placeholder: 'Rechercher...',
    minLength: 1
  });

  private readonly isOpenSignal = signal(false);
  private readonly searchTermSignal = signal('');
  readonly focusedIndex = signal(-1);

  opened = output<void>();
  closed = output<void>();
  searched = output<string>();
  scrollEnd = output<void>();

  isOpen = computed(() => this.isOpenSignal());
  searchTerm = computed(() => this.searchTermSignal());

  state = computed(() => {
    if (this.disabled()) return 'disabled';
    if (this.error()) return 'error';
    if (this.success()) return 'success';
    return 'default';
  });

  computedAriaLabel = computed(() => this.ariaLabel() || this.label() || this.placeholder());

  describedBy = computed(() => {
    if (this.error()) return 'error-message';
    if (this.success()) return 'success-message';
    if (this.hint()) return 'hint-message';
    return null;
  });

  flatFilteredOptions = computed<FlatOption<T>[]>(() => {
    const opts = this.filteredOptions();
    const result: FlatOption<T>[] = [];
    for (const item of opts) {
      if (this.isOptionGroup(item)) {
        for (const opt of item.options) {
          result.push({ option: opt, effectiveDisabled: !!(item.disabled || opt.disabled) });
        }
      } else {
        result.push({ option: item, effectiveDisabled: !!item.disabled });
      }
    }
    return result;
  });

  activeDescendant = computed(() => {
    const idx = this.focusedIndex();
    const flat = this.flatFilteredOptions();
    if (idx < 0 || idx >= flat.length) return null;
    const item = flat[idx];
    if (!item) return null;
    return `${this.selectId}-${item.option.value}`;
  });

  selectedLabel = computed(() => {
    const currentValue = this.value();
    const currentOptions = this.flattenOptions(this.options());

    if (currentValue === null || currentValue === undefined) {
      return this.multiple() ? this.multiplePlaceholder() : this.placeholder();
    }

    if (this.multiple() && Array.isArray(currentValue)) {
      const selected = currentOptions.filter(opt =>
        currentValue.some(v => this.compareWith()(v, opt.value))
      );
      return selected.length > 0 ? selected.map(o => o.label).join(', ') : this.multiplePlaceholder();
    }

    const selected = currentOptions.find(opt => this.compareWith()(opt.value, currentValue as T));
    return selected ? selected.label : this.placeholder();
  });

  filteredOptions = computed(() => {
    const term = this.searchTermSignal().toLowerCase();
    const opts = this.options();
    if (!term) return opts;

    return opts.map(opt => {
      if (this.isOptionGroup(opt)) {
        const filtered = opt.options.filter(o => {
          const matchesLabel = o.label.toLowerCase().includes(term);
          const matchesDesc = o.description ? o.description.toLowerCase().includes(term) : false;
          return matchesLabel || matchesDesc;
        });
        return filtered.length > 0 ? { ...opt, options: filtered } : null;
      }
      const matchesLabel = opt.label.toLowerCase().includes(term);
      const matchesDesc = opt.description ? opt.description.toLowerCase().includes(term) : false;
      return (matchesLabel || matchesDesc) ? opt : null;
    }).filter((opt): opt is (SelectOption<T> | SelectOptionGroup<T>) => opt !== null);
  });

  constructor() {
    const clickHandler = (event: MouseEvent) => {
      if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
        this.close();
      }
    };
    document.addEventListener('click', clickHandler);
    this.destroyRef.onDestroy(() => document.removeEventListener('click', clickHandler));
  }

  private onChange = (_: unknown) => {};
  private onTouched = () => {};

  writeValue(value: unknown): void {
    this.value.set(value as T | T[] | null);
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  toggle(): void {
    if (this.disabled() || this.loading()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.isOpenSignal.set(true);
      this.opened.emit();
    }
  }

  close(): void {
    if (!this.isOpenSignal()) return;
    this.isOpenSignal.set(false);
    this.searchTermSignal.set('');
    this.focusedIndex.set(-1);
    this.closed.emit();
  }

  select(option: SelectOption<T>, groupDisabled = false): void {
    if (this.disabled() || option.disabled || groupDisabled) return;

    if (this.multiple()) {
      const current = Array.isArray(this.value()) ? [...(this.value() as T[])] : [];
      const index = current.findIndex(v => this.compareWith()(v, option.value));
      if (index === -1) {
        const max = this.maxSelections();
        if (max !== undefined && current.length >= max) return;
        current.push(option.value);
      } else {
        const min = this.minSelections();
        if (min !== undefined && current.length <= min) return;
        current.splice(index, 1);
      }
      this.value.set(current as T | T[] | null);
      this.onChange(current);
    } else {
      this.value.set(option.value as T | T[] | null);
      this.onChange(option.value);
      this.close();
    }
    this.onTouched();
    this.touched.set(true);
  }

  clear(event: MouseEvent): void {
    event.stopPropagation();
    const newVal = (this.multiple() ? [] : null) as T | T[] | null;
    this.value.set(newVal);
    this.onChange(this.value());
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTermSignal.set(term);
    this.searched.emit(term);
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (el.scrollHeight - el.scrollTop === el.clientHeight) {
      this.scrollEnd.emit();
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggle();
        } else if (this.focusedIndex() >= 0) {
          const flat = this.flatFilteredOptions();
          const item = flat[this.focusedIndex()];
          if (item && !item.effectiveDisabled) {
            this.select(item.option);
          }
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggle();
        } else {
          this.moveFocus(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        event.preventDefault();
        this.focusLast();
        break;
      case 'Escape':
        this.close();
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  protected isOptionGroup(item: SelectOption<T> | SelectOptionGroup<T>): item is SelectOptionGroup<T> {
    return 'options' in item;
  }

  protected getOptionKey(item: SelectOption<T> | SelectOptionGroup<T>): string {
    return this.isOptionGroup(item) ? `g-${item.label}` : `o-${item.label}`;
  }

  protected isSelected(option: SelectOption<T>): boolean {
    const val = this.value();
    if (this.multiple() && Array.isArray(val)) {
      return val.some(v => this.compareWith()(v, option.value));
    }
    return val !== null && this.compareWith()(val as T, option.value);
  }

  protected hasValue(): boolean {
    const val = this.value();
    if (this.multiple()) return Array.isArray(val) && val.length > 0;
    return val !== null && val !== undefined;
  }

  protected getFlatIndex(option: SelectOption<T>): number {
    return this.flatFilteredOptions().findIndex(item => item.option === option);
  }

  protected focusSelect(): void {
    this.elementRef.nativeElement.querySelector('.select-trigger')?.focus();
  }

  private flattenOptions(options: (SelectOption<T> | SelectOptionGroup<T>)[]): SelectOption<T>[] {
    return options.reduce((acc, opt) => this.isOptionGroup(opt) ? [...acc, ...opt.options] : [...acc, opt], [] as SelectOption<T>[]);
  }

  private moveFocus(direction: 1 | -1): void {
    const flat = this.flatFilteredOptions();
    if (flat.length === 0) return;
    const current = this.focusedIndex();
    let next = current;
    for (let i = 0; i < flat.length; i++) {
      next = ((next + direction) % flat.length + flat.length) % flat.length;
      if (!flat[next]!.effectiveDisabled) {
        this.focusedIndex.set(next);
        return;
      }
    }
  }

  private focusFirst(): void {
    const flat = this.flatFilteredOptions();
    for (let i = 0; i < flat.length; i++) {
      if (!flat[i]!.effectiveDisabled) {
        this.focusedIndex.set(i);
        return;
      }
    }
  }

  private focusLast(): void {
    const flat = this.flatFilteredOptions();
    for (let i = flat.length - 1; i >= 0; i--) {
      if (!flat[i]!.effectiveDisabled) {
        this.focusedIndex.set(i);
        return;
      }
    }
  }
}
