import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem, MenuMode, MenuVariant } from './menu.types';

@Component({
  selector: 'psh-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshMenuComponent<T = string> {

  mode = input<MenuMode>('vertical');
  variant = input<MenuVariant>('default');
  collapsible = input(false);
  ariaLabels = input<Record<string, string>>({
    disabled: 'Disabled',
    submenu: 'Submenu',
    expand: 'Expand menu',
    collapse: 'Collapse menu'
  });

  items = input<MenuItem<T>[]>([]);

  collapsed = model(false);

  itemClick = output<MenuItem<T>>();
  submenuToggle = output<{ item: MenuItem<T>; expanded: boolean }>();

  expandedItems = signal(new Set<string>());

  state = computed(() => this.getState());

  private getState(): string {
    if (this.collapsed()) return 'collapsed';
    if (this.collapsible()) return 'collapsible';
    return this.mode();
  }

  toggleItem(item: MenuItem<T>, event?: Event): void {
    if (item.disabled) return;

    if (item.children?.length) {
      event?.preventDefault();
      const newExpanded = new Set(this.expandedItems());
      const wasExpanded = newExpanded.has(item.id);

      if (wasExpanded) {
        newExpanded.delete(item.id);
        this.expandedItems.set(newExpanded);
        this.submenuToggle.emit({ item, expanded: false });
      } else if (!this.collapsed()) {
        newExpanded.add(item.id);
        this.expandedItems.set(newExpanded);
        this.submenuToggle.emit({ item, expanded: true });
      }
    } else {
      this.itemClick.emit(item);
    }
  }

  toggleCollapse(): void {
    if (this.collapsible()) {
      if (!this.collapsed()) {
        this.expandedItems.set(new Set());
      }
      this.collapsed.update((v) => !v);
    }
  }

  isExpanded(item: MenuItem<T>): boolean {
    return !this.collapsed() && this.expandedItems().has(item.id);
  }

  getAriaLabel(item: MenuItem<T>): string {
    const base = item.content;
    if (item.disabled) {
      return `${base} (${this.ariaLabels()['disabled']})`;
    }
    if (item.children?.length) {
      return `${base} (${this.ariaLabels()['submenu']})`;
    }
    return base;
  }

  handleKeyDown(event: KeyboardEvent, item: MenuItem<T>, index: number): void {
    if (item.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleItem(item, event);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem(index);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem(index);
        break;

      case 'ArrowRight':
        if (item.children?.length && !this.isExpanded(item)) {
          event.preventDefault();
          this.toggleItem(item, event);
        }
        break;

      case 'ArrowLeft':
        if (item.children?.length && this.isExpanded(item)) {
          event.preventDefault();
          this.toggleItem(item, event);
        }
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
        if (this.collapsible() && !this.collapsed()) {
          event.preventDefault();
          this.toggleCollapse();
        }
        break;
    }
  }

  private focusNextItem(currentIndex: number): void {
    const items = this.items();
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    this.focusItemAtIndex(nextIndex, 1);
  }

  private focusPreviousItem(currentIndex: number): void {
    const items = this.items();
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    this.focusItemAtIndex(previousIndex, -1);
  }

  private focusFirstItem(): void {
    this.focusItemAtIndex(0, 1);
  }

  private focusLastItem(): void {
    this.focusItemAtIndex(this.items().length - 1, -1);
  }

  private focusItemAtIndex(index: number, direction: 1 | -1): void {
    const items = this.items();
    if (index < 0) {
      index = items.length - 1;
    } else if (index >= items.length) {
      index = 0;
    }

    const item = items[index];
    if (item && !item.divider && !item.disabled) {
      setTimeout(() => {
        const link = document.querySelector(`[data-menu-item-id="${item.id}"]`) as HTMLElement;
        link?.focus();
      });
    } else {
      const nextIndex = index + direction;
      if (nextIndex !== index) {
        this.focusItemAtIndex(nextIndex, direction);
      }
    }
  }
}