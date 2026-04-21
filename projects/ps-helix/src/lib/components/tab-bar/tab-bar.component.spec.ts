import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshTabBarComponent, TAB_BAR_CONFIG } from './tab-bar.component';
import { TabBarItem, TabBarChangeEvent } from './tab-bar.types';

describe('PshTabBarComponent', () => {
  let fixture: ComponentFixture<PshTabBarComponent>;

  const mockItems: TabBarItem[] = [
    { id: 'home', label: 'Home', icon: 'house' },
    { id: 'search', label: 'Search', icon: 'magnifying-glass' },
    { id: 'profile', label: 'Profile', icon: 'user' }
  ];

  const getTabBar = () =>
    fixture.nativeElement.querySelector('.tab-bar') as HTMLElement;

  const getTabButtons = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.tab-item')) as HTMLButtonElement[];

  const getTabButton = (index: number) =>
    getTabButtons()[index] as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshTabBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshTabBarComponent);
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render a tab bar nav element', () => {
      expect(getTabBar()).toBeTruthy();
    });

    it('should render all provided items', () => {
      expect(getTabButtons().length).toBe(3);
    });

    it('should display item labels', () => {
      const buttons = getTabButtons();
      expect(buttons[0]!.textContent).toContain('Home');
      expect(buttons[1]!.textContent).toContain('Search');
      expect(buttons[2]!.textContent).toContain('Profile');
    });

    it('should render icons with correct class', () => {
      const firstButton = getTabButton(0);
      const icon = firstButton.querySelector('i');
      expect(icon).toBeTruthy();
      expect(icon!.classList.contains('ph-house')).toBe(true);
    });

    it('should render filled icon for active tab', () => {
      const activeButton = getTabButton(0);
      const icon = activeButton.querySelector('i');
      expect(icon!.classList.contains('ph-fill')).toBe(true);
    });

    it('should render outline icon for inactive tabs', () => {
      const inactiveButton = getTabButton(1);
      const icon = inactiveButton.querySelector('i');
      expect(icon!.classList.contains('ph')).toBe(true);
      expect(icon!.classList.contains('ph-fill')).toBe(false);
    });

    it('should display badge when item has badge', () => {
      const itemsWithBadge: TabBarItem[] = [
        { id: 'notifications', label: 'Notifications', icon: 'bell', badge: '5' },
        { id: 'home', label: 'Home', icon: 'house' }
      ];
      fixture.componentRef.setInput('items', itemsWithBadge);
      fixture.detectChanges();

      const badge = getTabButton(0).querySelector('.tab-badge');
      expect(badge).toBeTruthy();
      expect(badge!.textContent).toBe('5');
    });

    it('should not display badge when item has no badge', () => {
      const badge = getTabButton(0).querySelector('.tab-badge');
      expect(badge).toBeFalsy();
    });

    it('should display numeric badge correctly', () => {
      const itemsWithNumericBadge: TabBarItem[] = [
        { id: 'messages', label: 'Messages', icon: 'chat', badge: 42 }
      ];
      fixture.componentRef.setInput('items', itemsWithNumericBadge);
      fixture.detectChanges();

      const badge = getTabButton(0).querySelector('.tab-badge');
      expect(badge!.textContent).toBe('42');
    });
  });

  describe('Selection behavior', () => {
    it('should have first item selected by default', () => {
      expect(fixture.componentInstance.activeIndex()).toBe(0);
    });

    it('should emit tabChange event when selecting a different tab', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabButton(1).click();

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit correct event data on tab change', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabButton(2).click();

      const expectedEvent: TabBarChangeEvent = {
        index: 2,
        item: mockItems[2]!,
        previousIndex: 0
      };
      expect(changeSpy).toHaveBeenCalledWith(expectedEvent);
    });

    it('should update activeIndex when tab is clicked', () => {
      getTabButton(1).click();
      expect(fixture.componentInstance.activeIndex()).toBe(1);
    });

    it('should NOT emit event when clicking already selected tab', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabButton(0).click();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should NOT change activeIndex when clicking already selected tab', () => {
      getTabButton(0).click();
      expect(fixture.componentInstance.activeIndex()).toBe(0);
    });

    it('should track previousIndex correctly across multiple selections', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabButton(1).click();
      getTabButton(2).click();

      expect(changeSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ index: 2, previousIndex: 1 })
      );
    });
  });

  describe('Active state visual feedback', () => {
    it('should apply active class to selected item', () => {
      expect(getTabButton(0).classList.contains('active')).toBe(true);
    });

    it('should not apply active class to non-selected items', () => {
      expect(getTabButton(1).classList.contains('active')).toBe(false);
      expect(getTabButton(2).classList.contains('active')).toBe(false);
    });

    it('should move active class when selection changes', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      expect(getTabButton(0).classList.contains('active')).toBe(false);
      expect(getTabButton(1).classList.contains('active')).toBe(true);
    });

    it('should update icon to filled style when tab becomes active', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      const newActiveIcon = getTabButton(1).querySelector('i');
      expect(newActiveIcon!.classList.contains('ph-fill')).toBe(true);
    });

    it('should update icon to outline style when tab becomes inactive', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      const previousActiveIcon = getTabButton(0).querySelector('i');
      expect(previousActiveIcon!.classList.contains('ph-fill')).toBe(false);
      expect(previousActiveIcon!.classList.contains('ph')).toBe(true);
    });
  });

  describe('Disabled state - component level', () => {
    it('should NOT emit event when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabButton(1).click();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should NOT change activeIndex when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getTabButton(1).click();

      expect(fixture.componentInstance.activeIndex()).toBe(0);
    });

    it('should apply disabled class to all items when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getTabButtons().forEach(button => {
        expect(button.classList.contains('disabled')).toBe(true);
      });
    });

    it('should set aria-disabled on all items when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getTabButtons().forEach(button => {
        expect(button.getAttribute('aria-disabled')).toBe('true');
      });
    });
  });

  describe('Disabled state - item level', () => {
    const itemsWithDisabled: TabBarItem[] = [
      { id: 'home', label: 'Home', icon: 'house' },
      { id: 'search', label: 'Search', icon: 'magnifying-glass', disabled: true },
      { id: 'profile', label: 'Profile', icon: 'user' }
    ];

    beforeEach(() => {
      fixture.componentRef.setInput('items', itemsWithDisabled);
      fixture.detectChanges();
    });

    it('should NOT emit event when clicking disabled item', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabButton(1).click();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should NOT change activeIndex when clicking disabled item', () => {
      getTabButton(1).click();
      expect(fixture.componentInstance.activeIndex()).toBe(0);
    });

    it('should apply disabled class only to disabled item', () => {
      expect(getTabButton(0).classList.contains('disabled')).toBe(false);
      expect(getTabButton(1).classList.contains('disabled')).toBe(true);
      expect(getTabButton(2).classList.contains('disabled')).toBe(false);
    });

    it('should set aria-disabled only on disabled item', () => {
      expect(getTabButton(0).getAttribute('aria-disabled')).not.toBe('true');
      expect(getTabButton(1).getAttribute('aria-disabled')).toBe('true');
      expect(getTabButton(2).getAttribute('aria-disabled')).not.toBe('true');
    });

    it('should still allow selecting non-disabled items', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabButton(2).click();

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.activeIndex()).toBe(2);
    });
  });

  describe('Accessibility', () => {
    it('should have role="tablist" on host', () => {
      expect(fixture.nativeElement.getAttribute('role')).toBe('tablist');
    });

    it('should have aria-label on host', () => {
      expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Navigation par onglets');
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

    it('should update aria-selected when selection changes', () => {
      getTabButton(1).click();
      fixture.detectChanges();

      expect(getTabButton(0).getAttribute('aria-selected')).toBe('false');
      expect(getTabButton(1).getAttribute('aria-selected')).toBe('true');
    });

    it('should have aria-label on each tab button', () => {
      expect(getTabButton(0).getAttribute('aria-label')).toBe('Home');
      expect(getTabButton(1).getAttribute('aria-label')).toBe('Search');
      expect(getTabButton(2).getAttribute('aria-label')).toBe('Profile');
    });

    it('should have aria-hidden on icons', () => {
      const icons = fixture.nativeElement.querySelectorAll('i');
      icons.forEach((icon: HTMLElement) => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('Position variants', () => {
    it('should have bottom position by default', () => {
      expect(fixture.componentInstance.position()).toBe('bottom');
    });

    it('should NOT have top class by default', () => {
      expect(fixture.nativeElement.classList.contains('top')).toBe(false);
    });

    it('should apply top class when position is top', () => {
      fixture.componentRef.setInput('position', 'top');
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('top')).toBe(true);
    });

    it('should remove top class when position changes back to bottom', () => {
      fixture.componentRef.setInput('position', 'top');
      fixture.detectChanges();
      expect(fixture.nativeElement.classList.contains('top')).toBe(true);

      fixture.componentRef.setInput('position', 'bottom');
      fixture.detectChanges();
      expect(fixture.nativeElement.classList.contains('top')).toBe(false);
    });
  });

  describe('Animation configuration', () => {
    it('should have animations enabled by default', () => {
      expect(fixture.componentInstance.animated()).toBe(true);
    });

    it('should have animated class by default', () => {
      expect(fixture.nativeElement.classList.contains('animated')).toBe(true);
    });

    it('should remove animated class when animations are disabled', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('animated')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty items array', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      expect(getTabButtons().length).toBe(0);
    });

    it('should handle single item', () => {
      fixture.componentRef.setInput('items', [mockItems[0]]);
      fixture.detectChanges();

      expect(getTabButtons().length).toBe(1);
      expect(getTabButton(0).classList.contains('active')).toBe(true);
    });

    it('should handle programmatic activeIndex change', () => {
      fixture.componentInstance.activeIndex.set(2);
      fixture.detectChanges();

      expect(getTabButton(2).classList.contains('active')).toBe(true);
      expect(getTabButton(0).classList.contains('active')).toBe(false);
    });
  });
});

describe('PshTabBarComponent with custom config', () => {
  let fixture: ComponentFixture<PshTabBarComponent>;

  const mockItems: TabBarItem[] = [
    { id: 'home', label: 'Home', icon: 'house' },
    { id: 'search', label: 'Search', icon: 'magnifying-glass' }
  ];

  const getTabButtons = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.tab-item')) as HTMLButtonElement[];

  const getTabButton = (index: number) =>
    getTabButtons()[index] as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshTabBarComponent],
      providers: [
        {
          provide: TAB_BAR_CONFIG,
          useValue: {
            disabled: true,
            position: 'top',
            animated: false
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PshTabBarComponent);
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should use disabled from injected config', () => {
    expect(fixture.componentInstance.disabled()).toBe(true);
  });

  it('should use position from injected config', () => {
    expect(fixture.componentInstance.position()).toBe('top');
    expect(fixture.nativeElement.classList.contains('top')).toBe(true);
  });

  it('should use animated from injected config', () => {
    expect(fixture.componentInstance.animated()).toBe(false);
    expect(fixture.nativeElement.classList.contains('animated')).toBe(false);
  });

  it('should allow overriding config values via inputs', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('position', 'bottom');
    fixture.componentRef.setInput('animated', true);
    fixture.detectChanges();

    expect(fixture.componentInstance.disabled()).toBe(false);
    expect(fixture.componentInstance.position()).toBe('bottom');
    expect(fixture.componentInstance.animated()).toBe(true);
  });
});
