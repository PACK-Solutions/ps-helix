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

  const getTabList = () =>
    fixture.nativeElement as HTMLElement;

  const getAllTabs = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];

  const getTabByName = (name: string) =>
    getAllTabs().find(tab => tab.getAttribute('aria-label') === name) as HTMLButtonElement;

  const getSelectedTab = () =>
    fixture.nativeElement.querySelector('[aria-selected="true"]') as HTMLButtonElement;

  const getDisabledTabs = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[aria-disabled="true"]')) as HTMLButtonElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshTabBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshTabBarComponent);
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render a tablist', () => {
      expect(getTabList().getAttribute('role')).toBe('tablist');
    });

    it('should render all provided items as tabs', () => {
      expect(getAllTabs().length).toBe(3);
    });

    it('should display item labels', () => {
      expect(getTabByName('Home')).toBeTruthy();
      expect(getTabByName('Search')).toBeTruthy();
      expect(getTabByName('Profile')).toBeTruthy();
    });

    it('should render icons with aria-hidden', () => {
      const icons = fixture.nativeElement.querySelectorAll('i[aria-hidden="true"]');
      expect(icons.length).toBe(3);
    });

    it('should display badge when item has badge', () => {
      const itemsWithBadge: TabBarItem[] = [
        { id: 'notifications', label: 'Notifications', icon: 'bell', badge: '5' },
        { id: 'home', label: 'Home', icon: 'house' }
      ];
      fixture.componentRef.setInput('items', itemsWithBadge);
      fixture.detectChanges();

      const badge = getTabByName('Notifications').querySelector('.tab-badge');
      expect(badge).toBeTruthy();
      expect(badge!.textContent).toBe('5');
    });

    it('should not display badge when item has no badge', () => {
      const badge = getTabByName('Home').querySelector('.tab-badge');
      expect(badge).toBeFalsy();
    });

    it('should display numeric badge correctly', () => {
      const itemsWithNumericBadge: TabBarItem[] = [
        { id: 'messages', label: 'Messages', icon: 'chat', badge: 42 }
      ];
      fixture.componentRef.setInput('items', itemsWithNumericBadge);
      fixture.detectChanges();

      const badge = getTabByName('Messages').querySelector('.tab-badge');
      expect(badge!.textContent).toBe('42');
    });
  });

  describe('Selection behavior', () => {
    it('should have first item selected by default', () => {
      expect(getSelectedTab().getAttribute('aria-label')).toBe('Home');
    });

    it('should emit tabChange event when selecting a different tab', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabByName('Search').click();

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit correct event data on tab change', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabByName('Profile').click();

      const expectedEvent: TabBarChangeEvent = {
        index: 2,
        item: mockItems[2]!,
        previousIndex: 0
      };
      expect(changeSpy).toHaveBeenCalledWith(expectedEvent);
    });

    it('should update selected tab when clicked', () => {
      getTabByName('Search').click();
      fixture.detectChanges();

      expect(getSelectedTab().getAttribute('aria-label')).toBe('Search');
    });

    it('should NOT emit event when clicking already selected tab', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabByName('Home').click();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should track previousIndex correctly across multiple selections', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabByName('Search').click();
      getTabByName('Profile').click();

      expect(changeSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ index: 2, previousIndex: 1 })
      );
    });
  });

  describe('Active state visual feedback', () => {
    it('should apply active class to selected tab', () => {
      expect(getSelectedTab().classList.contains('active')).toBe(true);
    });

    it('should not apply active class to non-selected tabs', () => {
      const nonSelectedTabs = getAllTabs().filter(
        tab => tab.getAttribute('aria-selected') === 'false'
      );
      nonSelectedTabs.forEach(tab => {
        expect(tab.classList.contains('active')).toBe(false);
      });
    });

    it('should move active class when selection changes', () => {
      getTabByName('Search').click();
      fixture.detectChanges();

      expect(getTabByName('Home').classList.contains('active')).toBe(false);
      expect(getTabByName('Search').classList.contains('active')).toBe(true);
    });
  });

  describe('Disabled state - component level', () => {
    it('should NOT emit event when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabByName('Search').click();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should NOT change selection when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getTabByName('Search').click();
      fixture.detectChanges();

      expect(getSelectedTab().getAttribute('aria-label')).toBe('Home');
    });

    it('should set aria-disabled on all tabs when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getDisabledTabs().length).toBe(3);
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

      getTabByName('Search').click();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should NOT change selection when clicking disabled item', () => {
      getTabByName('Search').click();
      fixture.detectChanges();

      expect(getSelectedTab().getAttribute('aria-label')).toBe('Home');
    });

    it('should set aria-disabled only on disabled item', () => {
      const disabledTabs = getDisabledTabs();
      expect(disabledTabs.length).toBe(1);
      expect(disabledTabs[0]!.getAttribute('aria-label')).toBe('Search');
    });

    it('should still allow selecting non-disabled items', () => {
      const changeSpy = jest.fn();
      fixture.componentInstance.tabChange.subscribe(changeSpy);

      getTabByName('Profile').click();
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(getSelectedTab().getAttribute('aria-label')).toBe('Profile');
    });
  });

  describe('Accessibility', () => {
    it('should have role="tablist" on host', () => {
      expect(getTabList().getAttribute('role')).toBe('tablist');
    });

    it('should have aria-label on host', () => {
      expect(getTabList().getAttribute('aria-label')).toBe('Navigation par onglets');
    });

    it('should have role="tab" on each tab button', () => {
      getAllTabs().forEach(tab => {
        expect(tab.getAttribute('role')).toBe('tab');
      });
    });

    it('should have aria-selected="true" on selected tab', () => {
      expect(getSelectedTab()).toBeTruthy();
      expect(getSelectedTab().getAttribute('aria-selected')).toBe('true');
    });

    it('should have aria-selected="false" on non-selected tabs', () => {
      const nonSelectedTabs = getAllTabs().filter(
        tab => tab.getAttribute('aria-selected') === 'false'
      );
      expect(nonSelectedTabs.length).toBe(2);
    });

    it('should update aria-selected when selection changes', () => {
      getTabByName('Search').click();
      fixture.detectChanges();

      expect(getTabByName('Home').getAttribute('aria-selected')).toBe('false');
      expect(getTabByName('Search').getAttribute('aria-selected')).toBe('true');
    });

    it('should have aria-label on each tab button', () => {
      expect(getTabByName('Home').getAttribute('aria-label')).toBe('Home');
      expect(getTabByName('Search').getAttribute('aria-label')).toBe('Search');
      expect(getTabByName('Profile').getAttribute('aria-label')).toBe('Profile');
    });

    it('should have aria-hidden on icons', () => {
      const icons = fixture.nativeElement.querySelectorAll('i');
      icons.forEach((icon: HTMLElement) => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('Position variants', () => {
    it('should NOT have top class by default', () => {
      expect(getTabList().classList.contains('top')).toBe(false);
    });

    it('should apply top class when position is top', () => {
      fixture.componentRef.setInput('position', 'top');
      fixture.detectChanges();

      expect(getTabList().classList.contains('top')).toBe(true);
    });

    it('should remove top class when position changes back to bottom', () => {
      fixture.componentRef.setInput('position', 'top');
      fixture.detectChanges();
      expect(getTabList().classList.contains('top')).toBe(true);

      fixture.componentRef.setInput('position', 'bottom');
      fixture.detectChanges();
      expect(getTabList().classList.contains('top')).toBe(false);
    });
  });

  describe('Animation configuration', () => {
    it('should have animated class by default', () => {
      expect(getTabList().classList.contains('animated')).toBe(true);
    });

    it('should remove animated class when animations are disabled', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();

      expect(getTabList().classList.contains('animated')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty items array', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      expect(getAllTabs().length).toBe(0);
    });

    it('should handle single item', () => {
      fixture.componentRef.setInput('items', [mockItems[0]]);
      fixture.detectChanges();

      expect(getAllTabs().length).toBe(1);
      expect(getSelectedTab().getAttribute('aria-label')).toBe('Home');
    });
  });
});

describe('PshTabBarComponent with custom config', () => {
  let fixture: ComponentFixture<PshTabBarComponent>;

  const mockItems: TabBarItem[] = [
    { id: 'home', label: 'Home', icon: 'house' },
    { id: 'search', label: 'Search', icon: 'magnifying-glass' }
  ];

  const getTabList = () =>
    fixture.nativeElement as HTMLElement;

  const getAllTabs = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];

  const getDisabledTabs = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[aria-disabled="true"]')) as HTMLButtonElement[];

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
    expect(getDisabledTabs().length).toBe(2);
  });

  it('should use position from injected config', () => {
    expect(getTabList().classList.contains('top')).toBe(true);
  });

  it('should use animated from injected config', () => {
    expect(getTabList().classList.contains('animated')).toBe(false);
  });

  it('should allow overriding config values via inputs', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('position', 'bottom');
    fixture.componentRef.setInput('animated', true);
    fixture.detectChanges();

    expect(getDisabledTabs().length).toBe(0);
    expect(getTabList().classList.contains('top')).toBe(false);
    expect(getTabList().classList.contains('animated')).toBe(true);
  });
});
