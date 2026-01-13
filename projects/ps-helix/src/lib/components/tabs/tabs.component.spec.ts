import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshTabsComponent, TABS_CONFIG } from './tabs.component';
import { PshTabComponent } from './tab.component';
import { Tab, TabsVariant, TabsSize, TabChangeEvent } from './tabs.types';

@Component({
  selector: 'psh-test-host',
  imports: [PshTabsComponent, PshTabComponent],
  template: `
    <psh-tabs
      [variant]="variant"
      [size]="size"
      [animated]="animated"
      [ariaLabel]="ariaLabel"
      [ariaOrientation]="ariaOrientation"
      [(activeIndex)]="activeIndex"
      (activeIndexChange)="onActiveIndexChange($event)"
      (tabChange)="onTabChange($event)"
    >
      <psh-tab
        [header]="'Tab 1'"
        [icon]="tab1Icon"
        [disabled]="tab1Disabled"
        [ariaLabel]="tab1AriaLabel"
      >
        <p>Tab 1 content</p>
      </psh-tab>
      <psh-tab
        [header]="'Tab 2'"
        [disabled]="tab2Disabled"
      >
        <p>Tab 2 content</p>
      </psh-tab>
      <psh-tab
        [header]="'Tab 3'"
        [disabled]="tab3Disabled"
      >
        <p>Tab 3 content</p>
      </psh-tab>
    </psh-tabs>
  `
})
class TestHostComponent {
  variant: TabsVariant = 'default';
  size: TabsSize = 'medium';
  animated = true;
  ariaLabel?: string;
  ariaOrientation: 'horizontal' | 'vertical' = 'horizontal';
  activeIndex = 0;

  tab1Icon?: string;
  tab1Disabled = false;
  tab1AriaLabel?: string;

  tab2Disabled = false;
  tab3Disabled = false;

  activeIndexChanges: number[] = [];
  tabChangeEvents: TabChangeEvent[] = [];

  onActiveIndexChange(index: number): void {
    this.activeIndexChanges.push(index);
  }

  onTabChange(event: TabChangeEvent): void {
    this.tabChangeEvents.push(event);
  }
}

@Component({
  selector: 'psh-data-driven-host',
  imports: [PshTabsComponent],
  template: `
    <psh-tabs
      [tabs]="tabs"
      [variant]="variant"
      [size]="size"
      [(activeIndex)]="activeIndex"
      (activeIndexChange)="onActiveIndexChange($event)"
      (tabChange)="onTabChange($event)"
    >
    </psh-tabs>
  `
})
class DataDrivenHostComponent {
  tabs: Tab[] = [
    { header: 'First', content: 'First content', icon: 'house' },
    { header: 'Second', content: 'Second content' },
    { header: 'Third', content: 'Third content', disabled: true }
  ];
  variant: TabsVariant = 'default';
  size: TabsSize = 'medium';
  activeIndex = 0;

  activeIndexChanges: number[] = [];
  tabChangeEvents: TabChangeEvent[] = [];

  onActiveIndexChange(index: number): void {
    this.activeIndexChanges.push(index);
  }

  onTabChange(event: TabChangeEvent): void {
    this.tabChangeEvents.push(event);
  }
}

