import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { PshMenuComponent } from './menu.component';
import { MenuItem, MenuMode, MenuVariant } from './menu.types';

describe('PshMenuComponent', () => {
  let fixture: ComponentFixture<PshMenuComponent<string>>;

  const mockItems: MenuItem<string>[] = [
    { id: 'home', content: 'Home', icon: 'house' },
    { id: 'search', content: 'Search', icon: 'magnifying-glass' },
    { id: 'profile', content: 'Profile', icon: 'user' }
  ];

  const mockItemsWithChildren: MenuItem<string>[] = [
    { id: 'home', content: 'Home', icon: 'house' },
    {
      id: 'settings',
      content: 'Settings',
      icon: 'gear',
      children: [
        { id: 'account', content: 'Account', icon: 'user-circle' },
        { id: 'privacy', content: 'Privacy', icon: 'lock' }
      ]
    },
    { id: 'help', content: 'Help', icon: 'question' }
  ];

  const getNavigation = () =>
    fixture.nativeElement.querySelector('nav[role="navigation"]') as HTMLElement;

  const getMenubar = () =>
    fixture.nativeElement.querySelector('ul[role="menubar"]') as HTMLUListElement;

  const getMenuItems = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="menuitem"]')) as HTMLElement[];

  const getMenuItem = (index: number) =>
    getMenuItems()[index] as HTMLElement;

  const getMenuItemById = (id: string) =>
    fixture.nativeElement.querySelector(`[data-menu-item-id="${id}"]`) as HTMLElement;

  const getCollapseButton = () =>
    fixture.nativeElement.querySelector('.menu-collapse-button') as HTMLButtonElement;

  const getDividers = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="separator"]')) as HTMLElement[];

  const getBadges = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="status"]')) as HTMLElement[];

  const getSubmenus = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="menu"]')) as HTMLUListElement[];

  const getLabels = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.menu-label')) as HTMLElement[];

  const dispatchKeyboardEvent = (element: HTMLElement, key: string) => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshMenuComponent) as ComponentFixture<PshMenuComponent<string>>;
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render a nav element with role="navigation"', () => {
      expect(getNavigation()).toBeTruthy();
    });

    it('should render a menubar with role="menubar"', () => {
      expect(getMenubar()).toBeTruthy();
    });

    it('should render all provided items', () => {
      expect(getMenuItems().length).toBe(3);
    });

    it('should display item content text', () => {
      const items = getMenuItems();
      expect(items[0]!.textContent).toContain('Home');
      expect(items[1]!.textContent).toContain('Search');
      expect(items[2]!.textContent).toContain('Profile');
    });

    it('should render icons with correct classes', () => {
      const firstItem = getMenuItem(0);
      const icon = firstItem.querySelector('i');
      expect(icon).toBeTruthy();
      expect(icon!.classList.contains('ph')).toBe(true);
      expect(icon!.classList.contains('ph-house')).toBe(true);
    });

    it('should render icons with aria-hidden="true"', () => {
      const icons = fixture.nativeElement.querySelectorAll('.menu-link i');
      icons.forEach((icon: HTMLElement) => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('should not render any items when items array is empty', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      expect(getMenuItems().length).toBe(0);
    });

    it('should render link elements for items with path', () => {
      const itemsWithPath: MenuItem[] = [
        { id: 'home', content: 'Home', path: '/home' },
        { id: 'about', content: 'About', path: '/about' }
      ];
      fixture.componentRef.setInput('items', itemsWithPath);
      fixture.detectChanges();

      const links = fixture.nativeElement.querySelectorAll('a[role="menuitem"]');
      expect(links.length).toBe(2);
      expect(links[0].getAttribute('href')).toBe('/home');
      expect(links[1].getAttribute('href')).toBe('/about');
    });

    it('should render button elements for items without path', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button[role="menuitem"]');
      expect(buttons.length).toBe(3);
    });

    it('should render badges with role="status"', () => {
      const itemsWithBadges: MenuItem[] = [
        { id: 'notifications', content: 'Notifications', badge: '5' },
        { id: 'messages', content: 'Messages', badge: 42 }
      ];
      fixture.componentRef.setInput('items', itemsWithBadges);
      fixture.detectChanges();

      const badges = getBadges();
      expect(badges.length).toBe(2);
      expect(badges[0]!.textContent).toBe('5');
      expect(badges[1]!.textContent).toBe('42');
    });

    it('should render dividers with role="separator"', () => {
      const itemsWithDivider: MenuItem[] = [
        { id: 'item1', content: 'Item 1' },
        { id: 'divider', content: '', divider: true },
        { id: 'item2', content: 'Item 2' }
      ];
      fixture.componentRef.setInput('items', itemsWithDivider);
      fixture.detectChanges();

      const dividers = getDividers();
      expect(dividers.length).toBe(1);
    });

    it('should hide labels when collapsed in vertical mode', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const labels = getLabels();
      expect(labels.length).toBe(0);
    });

    it('should show labels when collapsed in horizontal mode', () => {
      fixture.componentRef.setInput('mode', 'horizontal');
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const labels = getLabels();
      expect(labels.length).toBe(3);
    });
  });

  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have aria-label="Navigation menu" on nav', () => {
        expect(getNavigation().getAttribute('aria-label')).toBe('Navigation menu');
      });

      it('should have role="menubar" on the list', () => {
        expect(getMenubar().getAttribute('role')).toBe('menubar');
      });

      it('should have role="menuitem" on clickable items', () => {
        getMenuItems().forEach(item => {
          expect(item.getAttribute('role')).toBe('menuitem');
        });
      });

      it('should have role="none" on li container elements', () => {
        const listItems = fixture.nativeElement.querySelectorAll('.menu-item');
        listItems.forEach((li: HTMLElement) => {
          expect(li.getAttribute('role')).toBe('none');
        });
      });

      it('should have aria-disabled="true" on disabled items', () => {
        const itemsWithDisabled: MenuItem[] = [
          { id: 'active', content: 'Active' },
          { id: 'disabled', content: 'Disabled', disabled: true }
        ];
        fixture.componentRef.setInput('items', itemsWithDisabled);
        fixture.detectChanges();

        expect(getMenuItemById('disabled')!.getAttribute('aria-disabled')).toBe('true');
      });

      it('should have aria-expanded on items with children', () => {
        fixture.componentRef.setInput('items', mockItemsWithChildren);
        fixture.detectChanges();

        const settingsItem = getMenuItemById('settings');
        expect(settingsItem!.getAttribute('aria-expanded')).toBe('false');
      });

      it('should update aria-expanded when submenu opens', () => {
        fixture.componentRef.setInput('items', mockItemsWithChildren);
        fixture.detectChanges();

        const settingsItem = getMenuItemById('settings');
        settingsItem!.click();
        fixture.detectChanges();

        expect(settingsItem!.getAttribute('aria-expanded')).toBe('true');
      });

      it('should have tabindex="0" on enabled items', () => {
        expect(getMenuItem(0).getAttribute('tabindex')).toBe('0');
      });

      it('should have tabindex="-1" on disabled items', () => {
        const itemsWithDisabled: MenuItem[] = [
          { id: 'disabled', content: 'Disabled', disabled: true }
        ];
        fixture.componentRef.setInput('items', itemsWithDisabled);
        fixture.detectChanges();

        expect(getMenuItem(0).getAttribute('tabindex')).toBe('-1');
      });

      it('should have aria-label with disabled suffix for disabled items', () => {
        const itemsWithDisabled: MenuItem[] = [
          { id: 'disabled', content: 'Disabled Item', disabled: true }
        ];
        fixture.componentRef.setInput('items', itemsWithDisabled);
        fixture.detectChanges();

        expect(getMenuItem(0).getAttribute('aria-label')).toBe('Disabled Item (Disabled)');
      });

      it('should have aria-label with submenu suffix for items with children', () => {
        fixture.componentRef.setInput('items', mockItemsWithChildren);
        fixture.detectChanges();

        const settingsItem = getMenuItemById('settings');
        expect(settingsItem!.getAttribute('aria-label')).toBe('Settings (Submenu)');
      });

      it('should use custom aria labels when provided', () => {
        const customLabels = {
          disabled: 'Inactif',
          submenu: 'Sous-menu',
          expand: 'Ouvrir le menu',
          collapse: 'Fermer le menu'
        };
        fixture.componentRef.setInput('ariaLabels', customLabels);
        fixture.componentRef.setInput('items', [
          { id: 'disabled', content: 'Item', disabled: true }
        ]);
        fixture.detectChanges();

        expect(getMenuItem(0).getAttribute('aria-label')).toBe('Item (Inactif)');
      });
    });

    describe('Submenu accessibility', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('items', mockItemsWithChildren);
        fixture.detectChanges();
      });

      it('should have role="menu" on submenu lists', () => {
        const submenus = getSubmenus();
        expect(submenus.length).toBe(1);
        expect(submenus[0]!.getAttribute('role')).toBe('menu');
      });

      it('should have aria-label on submenu with parent content', () => {
        const submenu = getSubmenus()[0];
        expect(submenu!.getAttribute('aria-label')).toBe('Settings submenu');
      });

      it('should have role="menuitem" on child items', () => {
        const settingsItem = getMenuItemById('settings');
        settingsItem!.click();
        fixture.detectChanges();

        const accountItem = getMenuItemById('account');
        expect(accountItem!.getAttribute('role')).toBe('menuitem');
      });
    });
  });

  describe('data-state attribute', () => {
    const dataStateTestCases: Array<{
      name: string;
      inputs: { mode?: MenuMode; collapsible?: boolean; collapsed?: boolean };
      expected: string;
    }> = [
      { name: 'vertical mode (default)', inputs: {}, expected: 'vertical' },
      { name: 'horizontal mode', inputs: { mode: 'horizontal' }, expected: 'horizontal' },
      { name: 'collapsible but not collapsed', inputs: { collapsible: true }, expected: 'collapsible' },
      { name: 'collapsed', inputs: { collapsible: true, collapsed: true }, expected: 'collapsed' }
    ];

    dataStateTestCases.forEach(({ name, inputs, expected }) => {
      it(`should have data-state="${expected}" when ${name}`, () => {
        if (inputs.mode) fixture.componentRef.setInput('mode', inputs.mode);
        if (inputs.collapsible !== undefined) fixture.componentRef.setInput('collapsible', inputs.collapsible);
        if (inputs.collapsed !== undefined) fixture.componentRef.setInput('collapsed', inputs.collapsed);
        fixture.detectChanges();

        expect(getNavigation().getAttribute('data-state')).toBe(expected);
      });
    });
  });

  describe('Mode variants', () => {
    const modeTestCases: Array<{ mode: MenuMode; expectedClass: string }> = [
      { mode: 'vertical', expectedClass: 'vertical' },
      { mode: 'horizontal', expectedClass: 'horizontal' }
    ];

    modeTestCases.forEach(({ mode, expectedClass }) => {
      it(`should apply "${expectedClass}" class when mode is "${mode}"`, () => {
        fixture.componentRef.setInput('mode', mode);
        fixture.detectChanges();

        expect(getNavigation().classList.contains(expectedClass)).toBe(true);
      });
    });

    it('should have vertical mode by default', () => {
      expect(fixture.componentInstance.mode()).toBe('vertical');
      expect(getNavigation().classList.contains('vertical')).toBe(true);
    });
  });

  describe('Style variants', () => {
    const variantTestCases: Array<{ variant: MenuVariant; expectedClass: string | null }> = [
      { variant: 'default', expectedClass: null },
      { variant: 'compact', expectedClass: 'compact' },
      { variant: 'expanded', expectedClass: 'expanded' }
    ];

    variantTestCases.forEach(({ variant, expectedClass }) => {
      it(`should apply correct class for "${variant}" variant`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        if (expectedClass) {
          expect(getNavigation().classList.contains(expectedClass)).toBe(true);
        } else {
          expect(getNavigation().classList.contains('compact')).toBe(false);
          expect(getNavigation().classList.contains('expanded')).toBe(false);
        }
      });
    });

    it('should have default variant by default', () => {
      expect(fixture.componentInstance.variant()).toBe('default');
    });
  });

  describe('Collapse functionality', () => {
    it('should not show collapse button when collapsible is false', () => {
      expect(getCollapseButton()).toBeFalsy();
    });

    it('should show collapse button when collapsible is true', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      expect(getCollapseButton()).toBeTruthy();
    });

    it('should have aria-expanded="true" on collapse button when not collapsed', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      expect(getCollapseButton().getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-expanded="false" on collapse button when collapsed', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(getCollapseButton().getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-label for collapse when not collapsed', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      expect(getCollapseButton().getAttribute('aria-label')).toBe('Collapse menu');
    });

    it('should have aria-label for expand when collapsed', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(getCollapseButton().getAttribute('aria-label')).toBe('Expand menu');
    });

    it('should toggle collapsed state when collapse button is clicked', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      expect(fixture.componentInstance.collapsed()).toBe(false);

      getCollapseButton().click();
      fixture.detectChanges();

      expect(fixture.componentInstance.collapsed()).toBe(true);

      getCollapseButton().click();
      fixture.detectChanges();

      expect(fixture.componentInstance.collapsed()).toBe(false);
    });

    it('should close all submenus when menu is collapsed', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      const settingsItem = getMenuItemById('settings');
      settingsItem!.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(true);

      getCollapseButton().click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(false);
    });

    it('should apply collapsed class to menu when collapsed', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(getNavigation().classList.contains('collapsed')).toBe(true);
    });

    it('should use custom aria labels for collapse button', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('ariaLabels', {
        disabled: 'Disabled',
        submenu: 'Submenu',
        expand: 'Expand navigation',
        collapse: 'Collapse navigation'
      });
      fixture.detectChanges();

      expect(getCollapseButton().getAttribute('aria-label')).toBe('Collapse navigation');
    });
  });

  describe('Output emissions', () => {
    describe('itemClick', () => {
      it('should emit itemClick when clicking an item without children', () => {
        const clickSpy = jest.fn();
        fixture.componentInstance.itemClick.subscribe(clickSpy);

        getMenuItemById('home')!.click();

        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(clickSpy).toHaveBeenCalledWith(mockItems[0]);
      });

      it('should NOT emit itemClick when clicking a disabled item', () => {
        const itemsWithDisabled: MenuItem[] = [
          { id: 'disabled', content: 'Disabled', disabled: true }
        ];
        fixture.componentRef.setInput('items', itemsWithDisabled);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.itemClick.subscribe(clickSpy);

        getMenuItemById('disabled')!.click();

        expect(clickSpy).not.toHaveBeenCalled();
      });

      it('should NOT emit itemClick when clicking an item with children', () => {
        fixture.componentRef.setInput('items', mockItemsWithChildren);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.itemClick.subscribe(clickSpy);

        getMenuItemById('settings')!.click();

        expect(clickSpy).not.toHaveBeenCalled();
      });

      it('should emit correct MenuItem object with all properties', () => {
        const complexItem: MenuItem[] = [{
          id: 'complex',
          content: 'Complex Item',
          icon: 'star',
          badge: '99',
          active: true,
          value: 'custom-value'
        }];
        fixture.componentRef.setInput('items', complexItem);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.itemClick.subscribe(clickSpy);

        getMenuItemById('complex')!.click();

        expect(clickSpy).toHaveBeenCalledWith(complexItem[0]);
      });
    });

    describe('submenuToggle', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('items', mockItemsWithChildren);
        fixture.detectChanges();
      });

      it('should emit submenuToggle with expanded: true when opening submenu', () => {
        const toggleSpy = jest.fn();
        fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

        getMenuItemById('settings')!.click();

        expect(toggleSpy).toHaveBeenCalledWith({
          item: mockItemsWithChildren[1],
          expanded: true
        });
      });

      it('should emit submenuToggle with expanded: false when closing submenu', () => {
        getMenuItemById('settings')!.click();
        fixture.detectChanges();

        const toggleSpy = jest.fn();
        fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

        getMenuItemById('settings')!.click();

        expect(toggleSpy).toHaveBeenCalledWith({
          item: mockItemsWithChildren[1],
          expanded: false
        });
      });

      it('should emit itemClick for child items', () => {
        getMenuItemById('settings')!.click();
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.itemClick.subscribe(clickSpy);

        getMenuItemById('account')!.click();

        expect(clickSpy).toHaveBeenCalledWith(mockItemsWithChildren[1]!.children![0]);
      });
    });
  });

  describe('Submenu behavior', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();
    });

    it('should toggle expanded state when clicking parent with children', () => {
      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(false);

      getMenuItemById('settings')!.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(true);

      getMenuItemById('settings')!.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(false);
    });

    it('should apply expanded class to parent item when submenu is open', () => {
      const parentLi = fixture.nativeElement.querySelector('.menu-item.has-children');
      expect(parentLi.classList.contains('expanded')).toBe(false);

      getMenuItemById('settings')!.click();
      fixture.detectChanges();

      expect(parentLi.classList.contains('expanded')).toBe(true);
    });

    it('should allow multiple submenus to be open simultaneously', () => {
      const itemsWithMultipleSubmenus: MenuItem[] = [
        {
          id: 'group1',
          content: 'Group 1',
          children: [{ id: 'child1', content: 'Child 1' }]
        },
        {
          id: 'group2',
          content: 'Group 2',
          children: [{ id: 'child2', content: 'Child 2' }]
        }
      ];
      fixture.componentRef.setInput('items', itemsWithMultipleSubmenus);
      fixture.detectChanges();

      getMenuItemById('group1')!.click();
      fixture.detectChanges();
      getMenuItemById('group2')!.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isExpanded(itemsWithMultipleSubmenus[0]!)).toBe(true);
      expect(fixture.componentInstance.isExpanded(itemsWithMultipleSubmenus[1]!)).toBe(true);
    });

    it('should not expand submenu when menu is collapsed', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      getMenuItemById('settings')!.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(false);
    });
  });

  describe('Disabled state', () => {
    const itemsWithDisabled: MenuItem[] = [
      { id: 'active', content: 'Active' },
      { id: 'disabled', content: 'Disabled', disabled: true }
    ];

    beforeEach(() => {
      fixture.componentRef.setInput('items', itemsWithDisabled);
      fixture.detectChanges();
    });

    it('should not emit itemClick for disabled items', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.itemClick.subscribe(clickSpy);

      getMenuItemById('disabled')!.click();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should have aria-disabled="true" on disabled items', () => {
      expect(getMenuItemById('disabled')!.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have tabindex="-1" on disabled items', () => {
      expect(getMenuItemById('disabled')!.getAttribute('tabindex')).toBe('-1');
    });

    it('should have disabled attribute on button elements when disabled', () => {
      const disabledButton = getMenuItemById('disabled') as HTMLButtonElement;
      expect(disabledButton.disabled).toBe(true);
    });

    it('should apply disabled class to parent li', () => {
      const disabledLi = fixture.nativeElement.querySelector('.menu-item.disabled');
      expect(disabledLi).toBeTruthy();
    });
  });

  describe('Keyboard navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();
    });

    it('should activate item on Enter key', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.itemClick.subscribe(clickSpy);

      const firstItem = getMenuItemById('home')!;
      dispatchKeyboardEvent(firstItem, 'Enter');

      expect(clickSpy).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should activate item on Space key', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.itemClick.subscribe(clickSpy);

      const firstItem = getMenuItemById('home')!;
      dispatchKeyboardEvent(firstItem, ' ');

      expect(clickSpy).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should focus next item on ArrowDown', () => {
      jest.useFakeTimers();
      const searchItem = getMenuItemById('search')!;
      const focusSpy = jest.spyOn(searchItem, 'focus');

      const firstItem = getMenuItemById('home')!;
      dispatchKeyboardEvent(firstItem, 'ArrowDown');
      jest.runAllTimers();

      expect(focusSpy).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should focus previous item on ArrowUp', () => {
      jest.useFakeTimers();
      const homeItem = getMenuItemById('home')!;
      const focusSpy = jest.spyOn(homeItem, 'focus');

      const secondItem = getMenuItemById('search')!;
      dispatchKeyboardEvent(secondItem, 'ArrowUp');
      jest.runAllTimers();

      expect(focusSpy).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should wrap to first item when pressing ArrowDown on last item', () => {
      jest.useFakeTimers();
      const homeItem = getMenuItemById('home')!;
      const focusSpy = jest.spyOn(homeItem, 'focus');

      const lastItem = getMenuItemById('profile')!;
      dispatchKeyboardEvent(lastItem, 'ArrowDown');
      jest.runAllTimers();

      expect(focusSpy).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should wrap to last item when pressing ArrowUp on first item', () => {
      jest.useFakeTimers();
      const profileItem = getMenuItemById('profile')!;
      const focusSpy = jest.spyOn(profileItem, 'focus');

      const firstItem = getMenuItemById('home')!;
      dispatchKeyboardEvent(firstItem, 'ArrowUp');
      jest.runAllTimers();

      expect(focusSpy).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should focus first item on Home key', () => {
      jest.useFakeTimers();
      const homeItem = getMenuItemById('home')!;
      const focusSpy = jest.spyOn(homeItem, 'focus');

      const lastItem = getMenuItemById('profile')!;
      dispatchKeyboardEvent(lastItem, 'Home');
      jest.runAllTimers();

      expect(focusSpy).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should focus last item on End key', () => {
      jest.useFakeTimers();
      const profileItem = getMenuItemById('profile')!;
      const focusSpy = jest.spyOn(profileItem, 'focus');

      const firstItem = getMenuItemById('home')!;
      dispatchKeyboardEvent(firstItem, 'End');
      jest.runAllTimers();

      expect(focusSpy).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should not focus disabled items when navigating', () => {
      const itemsWithDisabledMiddle: MenuItem<string>[] = [
        { id: 'first', content: 'First' },
        { id: 'disabled', content: 'Disabled', disabled: true },
        { id: 'last', content: 'Last' }
      ];
      fixture.componentRef.setInput('items', itemsWithDisabledMiddle);
      fixture.detectChanges();

      const disabledItem = getMenuItemById('disabled')!;
      expect(disabledItem.getAttribute('tabindex')).toBe('-1');
    });

    it('should not render dividers as menu items', () => {
      const itemsWithDivider: MenuItem<string>[] = [
        { id: 'first', content: 'First' },
        { id: 'divider', content: '', divider: true },
        { id: 'last', content: 'Last' }
      ];
      fixture.componentRef.setInput('items', itemsWithDivider);
      fixture.detectChanges();

      const menuItems = getMenuItems();
      expect(menuItems.length).toBe(2);
      expect(getDividers().length).toBe(1);
    });

    it('should collapse menu on Escape when collapsible', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      expect(fixture.componentInstance.collapsed()).toBe(false);

      const firstItem = getMenuItemById('home')!;
      dispatchKeyboardEvent(firstItem, 'Escape');

      expect(fixture.componentInstance.collapsed()).toBe(true);
    });

    it('should not collapse menu on Escape when not collapsible', () => {
      expect(fixture.componentInstance.collapsed()).toBe(false);

      const firstItem = getMenuItemById('home')!;
      dispatchKeyboardEvent(firstItem, 'Escape');

      expect(fixture.componentInstance.collapsed()).toBe(false);
    });

    describe('Submenu keyboard navigation', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('items', mockItemsWithChildren);
        fixture.detectChanges();
      });

      it('should open submenu on ArrowRight when item has children', () => {
        const toggleSpy = jest.fn();
        fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

        const settingsItem = getMenuItemById('settings')!;
        dispatchKeyboardEvent(settingsItem, 'ArrowRight');

        expect(toggleSpy).toHaveBeenCalledWith({
          item: mockItemsWithChildren[1],
          expanded: true
        });
      });

      it('should close submenu on ArrowLeft when item has children and is expanded', () => {
        const settingsItem = getMenuItemById('settings')!;
        settingsItem.click();
        fixture.detectChanges();

        const toggleSpy = jest.fn();
        fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

        dispatchKeyboardEvent(settingsItem, 'ArrowLeft');

        expect(toggleSpy).toHaveBeenCalledWith({
          item: mockItemsWithChildren[1],
          expanded: false
        });
      });

      it('should not open submenu on ArrowRight if already expanded', () => {
        const settingsItem = getMenuItemById('settings')!;
        settingsItem.click();
        fixture.detectChanges();

        const toggleSpy = jest.fn();
        fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

        dispatchKeyboardEvent(settingsItem, 'ArrowRight');

        expect(toggleSpy).not.toHaveBeenCalled();
      });

      it('should not close submenu on ArrowLeft if already collapsed', () => {
        const toggleSpy = jest.fn();
        fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

        const settingsItem = getMenuItemById('settings')!;
        dispatchKeyboardEvent(settingsItem, 'ArrowLeft');

        expect(toggleSpy).not.toHaveBeenCalled();
      });

      it('should toggle submenu with Enter on item with children', () => {
        const toggleSpy = jest.fn();
        fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

        const settingsItem = getMenuItemById('settings')!;
        dispatchKeyboardEvent(settingsItem, 'Enter');

        expect(toggleSpy).toHaveBeenCalledWith({
          item: mockItemsWithChildren[1],
          expanded: true
        });
      });

      it('should toggle submenu with Space on item with children', () => {
        const toggleSpy = jest.fn();
        fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

        const settingsItem = getMenuItemById('settings')!;
        dispatchKeyboardEvent(settingsItem, ' ');

        expect(toggleSpy).toHaveBeenCalledWith({
          item: mockItemsWithChildren[1],
          expanded: true
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle menu with only dividers', () => {
      const onlyDividers: MenuItem[] = [
        { id: 'd1', content: '', divider: true },
        { id: 'd2', content: '', divider: true }
      ];
      fixture.componentRef.setInput('items', onlyDividers);
      fixture.detectChanges();

      expect(getMenuItems().length).toBe(0);
      expect(getDividers().length).toBe(2);
    });

    it('should handle menu with single item', () => {
      fixture.componentRef.setInput('items', [mockItems[0]]);
      fixture.detectChanges();

      expect(getMenuItems().length).toBe(1);
    });

    it('should handle items with all properties', () => {
      const fullItem: MenuItem[] = [{
        id: 'full',
        content: 'Full Item',
        icon: 'star',
        path: '/full',
        badge: '10',
        active: true,
        disabled: false,
        value: 'full-value',
        children: [
          { id: 'child', content: 'Child' }
        ]
      }];
      fixture.componentRef.setInput('items', fullItem);
      fixture.detectChanges();

      const item = getMenuItemById('full');
      expect(item).toBeTruthy();
      expect(item!.tagName.toLowerCase()).toBe('a');
      expect(item!.getAttribute('href')).toBe('/full');
      expect(item!.classList.contains('active')).toBe(true);
    });

    it('should handle dynamic item changes', () => {
      expect(getMenuItems().length).toBe(3);

      const newItems: MenuItem[] = [
        { id: 'new1', content: 'New 1' },
        { id: 'new2', content: 'New 2' }
      ];
      fixture.componentRef.setInput('items', newItems);
      fixture.detectChanges();

      expect(getMenuItems().length).toBe(2);
      expect(getMenuItemById('new1')).toBeTruthy();
      expect(getMenuItemById('new2')).toBeTruthy();
    });

    it('should handle rapid submenu toggling', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      const settingsItem = getMenuItemById('settings')!;

      settingsItem.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(true);

      settingsItem.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(false);

      settingsItem.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(true);
    });

    it('should close submenus when mode changes and menu is collapsed', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      getMenuItemById('settings')!.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(true);

      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(fixture.componentInstance.isExpanded(mockItemsWithChildren[1]!)).toBe(false);
    });
  });
});

