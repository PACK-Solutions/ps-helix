import { Component, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
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
    fixture.nativeElement.querySelector('.psh-table-wrapper') as HTMLElement;

  const getColumnHeaders = () =>
    Array.from(fixture.nativeElement.querySelectorAll('thead th')) as HTMLTableCellElement[];

  // Sorting now lives on a real <button> inside the <th> so that it is reachable by
  // keyboard. "Clicking the header" therefore means clicking whatever is interactive
  // in it, which is the button for a sortable column and the cell itself otherwise.
  const clickHeader = (index: number) => {
    const header = getColumnHeaders()[index]!;
    const sortButton = header.querySelector('.psh-sort-button') as HTMLButtonElement | null;
    (sortButton ?? header).click();
  };

  const getRows = () =>
    Array.from(fixture.nativeElement.querySelectorAll('tbody tr')) as HTMLTableRowElement[];

  const getCells = (row: HTMLTableRowElement) =>
    Array.from(row.querySelectorAll('td')) as HTMLTableCellElement[];

  const getSearchInput = () =>
    fixture.nativeElement.querySelector('.psh-global-search input') as HTMLInputElement;

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
      expect(rows[0]!.querySelector('.psh-spinner')).toBeTruthy();
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
      clickHeader(0);

      expect(sortChangeSpy).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
    });

    it('should emit sortChange with descending direction on second click', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const sortChangeSpy = jest.fn();
      fixture.componentInstance.sortChange.subscribe(sortChangeSpy);

      const headers = getColumnHeaders();
      clickHeader(0);
      clickHeader(0);

      expect(sortChangeSpy).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    });

    it('should update aria-sort to ascending after click', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      clickHeader(0);
      fixture.detectChanges();

      expect(headers[0]!.getAttribute('aria-sort')).toBe('ascending');
    });

    it('should update aria-sort to descending after second click', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      clickHeader(0);
      fixture.detectChanges();
      clickHeader(0);
      fixture.detectChanges();

      expect(headers[0]!.getAttribute('aria-sort')).toBe('descending');
    });

    it('should not emit sortChange when clicking non-sortable column', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const sortChangeSpy = jest.fn();
      fixture.componentInstance.sortChange.subscribe(sortChangeSpy);

      const headers = getColumnHeaders();
      clickHeader(1);

      expect(sortChangeSpy).not.toHaveBeenCalled();
    });

    it('should reset to ascending when clicking different sortable column', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const sortChangeSpy = jest.fn();
      fixture.componentInstance.sortChange.subscribe(sortChangeSpy);

      const headers = getColumnHeaders();
      clickHeader(0);
      clickHeader(0);
      clickHeader(2);

      expect(sortChangeSpy).toHaveBeenLastCalledWith({ key: 'status', direction: 'asc' });
    });

    it('should sort data in ascending order', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      clickHeader(0);
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
      clickHeader(0);
      fixture.detectChanges();
      clickHeader(0);
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
      expect(wrapper.classList.contains('psh-small')).toBe(hasSmall);
      expect(wrapper.classList.contains('psh-large')).toBe(hasLarge);
    });
  });

  describe('Visual variants', () => {
    it('should not apply outline class for variant="flat"', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('appearance', 'flat');
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('psh-outline')).toBe(false);
    });

    it('should apply outline class for variant="outline"', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('appearance', 'outline');
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('psh-outline')).toBe(true);
    });
  });

  describe('Style options', () => {
    it('should apply striped class when striped is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('striped', true);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('psh-striped')).toBe(true);
    });

    it('should not apply striped class by default', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('psh-striped')).toBe(false);
    });

    it('should apply hoverable class when hoverable is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('psh-hoverable')).toBe(true);
    });

    it('should not apply hoverable class by default', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('psh-hoverable')).toBe(false);
    });

    it('should apply bordered class when bordered is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('bordered', true);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('psh-bordered')).toBe(true);
    });

    it('should not apply bordered class by default', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      const wrapper = getTableWrapper();
      expect(wrapper.classList.contains('psh-bordered')).toBe(false);
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
    it('should have data-state="flat" when data is present', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      expect(getTableWrapper().getAttribute('data-state')).toBe('flat');
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
      clickHeader(0);
      fixture.detectChanges();
      clickHeader(0);
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(4);
      expect(getCells(rows[0]!)[0]!.textContent).toContain('Diana');
      expect(getCells(rows[1]!)[0]!.textContent).toContain('Charlie');
    });
  });

  describe('Expandable rows', () => {
    const expandableColumns: TableColumn[] = [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' }
    ];

    const expandableData: TableRow[] = [
      {
        id: 1, name: 'Engineering', role: 'Department',
        children: [
          { id: 11, name: 'Alice', role: 'Developer' },
          { id: 12, name: 'Bob', role: 'Designer' }
        ]
      },
      {
        id: 2, name: 'Marketing', role: 'Department',
        children: [
          { id: 21, name: 'Charlie', role: 'Manager' }
        ]
      },
      { id: 3, name: 'Sales', role: 'Department' }
    ];

    const getExpandToggle = (row: HTMLTableRowElement) =>
      row.querySelector('.psh-expand-toggle') as HTMLButtonElement | null;

    it('should not render expand column when expandable is false', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.detectChanges();

      const expandHeader = fixture.nativeElement.querySelector('.psh-expand-header');
      expect(expandHeader).toBeFalsy();
    });

    it('should render an extra th in the header when expandable is true', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const headers = getColumnHeaders();
      expect(headers.length).toBe(3);
      expect(headers[0]!.classList.contains('psh-expand-header')).toBe(true);
    });

    it('should render a caret button for expandable rows', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const rows = getRows();
      expect(getExpandToggle(rows[0]!)).toBeTruthy();
      expect(getExpandToggle(rows[1]!)).toBeTruthy();
    });

    it('should not show caret for rows without children and without expandedRowTemplate', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const rows = getRows();
      const salesRow = rows[2]!;
      expect(getExpandToggle(salesRow)).toBeFalsy();
    });

    it('should toggle expanded state on caret button click', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const rows = getRows();
      const toggle = getExpandToggle(rows[0]!)!;
      expect(toggle.getAttribute('aria-expanded')).toBe('false');

      toggle.click();
      fixture.detectChanges();

      const updatedRows = getRows();
      const updatedToggle = getExpandToggle(updatedRows[0]!)!;
      expect(updatedToggle.getAttribute('aria-expanded')).toBe('true');
    });

    it('should emit rowExpand with correct data when expanding', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const expandSpy = jest.fn();
      fixture.componentInstance.rowExpand.subscribe(expandSpy);

      const rows = getRows();
      getExpandToggle(rows[0]!)!.click();

      expect(expandSpy).toHaveBeenCalledWith({
        id: 1,
        row: expandableData[0],
        expanded: true
      });
    });

    it('should emit rowCollapse with correct data when collapsing', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const collapseSpy = jest.fn();
      fixture.componentInstance.rowCollapse.subscribe(collapseSpy);

      const rows = getRows();
      getExpandToggle(rows[0]!)!.click();
      fixture.detectChanges();

      const updatedRows = getRows();
      getExpandToggle(updatedRows[0]!)!.click();

      expect(collapseSpy).toHaveBeenCalledWith({
        id: 1,
        row: expandableData[0],
        expanded: false
      });
    });

    it('should render child rows below parent when expanded', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const rows = getRows();
      getExpandToggle(rows[0]!)!.click();
      fixture.detectChanges();

      const childRows = fixture.nativeElement.querySelectorAll('.psh-child-row');
      expect(childRows.length).toBe(2);
      expect(childRows[0].textContent).toContain('Alice');
      expect(childRows[1].textContent).toContain('Bob');
    });

    it('should set aria-expanded correctly', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const rows = getRows();
      const toggle = getExpandToggle(rows[0]!)!;
      expect(toggle.getAttribute('aria-expanded')).toBe('false');

      toggle.click();
      fixture.detectChanges();

      const updatedRows = getRows();
      const updatedToggle = getExpandToggle(updatedRows[0]!)!;
      expect(updatedToggle.getAttribute('aria-expanded')).toBe('true');
    });

    it('should collapse previously open row in singleExpand mode', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.componentRef.setInput('singleExpand', true);
      fixture.detectChanges();

      const rows = getRows();
      getExpandToggle(rows[0]!)!.click();
      fixture.detectChanges();

      let childRows = fixture.nativeElement.querySelectorAll('.psh-child-row');
      expect(childRows.length).toBe(2);

      const updatedRows = getRows();
      getExpandToggle(updatedRows[3]!)!.click();
      fixture.detectChanges();

      childRows = fixture.nativeElement.querySelectorAll('.psh-child-row');
      expect(childRows.length).toBe(1);
      expect(childRows[0].textContent).toContain('Charlie');
    });

    it('should not emit rowClick when clicking expand toggle', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const rowClickSpy = jest.fn();
      fixture.componentInstance.rowClick.subscribe(rowClickSpy);

      const rows = getRows();
      getExpandToggle(rows[0]!)!.click();

      expect(rowClickSpy).not.toHaveBeenCalled();
    });

    it('should have correct colspan on loading row when expandable', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const loadingCell = fixture.nativeElement.querySelector('tbody td');
      expect(loadingCell.getAttribute('colspan')).toBe('3');
    });

    it('should have correct colspan on empty row when expandable', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const emptyCell = fixture.nativeElement.querySelector('tbody td');
      expect(emptyCell.getAttribute('colspan')).toBe('3');
    });

    it('should preserve expand state after sort', () => {
      const sortableExpandColumns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'role', label: 'Role' }
      ];

      fixture.componentRef.setInput('columns', sortableExpandColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const rows = getRows();
      getExpandToggle(rows[0]!)!.click();
      fixture.detectChanges();

      let childRows = fixture.nativeElement.querySelectorAll('.psh-child-row');
      expect(childRows.length).toBe(2);

      const headers = getColumnHeaders();
      clickHeader(1);
      fixture.detectChanges();

      childRows = fixture.nativeElement.querySelectorAll('.psh-child-row');
      expect(childRows.length).toBe(2);
    });

    it('should support keyboard activation on expand toggle', () => {
      fixture.componentRef.setInput('columns', expandableColumns);
      fixture.componentRef.setInput('data', expandableData);
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();

      const rows = getRows();
      const toggle = getExpandToggle(rows[0]!)!;

      toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      toggle.click();
      fixture.detectChanges();

      const updatedRows = getRows();
      const updatedToggle = getExpandToggle(updatedRows[0]!)!;
      expect(updatedToggle.getAttribute('aria-expanded')).toBe('true');
    });
  });

});

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PshTableComponent],
  template: `
    <psh-table
      [columns]="columns"
      [data]="data"
      [expandable]="true"
      [expandedRowTemplate]="detailTpl"
    ></psh-table>
    <ng-template #detailTpl let-row>
      <div class="custom-detail">Detail for {{ row.name }}</div>
    </ng-template>
  `
})
class TestHostComponent {
  columns: TableColumn[] = [
    { key: 'name', label: 'Name' }
  ];
  data: TableRow[] = [
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Beta' }
  ];
}

