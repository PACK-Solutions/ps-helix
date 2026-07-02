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
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  viewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PshOverlayPositionService } from '../../a11y/overlay-position.service';
import { PshClickOutsideDirective } from '../../a11y/click-outside.directive';
import { PshPortalService, PshPortalRef } from '../../a11y/portal.service';
import { DropdownAppearance, DropdownItem, DropdownPlacement, DropdownSize, DropdownVariant } from './dropdown.types';

@Component({
  selector: 'psh-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [PshClickOutsideDirective]
})
export class PshDropdownComponent<T = string> {
  private elementRef = inject(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly overlayPosition = inject(PshOverlayPositionService);
  private readonly portal = inject(PshPortalService);
  private readonly viewContainer = inject(ViewContainerRef);

  // The menu is teleported to a body-level overlay layer on open so it escapes
  // any ancestor overflow / stacking context (a modal body, a scrollable card…).
  private readonly menuTpl = viewChild<TemplateRef<unknown>>('menuTpl');
  private portalRef: PshPortalRef | null = null;
  private readonly repositionHandler = (): void => this.reposition();

  // Regular inputs
  appearance = input<DropdownAppearance>('filled');
  variant = input<DropdownVariant>('primary');
  size = input<DropdownSize>('medium');
  placement = input<DropdownPlacement>('bottom-start');
  items = input<DropdownItem<T>[]>([]);
  label = input('Dropdown Menu');
  icon = input<string>();
  ariaLabel = input<string>();
  iconOnly = input<boolean>(false);
  iconOnlyText = input<string>();

  // Model inputs
  disabled = model(false);

  // State
  private isOpenSignal = signal(false);
  private selectedItemSignal = signal<DropdownItem<T> | null>(null);
  private focusedItemIndex = signal(-1);

  // Placement actually rendered, after viewport collision/flip. Mirrors the
  // `placement` input while closed; recomputed against the viewport on open.
  protected readonly resolvedPlacement = signal<DropdownPlacement>('bottom-start');

  // Outputs
  selected = output<DropdownItem<T>>();
  opened = output<void>();
  closed = output<void>();

  // Computed values
  isOpen = computed(() => this.isOpenSignal());
  selectedItem = computed(() => this.selectedItemSignal());

  isIconOnly = computed(() => this.iconOnly() && !!this.icon());

  computedAriaLabel = computed(() => {
    if (this.isIconOnly()) {
      return this.iconOnlyText() || this.ariaLabel() || 'Toggle dropdown menu';
    }
    return this.ariaLabel() || 'Toggle dropdown menu';
  });

  state = computed(() => this.getState());

  private getState(): string {
    if (this.disabled()) return 'disabled';
    if (this.isOpen()) return 'open';
    return 'closed';
  }

  constructor() {
    // Close on outside click. Clicks inside the menu are stopped at the menu
    // (stopPropagation); as a safety net for the teleported panel we also ignore
    // clicks whose target is inside it here.
    const clickOutside = inject(PshClickOutsideDirective);
    const sub = clickOutside.pshClickOutside.subscribe(event => {
      const target = event.target as Node | null;
      if (target && this.portalRef?.panel.contains(target)) return;
      this.close();
    });
    inject(DestroyRef).onDestroy(() => {
      sub.unsubscribe();
      this.closePanel();
    });
  }

  private openPanel(): void {
    if (!this.isBrowser || this.portalRef) return;
    const tpl = this.menuTpl();
    if (!tpl) return;
    this.portalRef = this.portal.attach(tpl, this.viewContainer);
    this.reposition();
    const view = (this.elementRef.nativeElement as HTMLElement).ownerDocument.defaultView;
    view?.addEventListener('scroll', this.repositionHandler, true);
    view?.addEventListener('resize', this.repositionHandler);
  }

  private closePanel(): void {
    const view = (this.elementRef.nativeElement as HTMLElement).ownerDocument.defaultView;
    view?.removeEventListener('scroll', this.repositionHandler, true);
    view?.removeEventListener('resize', this.repositionHandler);
    this.portalRef?.detach();
    this.portalRef = null;
    this.resolvedPlacement.set(this.placement());
  }

  private reposition(): void {
    if (!this.portalRef) return;
    const host = this.elementRef.nativeElement as HTMLElement;
    const trigger = host.querySelector('.dropdown-trigger') as HTMLElement | null;
    if (!trigger) return;

    const placement = this.overlayPosition.flipPlacement(trigger, this.placement(), {
      overlayHeight: this.portalRef.panel.offsetHeight,
      overlayWidth: this.portalRef.panel.offsetWidth,
    }) as DropdownPlacement;
    this.resolvedPlacement.set(placement);
    this.portalRef.positionByPlacement(trigger, placement, 4);
  }

  toggleDropdown(): void {
    if (!this.disabled()) {
      event?.stopPropagation();
      this.isOpenSignal.update(v => !v);
      if (this.isOpen()) {
        this.focusedItemIndex.set(0);
        this.opened.emit();
        this.openPanel();
      } else {
        this.focusedItemIndex.set(-1);
        this.closePanel();
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
      this.closePanel();
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

  handleItemKeyDown(event: KeyboardEvent, item: DropdownItem<T>, _index: number): void {
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
      const item = this.portalRef?.panel.querySelector(
        `[data-dropdown-item-index="${index}"]`,
      ) as HTMLElement | undefined;
      item?.focus();
    });
  }

}