describe('PshMenuComponent with generic type', () => {
  interface CustomValue {
    code: string;
    priority: number;
  }

  let fixture: ComponentFixture<PshMenuComponent<CustomValue>>;

  const mockItemsWithCustomValue: MenuItem<CustomValue>[] = [
    { id: 'item1', content: 'Item 1', value: { code: 'A1', priority: 1 } },
    { id: 'item2', content: 'Item 2', value: { code: 'B2', priority: 2 } }
  ];

  const getMenuItemById = (id: string) =>
    fixture.nativeElement.querySelector(`[data-menu-item-id="${id}"]`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshMenuComponent<CustomValue>);
    fixture.componentRef.setInput('items', mockItemsWithCustomValue);
    fixture.detectChanges();
  });

  it('should emit itemClick with correct generic value type', () => {
    const clickSpy = jest.fn();
    fixture.componentInstance.itemClick.subscribe(clickSpy);

    getMenuItemById('item1')!.click();

    expect(clickSpy).toHaveBeenCalledWith(mockItemsWithCustomValue[0]);
    const emittedItem = clickSpy.mock.calls[0][0] as MenuItem<CustomValue>;
    expect(emittedItem.value).toEqual({ code: 'A1', priority: 1 });
  });

  it('should preserve generic value in submenuToggle event', () => {
    const itemsWithChildren: MenuItem<CustomValue>[] = [
      {
        id: 'parent',
        content: 'Parent',
        value: { code: 'P1', priority: 10 },
        children: [
          { id: 'child', content: 'Child', value: { code: 'C1', priority: 5 } }
        ]
      }
    ];
    fixture.componentRef.setInput('items', itemsWithChildren);
    fixture.detectChanges();

    const toggleSpy = jest.fn();
    fixture.componentInstance.submenuToggle.subscribe(toggleSpy);

    const parentItem = getMenuItemById('parent')!;
    parentItem.click();

    expect(toggleSpy).toHaveBeenCalled();
    const emittedEvent = toggleSpy.mock.calls[0][0] as { item: MenuItem<CustomValue>; expanded: boolean };
    expect(emittedEvent.item.value).toEqual({ code: 'P1', priority: 10 });
  });
});

