import { ChangeDetectionStrategy, Component, computed, effect, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem, MenuMode, MenuVariant } from './menu.types';
import { PshTooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'psh-menu',
  imports: [CommonModule, PshTooltipComponent],
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
  expandedItemIds = model<string[]>([]);

  itemClick = output<MenuItem<T>>();
  submenuToggle = output<{ item: MenuItem<T>; expanded: boolean }>();

  protected expandedItemsSet = computed(() => new Set(this.expandedItemIds()));

  state = computed(() => this.getState());

  showTooltip = computed(() => this.collapsed() && this.mode() === 'vertical');

  constructor() {
    effect(() => {
      if (this.collapsed()) {
        this.expandedItemIds.set([]);
      }
    });
  }

  private getState(): string {
    if (this.collapsed()) return 'collapsed';
    if (this.collapsible()) return 'collapsible';
    return this.mode();
  }

  toggleItem(item: MenuItem<T>, event?: Event): void {
    if (item.disabled) return;

    if (item.children?.length) {
      event?.preventDefault();
      this.toggleItemExpansion(item.id);
      const expanded = this.expandedItemsSet().has(item.id);
      this.submenuToggle.emit({ item, expanded });
    } else {
      this.itemClick.emit(item);
    }
  }

  toggleCollapse(): void {
    if (this.collapsible()) {
      this.collapsed.update((v) => !v);
    }
  }

  isExpanded(item: MenuItem<T>): boolean {
    return !this.collapsed() && this.expandedItemsSet().has(item.id);
  }

  expandItem(itemId: string): void {
    if (this.collapsed()) return;
    const current = this.expandedItemIds();
    if (!current.includes(itemId)) {
      this.expandedItemIds.set([...current, itemId]);
    }
  }

  collapseItem(itemId: string): void {
    const current = this.expandedItemIds();
    if (current.includes(itemId)) {
      this.expandedItemIds.set(current.filter(id => id !== itemId));
    }
  }

  toggleItemExpansion(itemId: string): void {
    if (this.collapsed()) return;
    const current = this.expandedItemIds();
    if (current.includes(itemId)) {
      this.expandedItemIds.set(current.filter(id => id !== itemId));
    } else {
      this.expandedItemIds.set([...current, itemId]);
    }
  }

  expandAll(): void {
    if (this.collapsed()) return;
    const allIds = this.collectItemIdsWithChildren(this.items());
    this.expandedItemIds.set(allIds);
  }

  collapseAll(): void {
    this.expandedItemIds.set([]);
  }

  private collectItemIdsWithChildren(items: MenuItem<T>[]): string[] {
    const ids: string[] = [];
    for (const item of items) {
      if (item.children?.length) {
        ids.push(item.id);
        ids.push(...this.collectItemIdsWithChildren(item.children));
      }
    }
    return ids;
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