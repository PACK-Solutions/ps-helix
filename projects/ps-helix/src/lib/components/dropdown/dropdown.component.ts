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
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownItem, DropdownPlacement } from './dropdown.types';

@Component({
  selector: 'psh-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PshDropdownComponent<T = string> implements OnDestroy {
  private elementRef = inject(ElementRef);
  private clickOutsideHandler: ((event: MouseEvent) => void) | null = null;

  // Regular inputs
  variant = input<'primary' | 'secondary' | 'outline' | 'text'>('primary');
  placement = input<DropdownPlacement>('bottom-start');
  items = input<DropdownItem<T>[]>([]);
  label = input('Dropdown Menu');
  icon = input<string>();
  ariaLabel = input<string>();

  // Model inputs
  disabled = model(false);

  // State
  private isOpenSignal = signal(false);
  private selectedItemSignal = signal<DropdownItem<T> | null>(null);
  private focusedItemIndex = signal(-1);

  // Outputs
  selected = output<DropdownItem<T>>();
  opened = output<void>();
  closed = output<void>();

  // Computed values
  isOpen = computed(() => this.isOpenSignal());
  selectedItem = computed(() => this.selectedItemSignal());

  computedAriaLabel = computed(() => 
    this.ariaLabel() || 'Toggle dropdown menu'
  );

  state = computed(() => this.getState());

  private getState(): string {
    if (this.disabled()) return 'disabled';
    if (this.isOpen()) return 'open';
    return 'closed';
  }

  constructor() {
    this.setupClickOutsideListener();
  }

  private setupClickOutsideListener(): void {
    this.clickOutsideHandler = (event: MouseEvent) => {
      if (this.isOpen()) {
        const target = event.target as HTMLElement;
        if (!this.elementRef.nativeElement.contains(target)) {
          this.close();
        }
      }
    };
    document.addEventListener('click', this.clickOutsideHandler);
  }

  toggleDropdown(): void {
    if (!this.disabled()) {
      event?.stopPropagation();
      this.isOpenSignal.update(v => !v);
      if (this.isOpen()) {
        this.focusedItemIndex.set(0);
        this.opened.emit();
      } else {
        this.focusedItemIndex.set(-1);
        this.closed.emit();
      }
    }
  }

  selectItem(item: DropdownItem<T>): void {
    if (!item.disabled) {
      this.selectedItemSignal.set(item);
      this.selected.emit(item);
      this.close();
    }
  }

  close(): void {
    if (this.isOpen()) {
      this.isOpenSignal.set(false);
      this.focusedItemIndex.set(-1);
      this.closed.emit();
    }
  }

  handleTriggerKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          this.focusNextItem();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          this.focusPreviousItem();
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
        }
        break;
    }
  }

  handleItemKeyDown(event: KeyboardEvent, item: DropdownItem<T>, index: number): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectItem(item);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem();
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstItem();
        break;

      case 'End':
        event.preventDefault();
        this.focusLastItem();
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;

      case 'Tab':
        this.close();
        break;
    }
  }

  private focusNextItem(): void {
    const items = this.items();
    if (items.length === 0) return;

    const currentIndex = this.focusedItemIndex();
    let nextIndex = currentIndex + 1;

    while (nextIndex < items.length && items[nextIndex]?.disabled) {
      nextIndex++;
    }

    if (nextIndex >= items.length) {
      nextIndex = 0;
      while (nextIndex < items.length && items[nextIndex]?.disabled) {
        nextIndex++;
      }
    }

    if (nextIndex < items.length) {
      this.focusedItemIndex.set(nextIndex);
      this.focusItemAtIndex(nextIndex);
    }
  }

  private focusPreviousItem(): void {
    const items = this.items();
    if (items.length === 0) return;

    const currentIndex = this.focusedItemIndex();
    let previousIndex = currentIndex - 1;

    while (previousIndex >= 0 && items[previousIndex]?.disabled) {
      previousIndex--;
    }

    if (previousIndex < 0) {
      previousIndex = items.length - 1;
      while (previousIndex >= 0 && items[previousIndex]?.disabled) {
        previousIndex--;
      }
    }

    if (previousIndex >= 0) {
      this.focusedItemIndex.set(previousIndex);
      this.focusItemAtIndex(previousIndex);
    }
  }

  private focusFirstItem(): void {
    const items = this.items();
    let index = 0;
    while (index < items.length && items[index]?.disabled) {
      index++;
    }
    if (index < items.length) {
      this.focusedItemIndex.set(index);
      this.focusItemAtIndex(index);
    }
  }

  private focusLastItem(): void {
    const items = this.items();
    let index = items.length - 1;
    while (index >= 0 && items[index]?.disabled) {
      index--;
    }
    if (index >= 0) {
      this.focusedItemIndex.set(index);
      this.focusItemAtIndex(index);
    }
  }

  private focusItemAtIndex(index: number): void {
    setTimeout(() => {
      const item = this.elementRef.nativeElement.querySelector(
        `[data-dropdown-item-index="${index}"]`
      ) as HTMLElement;
      item?.focus();
    });
  }

  ngOnDestroy(): void {
    if (this.clickOutsideHandler) {
      document.removeEventListener('click', this.clickOutsideHandler);
    }
  }
}