@Component({
  template: `
    <psh-menu
      [items]="items"
      [collapsible]="true"
      [(collapsed)]="isCollapsed"
      (itemClick)="onItemClick($event)"
    />
  `,
  imports: [PshMenuComponent]
})
class TestHostComponent {
  items: MenuItem[] = [
    { id: 'home', content: 'Home' },
    { id: 'settings', content: 'Settings' }
  ];
  isCollapsed = false;

  menu = viewChild(PshMenuComponent);

  onItemClick = jest.fn();
}

describe('PshMenuComponent with host component', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  const getCollapseButton = () =>
    fixture.nativeElement.querySelector('.menu-collapse-button') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should support two-way binding for collapsed state', () => {
    expect(hostComponent.isCollapsed).toBe(false);

    getCollapseButton().click();
    fixture.detectChanges();

    expect(hostComponent.isCollapsed).toBe(true);
  });

  it('should update menu when host changes collapsed state', () => {
    hostComponent.isCollapsed = true;
    fixture.detectChanges();

    const menu = hostComponent.menu();
    expect(menu!.collapsed()).toBe(true);
  });

  it('should emit itemClick to host component', () => {
    const homeItem = fixture.nativeElement.querySelector('[data-menu-item-id="home"]');
    homeItem.click();

    expect(hostComponent.onItemClick).toHaveBeenCalledWith(hostComponent.items[0]);
  });

  it('should handle bidirectional collapsed state updates', () => {
    hostComponent.isCollapsed = true;
    fixture.detectChanges();
    expect(hostComponent.menu()!.collapsed()).toBe(true);

    getCollapseButton().click();
    fixture.detectChanges();
    expect(hostComponent.isCollapsed).toBe(false);
    expect(hostComponent.menu()!.collapsed()).toBe(false);
  });
});
