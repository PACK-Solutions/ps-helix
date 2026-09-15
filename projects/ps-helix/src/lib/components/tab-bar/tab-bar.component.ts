import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChildren,
  InjectionToken
} from '@angular/core';
import { TabBarItem, TabBarConfig, TabBarChangeEvent } from './tab-bar.types';

/**
 * Token d'injection pour la configuration globale de la barre d'onglets
 */
export const TAB_BAR_CONFIG = new InjectionToken<Partial<TabBarConfig>>('TAB_BAR_CONFIG', {
  factory: () => ({
    disabled: false,
    position: 'bottom',
    animated: true
  })
});


@Component({
  selector: 'psh-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.top]': 'position() === "top"',
    '[class.animated]': 'animated()',
    'role': 'tablist',
    '[attr.aria-label]': '"Navigation par onglets"'
  }
})
export class PshTabBarComponent {
  private config = inject(TAB_BAR_CONFIG);
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  // Model inputs with defaults from config
  disabled = model(this.config.disabled ?? false);
  position = model<'bottom' | 'top'>(this.config.position ?? 'bottom');
  animated = model(this.config.animated ?? true);
  activeIndex = model(0);

  // Regular inputs
  items = input.required<TabBarItem[]>();

  // Outputs
  tabChange = output<TabBarChangeEvent>();

  selectTab(index: number): void {
    const items = this.items();
    const previousIndex = this.activeIndex();
    const selectedItem = items[index];

    if (this.disabled() ||
        previousIndex === index ||
        index < 0 ||
        index >= items.length ||
        !selectedItem ||
        selectedItem.disabled) {
      return;
    }

    this.activeIndex.set(index);
    this.tabChange.emit({
      index,
      item: selectedItem,
      previousIndex
    });
  }

  /**
   * Arrow/Home/End navigation, per the ARIA tablist pattern: the arrows move between
   * tabs and activate as they go, wrapping at both ends and skipping disabled items.
   * `Tab` itself must leave the tablist, which is why the buttons carry a roving
   * tabindex rather than all sitting in the tab order.
   */
  onKeydown(event: KeyboardEvent, index: number): void {
    let target: number | null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = this.nextEnabledIndex(index, 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        target = this.nextEnabledIndex(index, -1);
        break;
      case 'Home':
        target = this.nextEnabledIndex(-1, 1);
        break;
      case 'End':
        target = this.nextEnabledIndex(this.items().length, -1);
        break;
      default:
        return;
    }

    if (target === null) return;

    event.preventDefault();
    this.selectTab(target);
    this.tabButtons()[target]?.nativeElement.focus();
  }

  /** Walks `step` at a time from `from`, wrapping, until it lands on a selectable tab. */
  private nextEnabledIndex(from: number, step: number): number | null {
    const items = this.items();
    if (items.length === 0 || this.disabled()) return null;

    for (let offset = 1; offset <= items.length; offset++) {
      const candidate = (((from + step * offset) % items.length) + items.length) % items.length;
      if (!items[candidate]?.disabled) return candidate;
    }
    return null;
  }
}