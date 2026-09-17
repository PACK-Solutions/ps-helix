import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  model,
  output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MenuItem, MenuMode, MenuVariant, MenuItemContext } from './menu.types';
import { PshTooltipComponent } from '../tooltip/tooltip.component';
import { MENU_CONFIG } from './menu.tokens';

@Component({
  selector: 'psh-menu',
  imports: [NgTemplateOutlet, PshTooltipComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshMenuComponent<T = string> {
  private readonly config = inject(MENU_CONFIG);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private focusTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly mode = input<MenuMode>(this.config.mode ?? 'vertical');
  readonly variant = input<MenuVariant>(this.config.variant ?? 'default');
  readonly collapsible = input(this.config.collapsible ?? false);
  readonly ariaLabels = input<Record<string, string>>({
    disabled: 'Disabled',
    submenu: 'Submenu',
    expand: 'Expand menu',
    collapse: 'Collapse menu'
  });

  readonly items = input.required<MenuItem<T>[]>();

  /**
   * Replaces the content of every menu item.
   *
   * `MenuItem` described an item completely — icon, content, badge — and the component had no
   * `ng-content`, so anything else meant `::ng-deep`.
   */
  readonly itemTemplate = input<TemplateRef<MenuItemContext<T>>>();

  /**
   * Name of the navigation landmark. There was none, so a page with a sidebar menu and a
   * top menu announced two landmarks both called "navigation".
   */
  readonly ariaLabel = input<string>();

  protected itemContext(item: MenuItem<T>, index: number, withLabel: boolean): MenuItemContext<T> {
    return { $implicit: item, index, withLabel, expanded: this.isExpanded(item) };
  }

  readonly collapsed = model(false);
  readonly expandedItemIds = model<string[]>([]);

  itemClicked = output<MenuItem<T>>();
  submenuToggled = output<{ item: MenuItem<T>; expanded: boolean }>();

  protected readonly expandedItemsSet = computed(() => new Set(this.expandedItemIds()));

  readonly state = computed(() => this.getState());

  readonly showTooltip = computed(() => this.collapsed() && this.mode() === 'vertical');

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.focusTimeout !== null) clearTimeout(this.focusTimeout);
    });
  }

  private getState(): string {
    if (this.collapsed()) return 'collapsed';
    if (this.collapsible()) return 'collapsible';
    return this.mode();
  }

  handleItemClick(item: MenuItem<T>, event: Event, isChild: boolean): void {
    if (isChild) {
      event.stopPropagation();
    }
    this.toggleItem(item, event);
  }

  toggleItem(item: MenuItem<T>, event?: Event): void {
    if (item.disabled) return;

    if (item.children?.length) {
      event?.preventDefault();
      this.toggleItemExpansion(item.id);
      const expanded = this.expandedItemsSet().has(item.id);
      this.submenuToggled.emit({ item, expanded });
    } else {
      this.itemClicked.emit(item);
    }
  }

  toggleCollapse(): void {
    if (this.collapsible()) {
      this.collapsed.update((v) => !v);
    }
  }

  isExpanded(item: MenuItem<T>): boolean {
    return this.expandedItemsSet().has(item.id);
  }

  expandItem(itemId: string): void {
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
    const current = this.expandedItemIds();
    if (current.includes(itemId)) {
      this.expandedItemIds.set(current.filter(id => id !== itemId));
    } else {
      this.expandedItemIds.set([...current, itemId]);
    }
  }

  expandAll(): void {
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
      if (this.focusTimeout !== null) clearTimeout(this.focusTimeout);

      // Handle kept so the callback cannot run against a detached DOM after the menu is
      // destroyed. Scoped to this host too: a document-wide query matches the item with
      // the same id in any other menu instance on the page.
      this.focusTimeout = setTimeout(() => {
        this.focusTimeout = null;
        const host = this.elementRef.nativeElement as HTMLElement;
        const link = host.querySelector(`[data-menu-item-id="${item.id}"]`) as HTMLElement | null;
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