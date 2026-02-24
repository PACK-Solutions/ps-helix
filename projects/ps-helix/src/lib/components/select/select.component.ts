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
import { SelectOption, SelectOptionGroup, SelectSize } from './select.types';

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

  options = input<(SelectOption<T> | SelectOptionGroup<T>)[]>([]);
  size = input<SelectSize>('medium');
  multiple = input(false);
  fullWidth = input(false);
  required = input(false);
  label = input('');
  placeholder = input<string>('Sélectionner une option');
  error = input<string | null | undefined>(undefined);
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);

  private readonly isOpenSignal = signal(false);
  private readonly initializedSignal = signal(false);

  opened = output<void>();
  closed = output<void>();

  isOpen = computed(() => this.isOpenSignal());
  state = computed(() => this.disabled() ? 'disabled' : this.error() ? 'error' : 'default');

  selectedLabel = computed(() => {
    const currentValue = this.value();
    const currentOptions = this.flattenOptions(this.options());

    if (!this.initializedSignal() || (currentValue === null || currentValue === undefined)) {
      return this.placeholder();
    }

    if (this.multiple() && Array.isArray(currentValue)) {
      const selected = currentOptions.filter(opt => 
        currentValue.some(v => this.compareWith()(v, opt.value))
      );
      return selected.length > 0 ? selected.map(o => o.label).join(', ') : this.placeholder();
    }

    const selected = currentOptions.find(opt => this.compareWith()(opt.value, currentValue as T));
    return selected ? selected.label : this.placeholder();
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
    if (this.disabled()) return;
    this.isOpenSignal.update(v => !v);
    this.isOpen() ? this.opened.emit() : this.closed.emit();
  }

  close(): void {
    this.isOpenSignal.set(false);
  }

  select(option: SelectOption<T>): void {
    if (this.disabled() || option.disabled) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.touched.set(true);
    this.close();
  }

  hasValue(): boolean {
    const val = this.value();
    return this.multiple() ? (Array.isArray(val) && val.length > 0) : (val !== null && val !== undefined);
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

  protected focusSelect(): void {
    this.elementRef.nativeElement.querySelector('.select-trigger')?.focus();
  }

  private flattenOptions(options: (SelectOption<T> | SelectOptionGroup<T>)[]): SelectOption<T>[] {
    return options.reduce((acc, opt) => this.isOptionGroup(opt) ? [...acc, ...opt.options] : [...acc, opt], [] as SelectOption<T>[]);
  }
}