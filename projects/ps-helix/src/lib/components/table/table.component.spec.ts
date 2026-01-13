import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshTableComponent } from './table.component';
import { TableColumn, TableRow } from './table.types';

describe('PshTableComponent', () => {
  let fixture: ComponentFixture<PshTableComponent>;

  const mockColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', sortable: true }
  ];

  const mockData: TableRow[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', status: 'Inactive' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', status: 'Active' }
  ];

  const getTable = () =>
    fixture.nativeElement.querySelector('[role="table"]') as HTMLTableElement;

  const getTableWrapper = () =>
    fixture.nativeElement.querySelector('.table-wrapper') as HTMLElement;

  const getColumnHeaders = () =>
    Array.from(fixture.nativeElement.querySelectorAll('thead th')) as HTMLTableCellElement[];

  const getRows = () =>
    Array.from(fixture.nativeElement.querySelectorAll('tbody tr')) as HTMLTableRowElement[];

  const getCells = (row: HTMLTableRowElement) =>
    Array.from(row.querySelectorAll('td')) as HTMLTableCellElement[];

  const getSearchInput = () =>
    fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;

  const getEmptyRow = () =>
    fixture.nativeElement.querySelector('tbody tr td') as HTMLTableCellElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshTableComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render column headers from columns input', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      expect(headers.length).toBe(3);
      expect(headers[0]!.textContent).toContain('Name');
      expect(headers[1]!.textContent).toContain('Email');
      expect(headers[2]!.textContent).toContain('Status');
    });

    it('should render data rows from data input', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(3);

      const firstRowCells = getCells(rows[0]!);
      expect(firstRowCells[0]!.textContent).toContain('Alice');
      expect(firstRowCells[1]!.textContent).toContain('alice@example.com');
      expect(firstRowCells[2]!.textContent).toContain('Active');
    });

    it('should render nested object values using path', () => {
      const columnsWithPath: TableColumn[] = [
        { key: 'userName', label: 'User Name', path: 'user.name' }
      ];
      const dataWithNested: TableRow[] = [
        { id: 1, user: { name: 'Nested User' } }
      ];

      fixture.componentRef.setInput('columns', columnsWithPath);
      fixture.componentRef.setInput('data', dataWithNested);
      fixture.detectChanges();

      const rows = getRows();
      const cells = getCells(rows[0]!);
      expect(cells[0]!.textContent).toContain('Nested User');
    });

    it('should display empty message when data is empty', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('emptyMessage', 'No records found');
      fixture.detectChanges();

      const emptyCell = getEmptyRow();
      expect(emptyCell.textContent).toContain('No records found');
    });

    it('should display custom empty message', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('emptyMessage', 'Custom empty state');
      fixture.detectChanges();

      const emptyCell = getEmptyRow();
      expect(emptyCell.textContent).toContain('Custom empty state');
    });

    it('should set correct colspan on empty row', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();

      const emptyCell = getEmptyRow();
      expect(emptyCell.getAttribute('colspan')).toBe('3');
    });
  });

  describe('Loading state', () => {
    it('should display loading indicator when loading is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getTableWrapper().getAttribute('data-state')).toBe('loading');
    });

    it('should not display data rows when loading', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(1);
      expect(rows[0]!.querySelector('.spinner')).toBeTruthy();
    });

    it('should set correct colspan on loading row', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const loadingCell = fixture.nativeElement.querySelector('tbody td');
      expect(loadingCell.getAttribute('colspan')).toBe('3');
    });
  });

  describe('Sorting functionality', () => {
    it('should have aria-sort="none" on sortable columns initially', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      const nameHeader = headers[0];
      expect(nameHeader!.getAttribute('aria-sort')).toBe('none');
    });

    it('should not have aria-sort on non-sortable columns', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      const emailHeader = headers[1];
      expect(emailHeader!.getAttribute('aria-sort')).toBeNull();
    });

    it('should emit sortChange with ascending direction on first click', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const sortChangeSpy = jest.fn();
      fixture.componentInstance.sortChange.subscribe(sortChangeSpy);

      const headers = getColumnHeaders();
      headers[0]!.click();

      expect(sortChangeSpy).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
    });

    it('should emit sortChange with descending direction on second click', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const sortChangeSpy = jest.fn();
      fixture.componentInstance.sortChange.subscribe(sortChangeSpy);

      const headers = getColumnHeaders();
      headers[0]!.click();
      headers[0]!.click();

      expect(sortChangeSpy).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    });

    it('should update aria-sort to asc after click', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      headers[0]!.click();
      fixture.detectChanges();

      expect(headers[0]!.getAttribute('aria-sort')).toBe('asc');
    });

    it('should update aria-sort to desc after second click', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      headers[0]!.click();
      fixture.detectChanges();
      headers[0]!.click();
      fixture.detectChanges();

      expect(headers[0]!.getAttribute('aria-sort')).toBe('desc');
    });

    it('should not emit sortChange when clicking non-sortable column', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const sortChangeSpy = jest.fn();
      fixture.componentInstance.sortChange.subscribe(sortChangeSpy);

      const headers = getColumnHeaders();
      headers[1]!.click();

      expect(sortChangeSpy).not.toHaveBeenCalled();
    });

    it('should reset to ascending when clicking different sortable column', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const sortChangeSpy = jest.fn();
      fixture.componentInstance.sortChange.subscribe(sortChangeSpy);

      const headers = getColumnHeaders();
      headers[0]!.click();
      headers[0]!.click();
      headers[2]!.click();

      expect(sortChangeSpy).toHaveBeenLastCalledWith({ key: 'status', direction: 'asc' });
    });

    it('should sort data in ascending order', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      headers[0]!.click();
      fixture.detectChanges();

      const rows = getRows();
      const firstRowCells = getCells(rows[0]!);
      expect(firstRowCells[0]!.textContent).toContain('Alice');
    });

    it('should sort data in descending order', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      headers[0]!.click();
      fixture.detectChanges();
      headers[0]!.click();
      fixture.detectChanges();

      const rows = getRows();
      const firstRowCells = getCells(rows[0]!);
      expect(firstRowCells[0]!.textContent).toContain('Charlie');
    });
  });

  describe('Global search', () => {
    it('should not display search input by default', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      expect(getSearchInput()).toBeFalsy();
    });

    it('should display search input when globalSearch is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.detectChanges();

      expect(getSearchInput()).toBeTruthy();
    });

    it('should have accessible aria-label on search input', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.componentRef.setInput('globalSearchPlaceholder', 'Search...');
      fixture.detectChanges();

      const input = getSearchInput();
      expect(input.getAttribute('aria-label')).toBe('Search...');
    });

    it('should emit globalSearchChange on input', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.detectChanges();

      const searchChangeSpy = jest.fn();
      fixture.componentInstance.globalSearchChange.subscribe(searchChangeSpy);

      const input = getSearchInput();
      input.value = 'Alice';
      input.dispatchEvent(new Event('input'));

      expect(searchChangeSpy).toHaveBeenCalledWith('Alice');
    });

    it('should filter data based on search term', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.detectChanges();

      const input = getSearchInput();
      input.value = 'Alice';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(1);
      expect(getCells(rows[0]!)[0]!.textContent).toContain('Alice');
    });

    it('should display no results message with search term', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.componentRef.setInput('noResultsMessage', 'No results found');
      fixture.detectChanges();

      const input = getSearchInput();
      input.value = 'nonexistent';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const emptyCell = getEmptyRow();
      expect(emptyCell.textContent).toContain('No results found');
      expect(emptyCell.textContent).toContain('nonexistent');
    });

    it('should search across all columns', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.detectChanges();

      const input = getSearchInput();
      input.value = 'bob@example.com';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(1);
      expect(getCells(rows[0]!)[0]!.textContent).toContain('Bob');
    });

    it('should be case insensitive', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.detectChanges();

      const input = getSearchInput();
      input.value = 'ALICE';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(1);
    });

    it('should use custom placeholder', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.componentRef.setInput('globalSearchPlaceholder', 'Type to filter...');
      fixture.detectChanges();

      const input = getSearchInput();
      expect(input.getAttribute('placeholder')).toBe('Type to filter...');
    });
  });

  describe('Row click events', () => {
    it('should emit rowClick when clicking a row', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const rowClickSpy = jest.fn();
      fixture.componentInstance.rowClick.subscribe(rowClickSpy);

      const rows = getRows();
      rows[0]!.click();

      expect(rowClickSpy).toHaveBeenCalledWith({
        id: 1,
        row: mockData[0]
      });
    });

    it('should emit correct row data for each row', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const rowClickSpy = jest.fn();
      fixture.componentInstance.rowClick.subscribe(rowClickSpy);

      const rows = getRows();
      rows[1]!.click();

      expect(rowClickSpy).toHaveBeenCalledWith({
        id: 2,
        row: mockData[1]
      });
    });
  });

  describe('Size variants', () => {
    it.each<['small' | 'medium' | 'large', boolean, boolean]>([
      ['small', true, false],
      ['medium', false, false],
      ['large', false, true]
    ])('should apply correct class for size="%s"', (size, hasSmall, hasLarge) => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('small')).toBe(hasSmall);
      expect(wrapper.classList.contains('large')).toBe(hasLarge);
    });
  });

  describe('Visual variants', () => {
    it('should not apply outline class for variant="default"', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('outline')).toBe(false);
    });

    it('should apply outline class for variant="outline"', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('variant', 'outline');
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('outline')).toBe(true);
    });
  });

  describe('Style options', () => {
    it('should apply striped class when striped is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('striped', true);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('striped')).toBe(true);
    });

    it('should not apply striped class by default', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('striped')).toBe(false);
    });

    it('should apply hoverable class when hoverable is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('hoverable')).toBe(true);
    });

    it('should not apply hoverable class by default', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('hoverable')).toBe(false);
    });

    it('should apply bordered class when bordered is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('bordered', true);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('bordered')).toBe(true);
    });

    it('should not apply bordered class by default', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('bordered')).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should render table with role="table"', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      expect(getTable()).toBeTruthy();
      expect(getTable().getAttribute('role')).toBe('table');
    });

    it('should have decorative icons with aria-hidden="true"', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should have aria-label on search input matching placeholder', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.componentRef.setInput('globalSearchPlaceholder', 'Search all columns');
      fixture.detectChanges();

      const input = getSearchInput();
      expect(input.getAttribute('aria-label')).toBe('Search all columns');
    });

    it('should apply column width when specified', () => {
      const columnsWithWidth: TableColumn[] = [
        { key: 'name', label: 'Name', width: '200px' }
      ];

      fixture.componentRef.setInput('columns', columnsWithWidth);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      expect(headers[0]!.style.width).toBe('200px');
    });
  });

  describe('data-state attribute', () => {
    it('should have data-state="default" when data is present', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      expect(getTableWrapper().getAttribute('data-state')).toBe('default');
    });

    it('should have data-state="loading" when loading', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getTableWrapper().getAttribute('data-state')).toBe('loading');
    });

    it('should have data-state="empty" when no data', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();

      expect(getTableWrapper().getAttribute('data-state')).toBe('empty');
    });

    it('should have data-state="empty" when search returns no results', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.detectChanges();

      const input = getSearchInput();
      input.value = 'nonexistent';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(getTableWrapper().getAttribute('data-state')).toBe('empty');
    });
  });

  describe('Combined sorting and filtering', () => {
    it('should apply sort to filtered results', () => {
      const extendedData: TableRow[] = [
        { id: 1, name: 'Alice', email: 'alice@example.com', status: 'Active' },
        { id: 2, name: 'Bob', email: 'bob@example.com', status: 'Inactive' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com', status: 'Active' },
        { id: 4, name: 'Diana', email: 'diana@example.com', status: 'Active' }
      ];

      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', extendedData);
      fixture.componentRef.setInput('globalSearch', true);
      fixture.detectChanges();

      const input = getSearchInput();
      input.value = 'example.com';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const headers = getColumnHeaders();
      headers[0]!.click();
      fixture.detectChanges();
      headers[0]!.click();
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(4);
      expect(getCells(rows[0]!)[0]!.textContent).toContain('Diana');
      expect(getCells(rows[1]!)[0]!.textContent).toContain('Charlie');
    });
  });
});
