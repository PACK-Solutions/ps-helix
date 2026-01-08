import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshPaginationComponent } from './pagination.component';
import { PaginationSize, PaginationVariant } from './pagination.types';

describe('PshPaginationComponent', () => {
  let fixture: ComponentFixture<PshPaginationComponent>;

  const getNavigation = () =>
    fixture.nativeElement.querySelector('[role="navigation"]') as HTMLElement;

  const getPageButtons = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('button[aria-label^="Page"]')
    ) as HTMLButtonElement[];

  const getActivePageButton = () =>
    fixture.nativeElement.querySelector(
      'button[aria-current="page"]'
    ) as HTMLButtonElement;

  const getButtonByLabel = (label: string) =>
    fixture.nativeElement.querySelector(
      `button[aria-label="${label}"]`
    ) as HTMLButtonElement;

  const getFirstButton = () => getButtonByLabel('First');
  const getLastButton = () => getButtonByLabel('Last');
  const getPreviousButton = () => getButtonByLabel('Previous');
  const getNextButton = () => getButtonByLabel('Next');

  const getLiveRegion = () =>
    fixture.nativeElement.querySelector('[aria-live="polite"]') as HTMLElement;

  const getItemsPerPageSelect = () =>
    fixture.nativeElement.querySelector('select') as HTMLSelectElement;

  const getItemsPerPageLabel = () =>
    fixture.nativeElement.querySelector('.items-per-page-label') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshPaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshPaginationComponent);
    fixture.detectChanges();
  });

  describe('Initial rendering', () => {
    it('should render navigation with role="navigation"', () => {
      expect(getNavigation()).toBeTruthy();
      expect(getNavigation().getAttribute('role')).toBe('navigation');
    });

    it('should have default aria-label "Pagination navigation"', () => {
      expect(getNavigation().getAttribute('aria-label')).toBe(
        'Pagination navigation'
      );
    });

    it('should render page buttons based on totalPages', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.detectChanges();

      const pageButtons = getPageButtons();
      expect(pageButtons.length).toBe(5);
    });

    it('should render first/last and prev/next buttons by default', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.detectChanges();

      expect(getFirstButton()).toBeTruthy();
      expect(getLastButton()).toBeTruthy();
      expect(getPreviousButton()).toBeTruthy();
      expect(getNextButton()).toBeTruthy();
    });
  });

  describe('Size variants', () => {
    it.each<PaginationSize>(['small', 'medium', 'large'])(
      'should accept size="%s"',
      (size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        expect(getNavigation()).toBeTruthy();
      }
    );
  });

  describe('Visual variants', () => {
    it.each<PaginationVariant>(['default', 'outline'])(
      'should accept variant="%s"',
      (variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        expect(getNavigation()).toBeTruthy();
      }
    );
  });

  describe('Page navigation by click', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('totalPages', 10);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();
    });

    it('should emit pageChange when clicking a page number', () => {
      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      const pageButtons = getPageButtons();
      const page3Button = pageButtons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('3')
      );
      page3Button?.click();

      expect(pageChangeSpy).toHaveBeenCalledWith(3);
    });

    it('should update aria-current="page" on clicked page', () => {
      const pageButtons = getPageButtons();
      const page3Button = pageButtons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('3')
      );
      page3Button?.click();
      fixture.detectChanges();

      const activeButton = getActivePageButton();
      expect(activeButton.getAttribute('aria-label')).toBe('Page 3');
    });

    it('should not emit pageChange when clicking current page', () => {
      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      const activeButton = getActivePageButton();
      activeButton.click();

      expect(pageChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Next button', () => {
    it('should emit pageChange with next page when clicked', () => {
      fixture.componentRef.setInput('totalPages', 10);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();

      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      getNextButton().click();

      expect(pageChangeSpy).toHaveBeenCalledWith(6);
    });

    it('should be disabled on last page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();

      expect(getNextButton().disabled).toBe(true);
    });

    it('should be enabled when not on last page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 3);
      fixture.detectChanges();

      expect(getNextButton().disabled).toBe(false);
    });
  });

  describe('Previous button', () => {
    it('should emit pageChange with previous page when clicked', () => {
      fixture.componentRef.setInput('totalPages', 10);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();

      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      getPreviousButton().click();

      expect(pageChangeSpy).toHaveBeenCalledWith(4);
    });

    it('should be disabled on first page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 1);
      fixture.detectChanges();

      expect(getPreviousButton().disabled).toBe(true);
    });

    it('should be enabled when not on first page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 3);
      fixture.detectChanges();

      expect(getPreviousButton().disabled).toBe(false);
    });
  });

  describe('First button', () => {
    it('should emit pageChange with 1 when clicked', () => {
      fixture.componentRef.setInput('totalPages', 10);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();

      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      getFirstButton().click();

      expect(pageChangeSpy).toHaveBeenCalledWith(1);
    });

    it('should be disabled on first page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 1);
      fixture.detectChanges();

      expect(getFirstButton().disabled).toBe(true);
    });
  });

  describe('Last button', () => {
    it('should emit pageChange with totalPages when clicked', () => {
      fixture.componentRef.setInput('totalPages', 10);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();

      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      getLastButton().click();

      expect(pageChangeSpy).toHaveBeenCalledWith(10);
    });

    it('should be disabled on last page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();

      expect(getLastButton().disabled).toBe(true);
    });
  });

  describe('Keyboard navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('totalPages', 10);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();
    });

    it('should navigate to next page on ArrowRight', () => {
      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      getNavigation().dispatchEvent(event);

      expect(pageChangeSpy).toHaveBeenCalledWith(6);
    });

    it('should navigate to previous page on ArrowLeft', () => {
      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      getNavigation().dispatchEvent(event);

      expect(pageChangeSpy).toHaveBeenCalledWith(4);
    });

    it('should navigate to first page on Home', () => {
      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      const event = new KeyboardEvent('keydown', { key: 'Home' });
      getNavigation().dispatchEvent(event);

      expect(pageChangeSpy).toHaveBeenCalledWith(1);
    });

    it('should navigate to last page on End', () => {
      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      const event = new KeyboardEvent('keydown', { key: 'End' });
      getNavigation().dispatchEvent(event);

      expect(pageChangeSpy).toHaveBeenCalledWith(10);
    });

    it('should not emit when ArrowRight pressed on last page', () => {
      fixture.componentRef.setInput('currentPage', 10);
      fixture.detectChanges();

      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      getNavigation().dispatchEvent(event);

      expect(pageChangeSpy).not.toHaveBeenCalled();
    });

    it('should not emit when ArrowLeft pressed on first page', () => {
      fixture.componentRef.setInput('currentPage', 1);
      fixture.detectChanges();

      const pageChangeSpy = jest.fn();
      fixture.componentInstance.pageChange.subscribe(pageChangeSpy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      getNavigation().dispatchEvent(event);

      expect(pageChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-current="page" only on active page button', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 3);
      fixture.detectChanges();

      const pageButtons = getPageButtons();
      const buttonsWithAriaCurrent = pageButtons.filter(
        (btn) => btn.getAttribute('aria-current') === 'page'
      );

      expect(buttonsWithAriaCurrent.length).toBe(1);
      expect(buttonsWithAriaCurrent[0]?.getAttribute('aria-label')).toBe(
        'Page 3'
      );
    });

    it('should have aria-label on navigation buttons', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.detectChanges();

      expect(getFirstButton().getAttribute('aria-label')).toBe('First');
      expect(getPreviousButton().getAttribute('aria-label')).toBe('Previous');
      expect(getNextButton().getAttribute('aria-label')).toBe('Next');
      expect(getLastButton().getAttribute('aria-label')).toBe('Last');
    });

    it('should have decorative icons with aria-hidden="true"', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should have live region for screen reader announcements', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 3);
      fixture.detectChanges();

      const liveRegion = getLiveRegion();
      expect(liveRegion).toBeTruthy();
      expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
      expect(liveRegion.textContent).toContain('3');
      expect(liveRegion.textContent).toContain('5');
    });

    it('should allow custom aria-label on navigation', () => {
      fixture.componentRef.setInput('ariaLabel', 'Results pagination');
      fixture.detectChanges();

      expect(getNavigation().getAttribute('aria-label')).toBe(
        'Results pagination'
      );
    });

    it('should have type="button" on all buttons', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.detectChanges();

      const allButtons = fixture.nativeElement.querySelectorAll('button');
      allButtons.forEach((button: HTMLButtonElement) => {
        expect(button.getAttribute('type')).toBe('button');
      });
    });
  });

  describe('Items per page selector', () => {
    it('should not show selector by default', () => {
      expect(getItemsPerPageSelect()).toBeFalsy();
    });

    it('should show selector when showItemsPerPage is true', () => {
      fixture.componentRef.setInput('showItemsPerPage', true);
      fixture.detectChanges();

      expect(getItemsPerPageSelect()).toBeTruthy();
    });

    it('should render options from itemsPerPageOptions', () => {
      fixture.componentRef.setInput('showItemsPerPage', true);
      fixture.componentRef.setInput('itemsPerPageOptions', [10, 20, 50]);
      fixture.detectChanges();

      const options = getItemsPerPageSelect().querySelectorAll('option');
      expect(options.length).toBe(3);
    });

    it('should emit itemsPerPageChange on selection change', () => {
      fixture.componentRef.setInput('showItemsPerPage', true);
      fixture.componentRef.setInput('itemsPerPageOptions', [10, 25, 50]);
      fixture.detectChanges();

      const itemsPerPageChangeSpy = jest.fn();
      fixture.componentInstance.itemsPerPageChange.subscribe(
        itemsPerPageChangeSpy
      );

      const select = getItemsPerPageSelect();
      select.value = '25';
      select.dispatchEvent(new Event('change'));

      expect(itemsPerPageChangeSpy).toHaveBeenCalledWith(25);
    });

    it('should have accessible label', () => {
      fixture.componentRef.setInput('showItemsPerPage', true);
      fixture.detectChanges();

      const select = getItemsPerPageSelect();
      expect(select.getAttribute('aria-label')).toBe('Items per page');
    });

    it('should support custom label', () => {
      fixture.componentRef.setInput('showItemsPerPage', true);
      fixture.componentRef.setInput('itemsPerPageLabel', 'Rows per page');
      fixture.detectChanges();

      const label = getItemsPerPageLabel();
      expect(label.textContent).toContain('Rows per page');
    });
  });

  describe('data-state attribute', () => {
    it('should have data-state="first" on first page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 1);
      fixture.detectChanges();

      expect(getNavigation().getAttribute('data-state')).toBe('first');
    });

    it('should have data-state="last" on last page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();

      expect(getNavigation().getAttribute('data-state')).toBe('last');
    });

    it('should have data-state="default" on middle pages', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 3);
      fixture.detectChanges();

      expect(getNavigation().getAttribute('data-state')).toBe('default');
    });
  });

  describe('Button visibility', () => {
    it('should hide first/last buttons when showFirstLast is false', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('showFirstLast', false);
      fixture.detectChanges();

      expect(getFirstButton()).toBeFalsy();
      expect(getLastButton()).toBeFalsy();
    });

    it('should show first/last buttons when showFirstLast is true', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('showFirstLast', true);
      fixture.detectChanges();

      expect(getFirstButton()).toBeTruthy();
      expect(getLastButton()).toBeTruthy();
    });

    it('should hide prev/next buttons when showPrevNext is false', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('showPrevNext', false);
      fixture.detectChanges();

      expect(getPreviousButton()).toBeFalsy();
      expect(getNextButton()).toBeFalsy();
    });

    it('should show prev/next buttons when showPrevNext is true', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('showPrevNext', true);
      fixture.detectChanges();

      expect(getPreviousButton()).toBeTruthy();
      expect(getNextButton()).toBeTruthy();
    });
  });

  describe('Custom labels', () => {
    it('should use custom navigation labels', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('firstLabel', 'Premier');
      fixture.componentRef.setInput('previousLabel', 'Precedent');
      fixture.componentRef.setInput('nextLabel', 'Suivant');
      fixture.componentRef.setInput('lastLabel', 'Dernier');
      fixture.detectChanges();

      expect(getButtonByLabel('Premier')).toBeTruthy();
      expect(getButtonByLabel('Precedent')).toBeTruthy();
      expect(getButtonByLabel('Suivant')).toBeTruthy();
      expect(getButtonByLabel('Dernier')).toBeTruthy();
    });

    it('should use custom page label in aria-label', () => {
      fixture.componentRef.setInput('totalPages', 3);
      fixture.componentRef.setInput('pageLabel', 'Seite');
      fixture.detectChanges();

      const pageButtons = fixture.nativeElement.querySelectorAll(
        'button[aria-label^="Seite"]'
      );
      expect(pageButtons.length).toBe(3);
    });
  });

  describe('Navigation error handling', () => {
    it('should emit navigationError for out of bounds page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('currentPage', 1);
      fixture.detectChanges();

      const errorSpy = jest.fn();
      fixture.componentInstance.navigationError.subscribe(errorSpy);

      fixture.componentInstance.goToPage(10);

      expect(errorSpy).toHaveBeenCalledWith({
        action: 'goToPage',
        reason: expect.stringContaining('out of bounds')
      });
    });

    it('should emit navigationError for negative page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      fixture.detectChanges();

      const errorSpy = jest.fn();
      fixture.componentInstance.navigationError.subscribe(errorSpy);

      fixture.componentInstance.goToPage(-1);

      expect(errorSpy).toHaveBeenCalledWith({
        action: 'goToPage',
        reason: expect.stringContaining('out of bounds')
      });
    });
  });

  describe('Visible pages calculation', () => {
    it('should limit visible pages to maxVisiblePages', () => {
      fixture.componentRef.setInput('totalPages', 20);
      fixture.componentRef.setInput('currentPage', 10);
      fixture.componentRef.setInput('maxVisiblePages', 5);
      fixture.detectChanges();

      const pageButtons = getPageButtons();
      expect(pageButtons.length).toBe(5);
    });

    it('should center visible pages around current page', () => {
      fixture.componentRef.setInput('totalPages', 20);
      fixture.componentRef.setInput('currentPage', 10);
      fixture.componentRef.setInput('maxVisiblePages', 5);
      fixture.detectChanges();

      const pageButtons = getPageButtons();
      const pageNumbers = pageButtons.map((btn) => {
        const match = btn.getAttribute('aria-label')?.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      });

      expect(pageNumbers).toContain(10);
      expect(pageNumbers).toEqual([8, 9, 10, 11, 12]);
    });

    it('should adjust visible pages at the start', () => {
      fixture.componentRef.setInput('totalPages', 20);
      fixture.componentRef.setInput('currentPage', 1);
      fixture.componentRef.setInput('maxVisiblePages', 5);
      fixture.detectChanges();

      const pageButtons = getPageButtons();
      const pageNumbers = pageButtons.map((btn) => {
        const match = btn.getAttribute('aria-label')?.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      });

      expect(pageNumbers).toEqual([1, 2, 3, 4, 5]);
    });

    it('should adjust visible pages at the end', () => {
      fixture.componentRef.setInput('totalPages', 20);
      fixture.componentRef.setInput('currentPage', 20);
      fixture.componentRef.setInput('maxVisiblePages', 5);
      fixture.detectChanges();

      const pageButtons = getPageButtons();
      const pageNumbers = pageButtons.map((btn) => {
        const match = btn.getAttribute('aria-label')?.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      });

      expect(pageNumbers).toEqual([16, 17, 18, 19, 20]);
    });
  });

  describe('Custom ID', () => {
    it('should use custom id when provided', () => {
      fixture.componentRef.setInput('id', 'my-pagination');
      fixture.detectChanges();

      expect(getNavigation().getAttribute('id')).toBe('my-pagination');
    });

    it('should generate unique id when not provided', () => {
      fixture.detectChanges();

      const id = getNavigation().getAttribute('id');
      expect(id).toBeTruthy();
      expect(id).toMatch(/^pagination-\d+$/);
    });
  });
});
