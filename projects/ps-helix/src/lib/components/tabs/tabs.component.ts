import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  InjectionToken
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsVariant, TabsSize, Tab, TabsConfig, TabChangeEvent } from './tabs.types';
import { PshTabComponent } from './tab.component';

export const TABS_CONFIG = new InjectionToken<Partial<TabsConfig>>('TABS_CONFIG', {
  factory: () => ({
    variant: 'default',
    size: 'medium',
    activeIndex: 0,
    animated: true
  })
});

export const TABS_STYLES = new InjectionToken<Record<string, string>[]>('TABS_STYLES', {
  factory: () => []
});

@Component({
  selector: 'psh-tabs',
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    'role': 'region',
    '[attr.aria-label]': 'ariaLabel() || "Navigation par onglets"'
  }
})
export class PshTabsComponent {
  private config = inject(TABS_CONFIG);
  private styles = inject(TABS_STYLES, { optional: true }) ?? [];

  private defaultTabs: Tab[] = [
    { header: 'Onglet 1', content: 'Contenu de l\'onglet 1' },
    { header: 'Onglet 2', content: 'Contenu de l\'onglet 2' },
    { header: 'Onglet 3', content: 'Contenu de l\'onglet 3' }
  ];

  variant = input<TabsVariant>(this.config.variant ?? 'default');
  size = input<TabsSize>(this.config.size ?? 'medium');
  animated = input(this.config.animated ?? true);
  tabs = input<Tab[]>();
  ariaLabel = input<string>();
  ariaOrientation = input<'horizontal' | 'vertical'>('horizontal');

  activeIndex = model(this.config.activeIndex ?? 0);

  tabComponents = contentChildren(PshTabComponent);

  private tabsSignal = signal<Tab[]>(this.defaultTabs);

  tabsToDisplay = computed(() => {
    const inputTabs = this.tabs();
    if (inputTabs && inputTabs.length > 0) return inputTabs;

    const components = this.tabComponents();
    if (components.length > 0) {
      return components.map(c => c.toTabData());
    }

    const signalTabs = this.tabsSignal();
    if (signalTabs.length > 0 && signalTabs !== this.defaultTabs) {
      return signalTabs;
    }

    return this.defaultTabs;
  });

  activeIndexChange = output<number>();
  tabChange = output<TabChangeEvent>();

  hostClasses = computed(() => {
    const classes = ['tabs-wrapper'];
    const size = this.size();
    const variant = this.variant();

    if (size !== 'medium') classes.push(`tabs-${size}`);
    classes.push(`tabs-${variant}`);
    if (this.animated()) classes.push('tabs-animated');

    return classes.join(' ');
  });

  customStyles = computed(() => Object.assign({}, ...this.styles));

  constructor() {
    effect(() => {
      const tabs = this.tabComponents();
      const currentIndex = this.activeIndex();
      tabs.forEach((tab, index) => {
        tab.setActive(index === currentIndex);
      });
    });

    effect(() => {
      const currentIndex = this.activeIndex();
      const tabs = this.tabsToDisplay();
      if (currentIndex >= tabs.length) {
        this.activeIndex.set(Math.max(0, tabs.length - 1));
      }
    });
  }

  handleKeyDown(event: KeyboardEvent, index: number): void {
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
        this.selectTab(0);
        break;
      case 'End':
        event.preventDefault();
        this.selectTab(this.tabsToDisplay().length - 1);
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

  getActiveTab(): Tab | undefined {
    return this.tabsToDisplay()[this.activeIndex()];
  }

  setTabsFromLegacyContent(tabs: Tab[]): void {
    this.tabsSignal.set(tabs);
  }
}
