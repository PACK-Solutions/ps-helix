import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PshDropdownComponent } from './dropdown.component';
import { DropdownItem, DropdownPlacement, DropdownSize } from './dropdown.types';

describe('PshDropdownComponent', () => {
  let fixture: ComponentFixture<PshDropdownComponent<string>>;

  const mockItems: DropdownItem<string>[] = [
    { content: 'Option 1', value: 'opt1' },
    { content: 'Option 2', value: 'opt2', icon: 'star' },
    { content: 'Option 3', value: 'opt3' }
  ];

  const getContainer = () =>
    fixture.nativeElement.querySelector('.dropdown-container') as HTMLElement;

  const getTrigger = () =>
    fixture.nativeElement.querySelector('.dropdown-trigger') as HTMLButtonElement;

  const getMenu = () =>
    fixture.nativeElement.querySelector('.dropdown-menu') as HTMLElement;

  const getItems = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.dropdown-item')) as HTMLButtonElement[];

  const getItem = (index: number) =>
    getItems()[index] as HTMLButtonElement;

  const getTriggerArrow = () =>
    fixture.nativeElement.querySelector('.trigger-arrow') as HTMLElement;

  const openDropdown = () => {
    getTrigger().click();
    fixture.detectChanges();
  };

  const createKeyboardEvent = (key: string, eventType = 'keydown'): KeyboardEvent => {
    return new KeyboardEvent(eventType, {
      key,
      bubbles: true,
      cancelable: true
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshDropdownComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshDropdownComponent<string>);
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Content rendering', () => {
    it('should render dropdown container', () => {
      expect(getContainer()).toBeTruthy();
    });

    it('should render trigger button', () => {
      expect(getTrigger()).toBeTruthy();
    });

    it('should render default label', () => {
      expect(getTrigger().textContent).toContain('Dropdown Menu');
    });

    it('should render custom label', () => {
      fixture.componentRef.setInput('label', 'Actions');
      fixture.detectChanges();

      expect(getTrigger().textContent).toContain('Actions');
    });

    it('should render custom icon in trigger', () => {
      fixture.componentRef.setInput('icon', 'gear');
      fixture.detectChanges();

      const icon = getTrigger().querySelector('i.ph-gear');
      expect(icon).toBeTruthy();
    });

    it('should render caret down arrow in trigger', () => {
      expect(getTriggerArrow()).toBeTruthy();
      expect(getTriggerArrow().classList.contains('ph-caret-down')).toBe(true);
    });

    it('should NOT render menu when closed', () => {
      expect(getMenu()).toBeFalsy();
    });

    it('should render menu when opened', () => {
      openDropdown();
      expect(getMenu()).toBeTruthy();
    });

    it('should render all items when menu is open', () => {
      openDropdown();
      expect(getItems().length).toBe(3);
    });

    it('should render item labels', () => {
      openDropdown();

      expect(getItem(0).textContent).toContain('Option 1');
      expect(getItem(1).textContent).toContain('Option 2');
      expect(getItem(2).textContent).toContain('Option 3');
    });

    it('should render icon in item when provided', () => {
      openDropdown();

      const iconItem = getItem(1);
      const icon = iconItem.querySelector('i.ph-star');
      expect(icon).toBeTruthy();
    });

    it('should NOT render icon in item when not provided', () => {
      openDropdown();

      const noIconItem = getItem(0);
      const icon = noIconItem.querySelector('i');
      expect(icon).toBeFalsy();
    });
  });

  describe('Open and close behavior', () => {
    it('should open menu on trigger click', () => {
      expect(fixture.componentInstance.isOpen()).toBe(false);

      getTrigger().click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(true);
      expect(getMenu()).toBeTruthy();
    });

    it('should close menu on trigger click when already open', () => {
      openDropdown();
      expect(fixture.componentInstance.isOpen()).toBe(true);

      getTrigger().click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(false);
      expect(getMenu()).toBeFalsy();
    });

    it('should emit opened event when opening', () => {
      const openedSpy = jest.fn();
      fixture.componentInstance.opened.subscribe(openedSpy);

      getTrigger().click();
      fixture.detectChanges();

      expect(openedSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit closed event when closing via trigger', () => {
      const closedSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closedSpy);

      openDropdown();
      getTrigger().click();
      fixture.detectChanges();

      expect(closedSpy).toHaveBeenCalledTimes(1);
    });

    it('should close menu on click outside', () => {
      openDropdown();
      expect(fixture.componentInstance.isOpen()).toBe(true);

      document.body.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('should emit closed event on click outside', () => {
      const closedSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closedSpy);

      openDropdown();
      document.body.click();
      fixture.detectChanges();

      expect(closedSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT close menu when clicking inside menu', () => {
      openDropdown();

      getMenu().click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    });

    it('should apply open class to container when open', () => {
      openDropdown();

      expect(getContainer().classList.contains('open')).toBe(true);
    });

    it('should remove open class from container when closed', () => {
      openDropdown();
      getTrigger().click();
      fixture.detectChanges();

      expect(getContainer().classList.contains('open')).toBe(false);
    });

    it('should apply open class to arrow when open', () => {
      openDropdown();

      expect(getTriggerArrow().classList.contains('open')).toBe(true);
    });
  });

  describe('Item selection', () => {
    it('should select item on click', () => {
      openDropdown();
      getItem(1).click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedItem()).toEqual(mockItems[1]);
    });

    it('should emit selected event with item data', () => {
      const selectedSpy = jest.fn();
      fixture.componentInstance.selected.subscribe(selectedSpy);

      openDropdown();
      getItem(1).click();

      expect(selectedSpy).toHaveBeenCalledWith(mockItems[1]);
    });

    it('should close menu after selection', () => {
      openDropdown();
      getItem(0).click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(false);
      expect(getMenu()).toBeFalsy();
    });

    it('should apply active class to selected item', () => {
      openDropdown();
      getItem(1).click();
      fixture.detectChanges();

      openDropdown();
      expect(getItem(1).classList.contains('active')).toBe(true);
    });

    it('should NOT select disabled item', () => {
      const itemsWithDisabled: DropdownItem<string>[] = [
        { content: 'Option 1', value: 'opt1' },
        { content: 'Option 2', value: 'opt2', disabled: true },
        { content: 'Option 3', value: 'opt3' }
      ];
      fixture.componentRef.setInput('items', itemsWithDisabled);
      fixture.detectChanges();

      const selectedSpy = jest.fn();
      fixture.componentInstance.selected.subscribe(selectedSpy);

      openDropdown();
      getItem(1).click();
      fixture.detectChanges();

      expect(selectedSpy).not.toHaveBeenCalled();
      expect(fixture.componentInstance.selectedItem()).toBeNull();
    });

    it('should NOT close menu when clicking disabled item', () => {
      const itemsWithDisabled: DropdownItem<string>[] = [
        { content: 'Option 1', value: 'opt1', disabled: true }
      ];
      fixture.componentRef.setInput('items', itemsWithDisabled);
      fixture.detectChanges();

      openDropdown();
      getItem(0).click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    });
  });

  describe('Disabled state - component level', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
    });

    it('should NOT open menu when component is disabled', () => {
      getTrigger().click();
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(false);
      expect(getMenu()).toBeFalsy();
    });

    it('should have disabled attribute on trigger', () => {
      expect(getTrigger().disabled).toBe(true);
    });

    it('should have aria-disabled on trigger', () => {
      expect(getTrigger().getAttribute('aria-disabled')).toBe('true');
    });

    it('should apply disabled class to container', () => {
      expect(getContainer().classList.contains('disabled')).toBe(true);
    });

    it('should have data-state="disabled"', () => {
      expect(getContainer().getAttribute('data-state')).toBe('disabled');
    });
  });

  describe('Disabled state - item level', () => {
    const itemsWithDisabled: DropdownItem<string>[] = [
      { content: 'Option 1', value: 'opt1' },
      { content: 'Option 2', value: 'opt2', disabled: true },
      { content: 'Option 3', value: 'opt3' }
    ];

    beforeEach(() => {
      fixture.componentRef.setInput('items', itemsWithDisabled);
      fixture.detectChanges();
      openDropdown();
    });

    it('should apply disabled class to disabled item', () => {
      expect(getItem(0).classList.contains('disabled')).toBe(false);
      expect(getItem(1).classList.contains('disabled')).toBe(true);
      expect(getItem(2).classList.contains('disabled')).toBe(false);
    });

    it('should have aria-disabled on disabled item', () => {
      expect(getItem(1).getAttribute('aria-disabled')).toBe('true');
    });

    it('should have disabled attribute on disabled item', () => {
      expect(getItem(1).disabled).toBe(true);
    });

    it('should have tabindex=-1 on disabled item', () => {
      expect(getItem(1).getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Keyboard navigation - trigger', () => {
    it('should open menu on Enter', () => {
      getTrigger().dispatchEvent(createKeyboardEvent('Enter'));
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    });

    it('should open menu on Space', () => {
      getTrigger().dispatchEvent(createKeyboardEvent(' '));
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    });

    it('should open menu on ArrowDown', () => {
      getTrigger().dispatchEvent(createKeyboardEvent('ArrowDown'));
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    });

    it('should open menu on ArrowUp', () => {
      getTrigger().dispatchEvent(createKeyboardEvent('ArrowUp'));
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    });

    it('should close menu on Escape', () => {
      openDropdown();

      getTrigger().dispatchEvent(createKeyboardEvent('Escape'));
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('should NOT respond to keyboard when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getTrigger().dispatchEvent(createKeyboardEvent('Enter'));
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('should prevent default on Enter', () => {
      const event = createKeyboardEvent('Enter');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      getTrigger().dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default on Space', () => {
      const event = createKeyboardEvent(' ');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      getTrigger().dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Keyboard navigation - menu items', () => {
    beforeEach(() => {
      openDropdown();
    });

    it('should handle ArrowDown navigation without error', fakeAsync(() => {
      tick();

      expect(() => {
        getTrigger().dispatchEvent(createKeyboardEvent('ArrowDown'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    }));

    it('should handle ArrowUp navigation without error', fakeAsync(() => {
      tick();
      getTrigger().dispatchEvent(createKeyboardEvent('ArrowDown'));
      tick();
      fixture.detectChanges();

      expect(() => {
        getTrigger().dispatchEvent(createKeyboardEvent('ArrowUp'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    }));

    it('should handle Home key without error', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(() => {
        const item = getItem(1);
        item.dispatchEvent(createKeyboardEvent('Home'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();
    }));

    it('should handle End key without error', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(() => {
        const firstItem = getItem(0);
        firstItem.dispatchEvent(createKeyboardEvent('End'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();
    }));

    it('should select item on Enter', () => {
      const selectedSpy = jest.fn();
      fixture.componentInstance.selected.subscribe(selectedSpy);

      const firstItem = getItem(0);
      firstItem.dispatchEvent(createKeyboardEvent('Enter'));
      fixture.detectChanges();

      expect(selectedSpy).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should select item on Space', () => {
      const selectedSpy = jest.fn();
      fixture.componentInstance.selected.subscribe(selectedSpy);

      const firstItem = getItem(0);
      firstItem.dispatchEvent(createKeyboardEvent(' '));
      fixture.detectChanges();

      expect(selectedSpy).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should close menu on Escape', () => {
      const firstItem = getItem(0);
      firstItem.dispatchEvent(createKeyboardEvent('Escape'));
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('should close menu on Tab', () => {
      const firstItem = getItem(0);
      firstItem.dispatchEvent(createKeyboardEvent('Tab'));
      fixture.detectChanges();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('should handle navigation with disabled items without error', fakeAsync(() => {
      fixture.componentInstance.close();
      fixture.detectChanges();

      const itemsWithDisabled: DropdownItem<string>[] = [
        { content: 'Option 1', value: 'opt1' },
        { content: 'Option 2', value: 'opt2', disabled: true },
        { content: 'Option 3', value: 'opt3' }
      ];
      fixture.componentRef.setInput('items', itemsWithDisabled);
      fixture.detectChanges();

      openDropdown();
      tick();
      fixture.detectChanges();

      expect(() => {
        const firstItem = getItem(0);
        firstItem.dispatchEvent(createKeyboardEvent('ArrowDown'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();
    }));

    it('should handle upward navigation with disabled items without error', fakeAsync(() => {
      fixture.componentInstance.close();
      fixture.detectChanges();

      const itemsWithDisabled: DropdownItem<string>[] = [
        { content: 'Option 1', value: 'opt1' },
        { content: 'Option 2', value: 'opt2', disabled: true },
        { content: 'Option 3', value: 'opt3' }
      ];
      fixture.componentRef.setInput('items', itemsWithDisabled);
      fixture.detectChanges();

      openDropdown();
      tick();
      fixture.detectChanges();

      const firstItem = getItem(0);
      firstItem.dispatchEvent(createKeyboardEvent('ArrowDown'));
      tick();
      fixture.detectChanges();

      expect(() => {
        const lastItem = getItem(2);
        lastItem.dispatchEvent(createKeyboardEvent('ArrowUp'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();
    }));

    it('should handle wrap navigation from last to first without error', fakeAsync(() => {
      tick();

      const firstItem = getItem(0);
      firstItem.dispatchEvent(createKeyboardEvent('End'));
      tick();
      fixture.detectChanges();

      expect(() => {
        const lastItem = getItem(2);
        lastItem.dispatchEvent(createKeyboardEvent('ArrowDown'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();
    }));

    it('should handle wrap navigation from first to last without error', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(() => {
        const firstItem = getItem(0);
        firstItem.dispatchEvent(createKeyboardEvent('ArrowUp'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();
    }));

    it('should prevent default on ArrowDown in items', () => {
      const firstItem = getItem(0);
      const event = createKeyboardEvent('ArrowDown');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      firstItem.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default on ArrowUp in items', () => {
      const firstItem = getItem(0);
      const event = createKeyboardEvent('ArrowUp');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      firstItem.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default on Home in items', () => {
      const firstItem = getItem(0);
      const event = createKeyboardEvent('Home');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      firstItem.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default on End in items', () => {
      const firstItem = getItem(0);
      const event = createKeyboardEvent('End');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      firstItem.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });


  describe('Accessibility', () => {
    it('should have aria-expanded="false" when closed', () => {
      expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-expanded="true" when open', () => {
      openDropdown();
      expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-haspopup="menu" on trigger', () => {
      expect(getTrigger().getAttribute('aria-haspopup')).toBe('menu');
    });

    it('should have default aria-label on trigger', () => {
      expect(getTrigger().getAttribute('aria-label')).toBe('Toggle dropdown menu');
    });

    it('should have custom aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Open actions menu');
      fixture.detectChanges();

      expect(getTrigger().getAttribute('aria-label')).toBe('Open actions menu');
    });

    it('should have type="button" on trigger', () => {
      expect(getTrigger().getAttribute('type')).toBe('button');
    });

    it('should have role="menu" on menu', () => {
      openDropdown();
      expect(getMenu().getAttribute('role')).toBe('menu');
    });

    it('should have role="menuitem" on each item', () => {
      openDropdown();

      getItems().forEach(item => {
        expect(item.getAttribute('role')).toBe('menuitem');
      });
    });

    it('should have aria-hidden on icons', () => {
      fixture.componentRef.setInput('icon', 'gear');
      fixture.detectChanges();

      const triggerIcon = getTrigger().querySelector('i.ph-gear');
      expect(triggerIcon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should have aria-hidden on arrow icon', () => {
      expect(getTriggerArrow().getAttribute('aria-hidden')).toBe('true');
    });

    it('should have data-dropdown-item-index attribute on items', () => {
      openDropdown();

      getItems().forEach((item, index) => {
        expect(item.getAttribute('data-dropdown-item-index')).toBe(String(index));
      });
    });
  });

  describe('Variants', () => {
    it.each<['primary' | 'secondary' | 'outline' | 'text']>([
      ['primary'],
      ['secondary'],
      ['outline'],
      ['text']
    ])('should apply %s variant class to trigger', (variant) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(getTrigger().classList.contains(variant)).toBe(true);
    });

    it('should have primary variant by default', () => {
      expect(getTrigger().classList.contains('primary')).toBe(true);
    });
  });

  describe('Placement', () => {
    it.each<[DropdownPlacement]>([
      ['bottom-start'],
      ['bottom-end'],
      ['top-start'],
      ['top-end']
    ])('should apply %s placement class to menu', (placement) => {
      fixture.componentRef.setInput('placement', placement);
      fixture.detectChanges();
      openDropdown();

      expect(getMenu().classList.contains(placement)).toBe(true);
    });

    it('should have bottom-start placement by default', () => {
      openDropdown();
      expect(getMenu().classList.contains('bottom-start')).toBe(true);
    });
  });

  describe('Size', () => {
    it.each<[DropdownSize]>([
      ['small'],
      ['medium'],
      ['large']
    ])('should apply %s size class to container', (size) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      expect(getContainer().classList.contains(size)).toBe(true);
    });

    it('should have medium size by default', () => {
      expect(getContainer().classList.contains('medium')).toBe(true);
    });
  });

  describe('State attribute', () => {
    it('should have data-state="closed" when closed', () => {
      expect(getContainer().getAttribute('data-state')).toBe('closed');
    });

    it('should have data-state="open" when open', () => {
      openDropdown();
      expect(getContainer().getAttribute('data-state')).toBe('open');
    });

    it('should have data-state="disabled" when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getContainer().getAttribute('data-state')).toBe('disabled');
    });

    it('should prioritize disabled state over open', () => {
      openDropdown();
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getContainer().getAttribute('data-state')).toBe('disabled');
    });
  });

  describe('Lifecycle', () => {
    it('should remove click outside listener on destroy', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      fixture.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  describe('Edge cases', () => {
    it('should handle empty items array', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();
      openDropdown();

      expect(getItems().length).toBe(0);
    });

    it('should handle single item', () => {
      fixture.componentRef.setInput('items', [mockItems[0]]);
      fixture.detectChanges();
      openDropdown();

      expect(getItems().length).toBe(1);
    });

    it('should NOT emit closed event if already closed', () => {
      const closedSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closedSpy);

      fixture.componentInstance.close();

      expect(closedSpy).not.toHaveBeenCalled();
    });

    it('should handle all items disabled for navigation', fakeAsync(() => {
      const allDisabledItems: DropdownItem<string>[] = [
        { content: 'Option 1', value: 'opt1', disabled: true },
        { content: 'Option 2', value: 'opt2', disabled: true }
      ];
      fixture.componentRef.setInput('items', allDisabledItems);
      fixture.detectChanges();
      openDropdown();

      expect(() => {
        getTrigger().dispatchEvent(createKeyboardEvent('ArrowDown'));
        tick();
        fixture.detectChanges();
      }).not.toThrow();
    }));
  });
});
