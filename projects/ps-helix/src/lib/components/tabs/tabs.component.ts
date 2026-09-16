import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  output,
  InjectionToken,
  linkedSignal,
} from '@angular/core';
import { TabsVariant, TabsSize, Tab, TabsConfig, TabChangeEvent } from './tabs.types';
import { PshTabComponent } from './tab.component';
import { PSH_TABS, PshTabsApi } from './tabs.token';
import { pshUniqueId } from '../../utils/unique-id';

const TABS_DEFAULTS = {
  variant: 'default',
  size: 'medium',
  activeIndex: 0,
  animated: true,
} satisfies Partial<TabsConfig>;

export const TABS_CONFIG = new InjectionToken<Partial<TabsConfig>>('TABS_CONFIG', {
  factory: () => TABS_DEFAULTS,
});

@Component({
  selector: 'psh-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: PSH_TABS, useExisting: PshTabsComponent }],
  host: {
    '[class]': 'hostClasses()',
    role: 'region',
    '[attr.aria-label]': 'ariaLabel() || "Navigation par onglets"',
  },
})
export class PshTabsComponent implements PshTabsApi {
  /** Namespaces the tab and panel ids: they were `tab-0` / `panel-0` for every instance. */
  readonly idPrefix = pshUniqueId('tabs');

  private config = inject(TABS_CONFIG);

  variant = input<TabsVariant>(this.config.variant ?? 'default');
  size = input<TabsSize>(this.config.size ?? 'medium');
  animated = input(this.config.animated ?? true);
  tabs = input<Tab[]>([]);
  ariaLabel = input<string>();
  ariaOrientation = input<'horizontal' | 'vertical'>('horizontal');

  activeIndexInput = input(this.config.activeIndex ?? 0, { alias: 'activeIndex' });
  activeIndex = linkedSignal(this.activeIndexInput);

  tabComponents = contentChildren(PshTabComponent);

  tabsToDisplay = computed(() => {
    const components = this.tabComponents();
    if (components.length > 0) {
      return components.map(c => c.toTabData());
    }
    return this.tabs();
  });

  hasContentProjection = computed(() => this.tabComponents().length > 0);

  activeIndexChange = output<number>();
  tabChange = output<TabChangeEvent>();

  hostClasses = computed(() => {
    const classes = ['psh-tabs-wrapper'];
    const size = this.size();
    const variant = this.variant();

    if (size !== 'medium') classes.push(`psh-tabs-${size}`);
    classes.push(`psh-tabs-${variant}`);
    if (this.animated()) classes.push('psh-tabs-animated');

    return classes.join(' ');
  });

  constructor() {
    effect(() => {
      const tabs = this.tabComponents();
      const currentIndex = this.activeIndex();
      tabs.forEach((tab, index) => {
        tab.setIndex(index);
        tab.setActive(index === currentIndex);
      });
    });

    effect(() => {
      const currentIndex = this.activeIndex();
      const tabs = this.tabsToDisplay();
      if (tabs.length > 0 && currentIndex >= tabs.length) {
        const clampedIndex = Math.max(0, tabs.length - 1);
        this.activeIndex.set(clampedIndex);
        this.activeIndexChange.emit(clampedIndex);
      }
    });
  }

  handleKeyDown(event: KeyboardEvent, _index: number): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.selectPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.selectNext();
        break;
      case 'Home':
        event.preventDefault();
        this.selectFirst();
        break;
      case 'End':
        event.preventDefault();
        this.selectLast();
        break;
    }
  }

  selectTab(index: number): void {
    const tabs = this.tabsToDisplay();
    const tab = tabs[index];

    if (!tab || tab.disabled) return;

    const previousIndex = this.activeIndex();
    if (previousIndex !== index) {
      this.activeIndex.set(index);
      this.activeIndexChange.emit(index);
      this.tabChange.emit({ previousIndex, currentIndex: index, tab });
    }
  }

  selectNext(): void {
    const tabs = this.tabsToDisplay();
    let nextIndex = (this.activeIndex() + 1) % tabs.length;

    while (tabs[nextIndex]?.disabled && nextIndex !== this.activeIndex()) {
      nextIndex = (nextIndex + 1) % tabs.length;
    }

    if (nextIndex !== this.activeIndex()) {
      this.selectTab(nextIndex);
    }
  }

  selectPrevious(): void {
    const tabs = this.tabsToDisplay();
    let prevIndex = (this.activeIndex() - 1 + tabs.length) % tabs.length;

    while (tabs[prevIndex]?.disabled && prevIndex !== this.activeIndex()) {
      prevIndex = (prevIndex - 1 + tabs.length) % tabs.length;
    }

    if (prevIndex !== this.activeIndex()) {
      this.selectTab(prevIndex);
    }
  }

  selectFirst(): void {
    const tabs = this.tabsToDisplay();
    let firstIndex = 0;

    while (tabs[firstIndex]?.disabled && firstIndex < tabs.length - 1) {
      firstIndex++;
    }

    if (!tabs[firstIndex]?.disabled && firstIndex !== this.activeIndex()) {
      this.selectTab(firstIndex);
    }
  }

  selectLast(): void {
    const tabs = this.tabsToDisplay();
    let lastIndex = tabs.length - 1;

    while (tabs[lastIndex]?.disabled && lastIndex > 0) {
      lastIndex--;
    }

    if (!tabs[lastIndex]?.disabled && lastIndex !== this.activeIndex()) {
      this.selectTab(lastIndex);
    }
  }

  getActiveTab(): Tab | undefined {
    return this.tabsToDisplay()[this.activeIndex()];
  }

  getTabComponent(index: number): PshTabComponent | undefined {
    return this.tabComponents()[index];
  }
}
