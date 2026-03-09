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
import type { FormValueControl } from '../../types/forms-signals.types';
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
    '[class.select-full-width]': 'fullWidth()',
    '[class.select-small]': 'size() === "small"',
    '[class.select-large]': 'size() === "large"',
    '[class.select-error]': '!!error()',
    '[class.select-disabled]': 'disabled()',
    '[class.select-loading]': 'loading()',
    '[attr.aria-expanded]': 'isOpen().toString()',
    '[attr.data-state]': 'state()'
  }
})
export class PshSelectComponent<T = unknown> implements ControlValueAccessor, AfterContentInit, FormValueControl<T | T[] | null> {
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly selectId = `psh-sel-${Math.random().toString(36).substring(2, 11)}`;

  readonly value = model<T | T[] | null>(null);
  readonly disabled = model<boolean>(false);
  readonly touched = model(false);

  // Rétablissement de l'API complète pour la démo
  size = input<SelectSize>('medium');
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
  error = input<string | null | undefined>(undefined);
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  searchConfig = input<SearchConfig>({
    debounceTime: 300,
    placeholder: 'Rechercher...',
    minLength: 1
  });

  private readonly isOpenSignal = signal(false);
  private readonly searchTermSignal = signal('');
  private readonly initializedSignal = signal(false);

  opened = output<void>();
  closed = output<void>();
  searched = output<string>(); // Émet une string, pas un Event
  scrollEnd = output<void>();

  isOpen = computed(() => this.isOpenSignal());
  searchTerm = computed(() => this.searchTermSignal());
  state = computed(() => this.disabled() ? 'disabled' : this.error() ? 'error' : 'default');

  selectedLabel = computed(() => {
    const currentValue = this.value();
    const currentOptions = this.flattenOptions(this.options());

    if (!this.initializedSignal() || (currentValue === null || currentValue === undefined)) {
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
        const filtered = opt.options.filter(o => o.label.toLowerCase().includes(term));
        return filtered.length > 0 ? { ...opt, options: filtered } : null;
      }
      return opt.label.toLowerCase().includes(term) ? opt : null;
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

  ngAfterContentInit() {
    this.initializedSignal.set(true);
  }

  private onChange = (_: unknown) => {};
  private onTouched = () => {};

  writeValue(value: unknown): void {
    this.value.set(value as T | T[] | null);
    this.initializedSignal.set(true);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  toggle(): void {
    if (this.disabled() || this.loading()) return;
    this.isOpenSignal.update(v => !v);
    this.isOpen() ? this.opened.emit() : this.closed.emit();
  }

  close(): void {
    this.isOpenSignal.set(false);
    this.searchTermSignal.set('');
  }

  select(option: SelectOption<T>): void {
    if (this.disabled() || option.disabled) return;

    if (this.multiple()) {
      const current = Array.isArray(this.value()) ? [...(this.value() as T[])] : [];
      const index = current.findIndex(v => this.compareWith()(v, option.value));
      if (index === -1) {
        current.push(option.value);
      } else {
        current.splice(index, 1);
      }
      this.value.set(current);
      this.onChange(current);
    } else {
      this.value.set(option.value);
      this.onChange(option.value);
      this.close();
    }
    this.onTouched();
    this.touched.set(true);
  }

  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.value.set(this.multiple() ? [] : null);
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

  private flattenOptions(options: (SelectOption<T> | SelectOptionGroup<T>)[]): SelectOption<T>[] {
    return options.reduce((acc, opt) => this.isOptionGroup(opt) ? [...acc, ...opt.options] : [...acc, opt], [] as SelectOption<T>[]);
  }

  protected focusSelect(): void {
    this.elementRef.nativeElement.querySelector('.select-trigger')?.focus();
  }
}