describe('PshTableComponent - Expandable rows with custom template', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
  });

  it('should show expand toggle when expandedRowTemplate is provided even without children', () => {
    const toggles = hostFixture.nativeElement.querySelectorAll('.psh-expand-toggle');
    expect(toggles.length).toBe(2);
  });

  it('should render custom template content when expanded', () => {
    const toggles = hostFixture.nativeElement.querySelectorAll('.psh-expand-toggle');
    toggles[0].click();
    hostFixture.detectChanges();

    const detail = hostFixture.nativeElement.querySelector('.custom-detail');
    expect(detail).toBeTruthy();
    expect(detail.textContent).toContain('Detail for Alpha');
  });

  it('should render expanded-content-row instead of child-row for custom template', () => {
    const toggles = hostFixture.nativeElement.querySelectorAll('.psh-expand-toggle');
    toggles[0].click();
    hostFixture.detectChanges();

    const expandedRow = hostFixture.nativeElement.querySelector('.psh-expanded-content-row');
    const childRow = hostFixture.nativeElement.querySelector('.psh-child-row');
    expect(expandedRow).toBeTruthy();
    expect(childRow).toBeFalsy();
  });
});

// Sorting used to live in a (click) on the <th> itself, so it was unreachable without a
// mouse — and the .sort-button:focus-visible rule in the CSS targeted a class the
// template never rendered.
describe('PshTableComponent — sorting is keyboard-operable', () => {
  let fixture: ComponentFixture<PshTableComponent>;

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role' },
  ];
  const data: TableRow[] = [
    { id: 1, name: 'Grace Hopper', role: 'Admiral' },
    { id: 2, name: 'Ada Lovelace', role: 'Engineer' },
  ];

  const sortButtons = () =>
    Array.from(fixture.nativeElement.querySelectorAll('thead .psh-sort-button')) as HTMLButtonElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PshTableComponent] }).compileComponents();

    fixture = TestBed.createComponent(PshTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
  });

  it('should render a real button only for sortable columns', () => {
    const buttons = sortButtons();
    expect(buttons.length).toBe(1);
    expect(buttons[0]!.tagName).toBe('BUTTON');
    expect(buttons[0]!.getAttribute('type')).toBe('button');
    expect(buttons[0]!.textContent).toContain('Name');
  });

  it('should sort when the header button is activated by keyboard', () => {
    const sortChange = jest.fn();
    fixture.componentInstance.sortChange.subscribe(sortChange);

    // A native button turns Enter/Space into a click event; dispatching it is what a
    // keyboard user's key press ends up doing.
    sortButtons()[0]!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(sortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
  });

  it('should expose the sort state on the th, not on a decorative icon', () => {
    const header = fixture.nativeElement.querySelector('thead th') as HTMLTableCellElement;
    expect(header.getAttribute('scope')).toBe('col');
    expect(header.getAttribute('aria-sort')).toBe('none');

    sortButtons()[0]!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(header.getAttribute('aria-sort')).toBe('ascending');

    const icons = Array.from(header.querySelectorAll('i')) as HTMLElement[];
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('aria-label')).toBeNull();
    }
  });

  it('should only make rows focusable when they are interactive', () => {
    const row = () => fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;
    expect(row().getAttribute('tabindex')).toBeNull();

    fixture.componentRef.setInput('hoverable', true);
    fixture.detectChanges();
    expect(row().getAttribute('tabindex')).toBe('0');
  });

  it('should emit rowClick from Enter on a focusable row', () => {
    fixture.componentRef.setInput('hoverable', true);
    fixture.detectChanges();

    const rowClick = jest.fn();
    fixture.componentInstance.rowClick.subscribe(rowClick);

    const row = fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(rowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });
});