describe('PshTabsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  const getTabsHost = () =>
    fixture.nativeElement.querySelector('psh-tabs') as HTMLElement;

  const getTabsContainer = () =>
    fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;

  const getTabButtons = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLElement[];

  const getTabButton = (index: number) =>
    getTabButtons()[index] as HTMLElement;

  const getTabPanels = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tabpanel"]')) as HTMLElement[];

  const getTabPanel = (index: number) =>
    getTabPanels()[index] as HTMLElement;

  const createKeyboardEvent = (key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    jest.spyOn(event, 'preventDefault');
    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render all tab headers from content projection', () => {
      const buttons = getTabButtons();
      expect(buttons.length).toBe(3);
      expect(buttons[0]!.textContent).toContain('Tab 1');
      expect(buttons[1]!.textContent).toContain('Tab 2');
      expect(buttons[2]!.textContent).toContain('Tab 3');
    });

    it('should render icon element when icon is provided', () => {
      hostComponent.tab1Icon = 'star';
      fixture.detectChanges();

      const button = getTabButton(0);
      const iconElement = button.querySelector('[aria-hidden="true"]');
      expect(iconElement).toBeTruthy();
    });

    it('should not render icon element when icon is not provided', () => {
      const button = getTabButton(1);
      const iconElement = button.querySelector('[aria-hidden="true"]');
      expect(iconElement).toBeFalsy();
    });

    it('should render tab panels', () => {
      const panels = getTabPanels();
      expect(panels.length).toBe(3);
    });

    it('should display only active tab panel content', () => {
      const panels = getTabPanels();
      expect(panels[0]!.classList.contains('active')).toBe(true);
      expect(panels[1]!.classList.contains('active')).toBe(false);
      expect(panels[2]!.classList.contains('active')).toBe(false);
    });
  });

  describe('Variants', () => {
    it.each<[TabsVariant]>([
      ['default'],
      ['underline'],
      ['pills']
    ])('variant "%s" should apply correct host class', (variant) => {
      hostComponent.variant = variant;
      fixture.detectChanges();

      const host = getTabsHost();
      expect(host.classList.contains(`tabs-${variant}`)).toBe(true);
    });
  });

  describe('Sizes', () => {
    it.each<[TabsSize, boolean]>([
      ['small', true],
      ['medium', false],
      ['large', true]
    ])('size "%s" should apply correct class (hasClass: %s)', (size, hasClass) => {
      hostComponent.size = size;
      fixture.detectChanges();

      const host = getTabsHost();
      if (size === 'medium') {
        expect(host.classList.contains('tabs-small')).toBe(false);
        expect(host.classList.contains('tabs-large')).toBe(false);
      } else {
        expect(host.classList.contains(`tabs-${size}`)).toBe(hasClass);
      }
    });
  });

  describe('Tab selection behavior', () => {
    it('should select tab on click', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      expect(getTabButton(1).getAttribute('aria-selected')).toBe('true');
      expect(getTabButton(0).getAttribute('aria-selected')).toBe('false');
    });

    it('should not select disabled tab on click', () => {
      hostComponent.tab2Disabled = true;
      fixture.detectChanges();

      getTabButton(1).click();
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
      expect(getTabButton(1).getAttribute('aria-selected')).toBe('false');
    });

    it('should emit activeIndexChange with correct index on selection', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      expect(hostComponent.activeIndexChanges).toContain(1);
    });

    it('should emit tabChange event with correct data on selection', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      expect(hostComponent.tabChangeEvents.length).toBe(1);
      const event = hostComponent.tabChangeEvents[0]!;
      expect(event.previousIndex).toBe(0);
      expect(event.currentIndex).toBe(1);
      expect(event.tab.header).toBe('Tab 2');
    });

    it('should not emit events when clicking already active tab', () => {
      const initialCount = hostComponent.activeIndexChanges.length;

      getTabButton(0).click();
      fixture.detectChanges();

      expect(hostComponent.activeIndexChanges.length).toBe(initialCount);
      expect(hostComponent.tabChangeEvents.length).toBe(0);
    });

    it('should update active panel visibility when tab is selected', () => {
      getTabButton(2).click();
      fixture.detectChanges();

      const panels = getTabPanels();
      expect(panels[0]!.classList.contains('active')).toBe(false);
      expect(panels[1]!.classList.contains('active')).toBe(false);
      expect(panels[2]!.classList.contains('active')).toBe(true);
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate to next tab on ArrowRight', () => {
      const event = createKeyboardEvent('ArrowRight');
      getTabButton(0).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(1).getAttribute('aria-selected')).toBe('true');
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to previous tab on ArrowLeft', () => {
      hostComponent.activeIndex = 2;
      fixture.detectChanges();

      const event = createKeyboardEvent('ArrowLeft');
      getTabButton(2).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(1).getAttribute('aria-selected')).toBe('true');
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to first tab on Home key', () => {
      hostComponent.activeIndex = 2;
      fixture.detectChanges();

      const event = createKeyboardEvent('Home');
      getTabButton(2).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to last tab on End key', () => {
      const event = createKeyboardEvent('End');
      getTabButton(0).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(2).getAttribute('aria-selected')).toBe('true');
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should skip disabled tabs during forward navigation', () => {
      hostComponent.tab2Disabled = true;
      fixture.detectChanges();

      const event = createKeyboardEvent('ArrowRight');
      getTabButton(0).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(2).getAttribute('aria-selected')).toBe('true');
    });

    it('should skip disabled tabs during backward navigation', () => {
      hostComponent.tab2Disabled = true;
      hostComponent.activeIndex = 2;
      fixture.detectChanges();

      const event = createKeyboardEvent('ArrowLeft');
      getTabButton(2).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
    });

    it('should wrap around when navigating past last tab', () => {
      hostComponent.activeIndex = 2;
      fixture.detectChanges();

      const event = createKeyboardEvent('ArrowRight');
      getTabButton(2).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
    });

    it('should wrap around when navigating before first tab', () => {
      const event = createKeyboardEvent('ArrowLeft');
      getTabButton(0).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(2).getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('Accessibility', () => {
    it('should have role="region" on host element', () => {
      expect(getTabsHost().getAttribute('role')).toBe('region');
    });

    it('should have default aria-label on host when not provided', () => {
      expect(getTabsHost().getAttribute('aria-label')).toBe('Navigation par onglets');
    });

    it('should use custom aria-label when provided', () => {
      hostComponent.ariaLabel = 'Product tabs';
      fixture.detectChanges();

      expect(getTabsHost().getAttribute('aria-label')).toBe('Product tabs');
    });

    it('should have role="tablist" on header container', () => {
      expect(getTabsContainer().getAttribute('role')).toBe('tablist');
    });

    it('should have correct aria-orientation attribute', () => {
      expect(getTabsContainer().getAttribute('aria-orientation')).toBe('horizontal');

      hostComponent.ariaOrientation = 'vertical';
      fixture.detectChanges();

      expect(getTabsContainer().getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should have role="tab" on each tab button', () => {
      getTabButtons().forEach(button => {
        expect(button.getAttribute('role')).toBe('tab');
      });
    });

    it('should have aria-selected="true" on active tab', () => {
      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
    });

    it('should have aria-selected="false" on inactive tabs', () => {
      expect(getTabButton(1).getAttribute('aria-selected')).toBe('false');
      expect(getTabButton(2).getAttribute('aria-selected')).toBe('false');
    });

    it('should have aria-controls linking to panel ID', () => {
      const button = getTabButton(0);
      const panelId = button.getAttribute('aria-controls');
      expect(panelId).toBe('panel-0');
      expect(getTabPanel(0).getAttribute('id')).toBe('panel-0');
    });

    it('should have aria-disabled on disabled tabs', () => {
      hostComponent.tab2Disabled = true;
      fixture.detectChanges();

      expect(getTabButton(1).getAttribute('aria-disabled')).toBe('true');
    });

    it('should not have aria-disabled on enabled tabs', () => {
      expect(getTabButton(0).getAttribute('aria-disabled')).toBeNull();
    });

    it('should have correct tabindex on tab buttons', () => {
      expect(getTabButton(0).getAttribute('tabindex')).toBe('0');
      expect(getTabButton(1).getAttribute('tabindex')).toBe('-1');
      expect(getTabButton(2).getAttribute('tabindex')).toBe('-1');
    });

    it('should have role="tabpanel" on content panels', () => {
      getTabPanels().forEach(panel => {
        expect(panel.getAttribute('role')).toBe('tabpanel');
      });
    });

    it('should have aria-labelledby on panels linking to tab ID', () => {
      const panel = getTabPanel(0);
      expect(panel.getAttribute('aria-labelledby')).toBe('tab-0');
      expect(getTabButton(0).getAttribute('id')).toBe('tab-0');
    });

    it('should have active class only on active panel', () => {
      expect(getTabPanel(0).classList.contains('active')).toBe(true);
      expect(getTabPanel(1).classList.contains('active')).toBe(false);
      expect(getTabPanel(2).classList.contains('active')).toBe(false);
    });

    it('should have correct tabindex on panels', () => {
      expect(getTabPanel(0).getAttribute('tabindex')).toBe('0');
      expect(getTabPanel(1).getAttribute('tabindex')).toBe('-1');
      expect(getTabPanel(2).getAttribute('tabindex')).toBe('-1');
    });

    it('should use custom aria-label for tab when provided', () => {
      hostComponent.tab1AriaLabel = 'First tab navigation';
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-label')).toBe('First tab navigation');
    });

    it('should use header as aria-label when custom label not provided', () => {
      expect(getTabButton(0).getAttribute('aria-label')).toBe('Tab 1');
    });
  });

  describe('Disabled tabs', () => {
    it('should render disabled tab with disabled attribute', () => {
      hostComponent.tab2Disabled = true;
      fixture.detectChanges();

      expect(getTabButton(1).hasAttribute('disabled')).toBe(true);
    });

    it('should not navigate to disabled tab via keyboard', () => {
      hostComponent.tab2Disabled = true;
      hostComponent.tab3Disabled = true;
      fixture.detectChanges();

      const event = createKeyboardEvent('ArrowRight');
      getTabButton(0).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('Two-way binding', () => {
    it('should reflect activeIndex changes from parent', () => {
      hostComponent.activeIndex = 2;
      fixture.detectChanges();

      expect(getTabButton(2).getAttribute('aria-selected')).toBe('true');
      expect(getTabPanel(2).hasAttribute('hidden')).toBe(false);
    });

    it('should update parent activeIndex when tab is selected', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      expect(hostComponent.activeIndex).toBe(1);
    });
  });

  describe('Animation', () => {
    it('should apply tabs-animated class when animated is true', () => {
      hostComponent.animated = true;
      fixture.detectChanges();

      expect(getTabsHost().classList.contains('tabs-animated')).toBe(true);
    });

    it('should not apply tabs-animated class when animated is false', () => {
      hostComponent.animated = false;
      fixture.detectChanges();

      expect(getTabsHost().classList.contains('tabs-animated')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle programmatic activeIndex update', () => {
      hostComponent.activeIndex = 1;
      fixture.detectChanges();

      expect(getTabButton(1).getAttribute('aria-selected')).toBe('true');
      expect(getTabButton(0).getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('Integration test: complete user journey', () => {
    it('should complete a full tab navigation workflow', () => {
      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
      expect(getTabPanel(0).hasAttribute('hidden')).toBe(false);

      getTabButton(1).click();
      fixture.detectChanges();

      expect(getTabButton(1).getAttribute('aria-selected')).toBe('true');
      expect(getTabPanel(1).hasAttribute('hidden')).toBe(false);
      expect(hostComponent.activeIndexChanges).toContain(1);

      const event = createKeyboardEvent('ArrowRight');
      getTabButton(1).dispatchEvent(event);
      fixture.detectChanges();

      expect(getTabButton(2).getAttribute('aria-selected')).toBe('true');
      expect(getTabPanel(2).hasAttribute('hidden')).toBe(false);

      const homeEvent = createKeyboardEvent('Home');
      getTabButton(2).dispatchEvent(homeEvent);
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
      expect(getTabPanel(0).hasAttribute('hidden')).toBe(false);
    });
  });
});

describe('PshTabsComponent with data-driven tabs', () => {
  let fixture: ComponentFixture<DataDrivenHostComponent>;
  let hostComponent: DataDrivenHostComponent;

  const getTabButtons = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLElement[];

  const getTabButton = (index: number) =>
    getTabButtons()[index] as HTMLElement;

  const getTabPanels = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tabpanel"]')) as HTMLElement[];

  const getTabPanel = (index: number) =>
    getTabPanels()[index] as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataDrivenHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataDrivenHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render all tab headers from tabs input', () => {
      const buttons = getTabButtons();
      expect(buttons.length).toBe(3);
      expect(buttons[0]!.textContent).toContain('First');
      expect(buttons[1]!.textContent).toContain('Second');
      expect(buttons[2]!.textContent).toContain('Third');
    });

    it('should render tab content for active panel', () => {
      const panel = getTabPanel(0);
      expect(panel.textContent).toContain('First content');
    });

    it('should render icon element when icon is provided in data', () => {
      const button = getTabButton(0);
      const iconElement = button.querySelector('[aria-hidden="true"]');
      expect(iconElement).toBeTruthy();
    });

    it('should render disabled tab from data', () => {
      expect(getTabButton(2).hasAttribute('disabled')).toBe(true);
      expect(getTabButton(2).getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Tab selection', () => {
    it('should select tab and show correct content', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      expect(getTabButton(1).getAttribute('aria-selected')).toBe('true');
      expect(getTabPanel(1).textContent).toContain('Second content');
      expect(getTabPanel(1).hasAttribute('hidden')).toBe(false);
    });

    it('should not select disabled tab from data', () => {
      getTabButton(2).click();
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
      expect(getTabButton(2).getAttribute('aria-selected')).toBe('false');
    });

    it('should emit tabChange with correct tab data', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      const event = hostComponent.tabChangeEvents[0]!;
      expect(event.tab.header).toBe('Second');
      expect(event.tab.content).toBe('Second content');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty tabs array', () => {
      hostComponent.tabs = [];
      fixture.detectChanges();

      expect(getTabButtons().length).toBe(0);
      expect(getTabPanels().length).toBe(0);
    });

    it('should adjust activeIndex when it exceeds tab count', () => {
      hostComponent.activeIndex = 10;
      fixture.detectChanges();

      const buttons = getTabButtons();
      const activeButton = buttons.find(b => b.getAttribute('aria-selected') === 'true');
      expect(activeButton).toBeTruthy();
    });

    it('should handle single tab', () => {
      hostComponent.tabs = [{ header: 'Only', content: 'Only content' }];
      fixture.detectChanges();

      expect(getTabButtons().length).toBe(1);
      expect(getTabButton(0).getAttribute('aria-selected')).toBe('true');
    });

    it('should handle dynamic tab updates', () => {
      hostComponent.tabs = [
        { header: 'New Tab 1', content: 'New content 1' },
        { header: 'New Tab 2', content: 'New content 2' }
      ];
      fixture.detectChanges();

      expect(getTabButtons().length).toBe(2);
      expect(getTabButton(0).textContent).toContain('New Tab 1');
    });
  });
});

@Component({
  selector: 'psh-config-test-host',
  imports: [PshTabsComponent, PshTabComponent],
  template: `
    <psh-tabs>
      <psh-tab [header]="'Tab A'">Content A</psh-tab>
      <psh-tab [header]="'Tab B'">Content B</psh-tab>
    </psh-tabs>
  `
})
class ConfigTestHostComponent {}

describe('PshTabsComponent with custom config', () => {
  let fixture: ComponentFixture<ConfigTestHostComponent>;

  const getTabsHost = () =>
    fixture.nativeElement.querySelector('psh-tabs') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigTestHostComponent],
      providers: [
        {
          provide: TABS_CONFIG,
          useValue: {
            variant: 'pills',
            size: 'large',
            activeIndex: 1,
            animated: false
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigTestHostComponent);
    fixture.detectChanges();
  });

  it('should use variant from injected config', () => {
    expect(getTabsHost().classList.contains('tabs-pills')).toBe(true);
  });

  it('should use size from injected config', () => {
    expect(getTabsHost().classList.contains('tabs-large')).toBe(true);
  });

  it('should use animated setting from injected config', () => {
    expect(getTabsHost().classList.contains('tabs-animated')).toBe(false);
  });

  it('should use activeIndex from injected config', () => {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLElement[];
    expect(buttons[1]!.getAttribute('aria-selected')).toBe('true');
  });
});

@Component({
  selector: 'psh-override-test-host',
  imports: [PshTabsComponent, PshTabComponent],
  template: `
    <psh-tabs [variant]="'underline'" [size]="'small'" [animated]="true">
      <psh-tab [header]="'Tab A'">Content A</psh-tab>
      <psh-tab [header]="'Tab B'">Content B</psh-tab>
    </psh-tabs>
  `
})
class OverrideTestHostComponent {}

describe('PshTabsComponent input overrides config', () => {
  let fixture: ComponentFixture<OverrideTestHostComponent>;

  const getTabsHost = () =>
    fixture.nativeElement.querySelector('psh-tabs') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverrideTestHostComponent],
      providers: [
        {
          provide: TABS_CONFIG,
          useValue: {
            variant: 'pills',
            size: 'large',
            animated: false
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OverrideTestHostComponent);
    fixture.detectChanges();
  });

  it('should allow input values to override config', () => {
    expect(getTabsHost().classList.contains('tabs-underline')).toBe(true);
    expect(getTabsHost().classList.contains('tabs-small')).toBe(true);
    expect(getTabsHost().classList.contains('tabs-animated')).toBe(true);
  });
});

@Component({
  selector: 'psh-empty-test-host',
  imports: [PshTabsComponent],
  template: `<psh-tabs></psh-tabs>`
})
class EmptyTabsHostComponent {}

describe('PshTabsComponent with no tabs', () => {
  let fixture: ComponentFixture<EmptyTabsHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyTabsHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyTabsHostComponent);
    fixture.detectChanges();
  });

  it('should handle empty tabs without errors', () => {
    const buttons = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons.length).toBe(0);
  });

  it('should render tablist container even with no tabs', () => {
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(tablist).toBeTruthy();
  });
});
