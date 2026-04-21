import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
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
}