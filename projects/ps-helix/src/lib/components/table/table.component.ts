import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, InjectionToken, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PshInputComponent } from '../input/input.component';
import { TableColumn, TableRow, TableSort, TableConfig, TableRowClickEvent, TableRowExpandEvent, TableExpandedRowContext, TableHeaderContext, TableEmptyContext } from './table.types';

export const TABLE_CONFIG = new InjectionToken<Partial<TableConfig>>('TABLE_CONFIG', {
  factory: () => ({
    variant: 'flat',
    size: 'medium',
    striped: false,
    hoverable: false,
    bordered: false,
    loading: false,
    emptyMessage: 'No data available',
    noResultsMessage: 'No results found',
    globalSearch: false,
    globalSearchPlaceholder: 'Search in all columns...',
    tableLayout: 'auto',
    truncateText: false,
    fullWidth: false,
    expandable: false,
    singleExpand: false
  })
});

@Component({
  selector: 'psh-table',
  imports: [NgTemplateOutlet, PshInputComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'psh-table',
    '[class.psh-full-width]': 'fullWidth()'
  }
})
export class PshTableComponent {
  private config = inject(TABLE_CONFIG);

  appearance = input<'flat' | 'outline'>(this.config.appearance ?? 'flat');
  size = input<'small' | 'medium' | 'large'>(this.config.size ?? 'medium');
  striped = input(this.config.striped ?? false);
  hoverable = input(this.config.hoverable ?? false);
  bordered = input(this.config.bordered ?? false);
  loading = input(this.config.loading ?? false);
  globalSearch = input(this.config.globalSearch ?? false);
  fullWidth = input(this.config.fullWidth ?? false);
  columns = input.required<TableColumn[]>();
  data = input.required<TableRow[]>();
  emptyMessage = input<string>(this.config.emptyMessage ?? 'No data available');
  noResultsMessage = input<string>(this.config.noResultsMessage ?? 'No results found');
  globalSearchPlaceholder = input(this.config.globalSearchPlaceholder ?? 'Search in all columns...');
  tableLayout = input<'auto' | 'fixed'>(this.config.tableLayout ?? 'auto');
  truncateText = input(this.config.truncateText ?? false);
  expandable = input(this.config.expandable ?? false);
  singleExpand = input(this.config.singleExpand ?? false);
  expandedRowTemplate = input<TemplateRef<TableExpandedRowContext>>();

  /**
   * Replaces the content of every column header.
   *
   * The body cell was templatable and the header was not, so a per-column filter or a
   * two-line label meant `::ng-deep` into the `<th>`. The context carries the sort state and
   * a `toggleSort` callback, so the component keeps owning the keyboard path and `aria-sort`.
   */
  headerTemplate = input<TemplateRef<TableHeaderContext>>();

  /**
   * Replaces the empty state.
   *
   * `emptyMessage` and `noResultsMessage` are strings, so an illustration or a "clear the
   * filter" button had nowhere to go. Both inputs still work when no template is given.
   */
  emptyTemplate = input<TemplateRef<TableEmptyContext>>();

  /**
   * Extra classes for a row, from the row itself.
   *
   * `InfoCardData.customClass` already existed for the same need one component over; a table
   * had no way to mark a row as overdue, selected or archived.
   */
  rowClass = input<(row: TableRow) => string | undefined>();

  sortChange = output<TableSort>();
  globalSearchChange = output<string>();
  rowClicked = output<TableRowClickEvent>();
  rowExpanded = output<TableRowExpandEvent>();
  rowCollapsed = output<TableRowExpandEvent>();

  private currentSortSignal = signal<TableSort | undefined>(undefined);
  readonly searchTermSignal = signal('');
  private expandedRowIds = signal<Set<string | number>>(new Set());

  currentSort = computed(() => this.currentSortSignal());
  searchTerm = computed(() => this.searchTermSignal());

  computedEmptyMessage = computed(() => {
    return this.searchTerm()
      ? `${this.noResultsMessage()} "${this.searchTerm()}"`
      : this.emptyMessage();
  });

  state = computed(() => {
    if (this.loading()) return 'loading';
    if (this.filteredData().length === 0) return 'empty';
    return 'flat';
  });

  filteredData = computed(() => {
    let result = [...this.data()];

    if (this.searchTerm()) {
      result = this.filterData(result, this.searchTerm());
    }

    const sort = this.currentSort();
    if (sort) {
      result = this.sortData(result, sort);
    }

    return result;
  });

  /**
   * Trie les données
   */
  private sortData(data: TableRow[], sort: TableSort): TableRow[] {
    return [...data].sort((a, b) => {
      const column = this.columns().find(col => col.key === sort.key);
      
      // Utiliser la fonction de tri personnalisée si elle existe
      if (column?.sortFn) {
        return sort.direction === 'asc' 
          ? column.sortFn(a, b)
          : column.sortFn(b, a);
      }
      
      // Sinon, utiliser le tri par défaut avec le chemin
      const aValue = this.getNestedValue(a, column?.path || sort.key);
      const bValue = this.getNestedValue(b, column?.path || sort.key);

      return sort.direction === 'asc'
        ? this.compareValues(aValue, bValue)
        : this.compareValues(bValue, aValue);
    });
  }

  /**
   * Compare deux valeurs inconnues (numérique si possible, sinon lexicographique).
   */
  private compareValues(a: unknown, b: unknown): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return a > b ? 1 : -1;
    }
    return String(a ?? '') > String(b ?? '') ? 1 : -1;
  }

  /**
   * Filtre les données
   */
  private filterData(data: TableRow[], searchTerm: string): TableRow[] {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(row => {
      return this.columns().some(column => {
        const value = this.getNestedValue(row, column.path || column.key);
        return value != null && String(value).toLowerCase().includes(term);
      });
    });
  }

  /**
   * Récupère la valeur d'un objet imbriqué en utilisant un chemin
   */
  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>(
      (acc, part) =>
        acc != null && typeof acc === 'object'
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      obj
    );
  }

  handleSort(column: TableColumn): void {
    if (!column.sortable) return;

    const direction = !this.currentSort() || this.currentSort()?.key !== column.key
      ? 'asc'
      : this.currentSort()?.direction === 'asc'
        ? 'desc'
        : 'asc';

    const sort: TableSort = { key: column.key, direction };
    this.currentSortSignal.set(sort);
    this.sortChange.emit(sort);
  }

  onSearchValueChange(value: string): void {
    this.globalSearchChange.emit(value);
  }

  handleRowClick(row: TableRow): void {
    this.rowClicked.emit({ id: row.id, row });
  }

  protected getCellValue(row: TableRow, column: TableColumn): unknown {
    return this.getNestedValue(row, column.path || column.key);
  }

  /**
   * The context a custom header receives.
   *
   * `toggleSort` is handed over rather than left to the caller: the component keeps owning
   * `aria-sort` and the keyboard path, so a custom header cannot accidentally ship a `<div>`
   * that only responds to a mouse — which is the bug B1 fixed on the default header.
   */
  protected headerContext(column: TableColumn): TableHeaderContext {
    const sort = this.currentSort();
    return {
      $implicit: column,
      sort: sort?.key === column.key ? sort.direction : null,
      toggleSort: () => this.handleSort(column),
    };
  }

  protected emptyContext(): TableEmptyContext {
    return { $implicit: this.computedEmptyMessage(), searchTerm: this.searchTerm() };
  }

  protected rowClasses(row: TableRow): string {
    return this.rowClass()?.(row) ?? '';
  }

  totalColumns = computed(() => this.columns().length + (this.expandable() ? 1 : 0));

  isRowExpandable(row: TableRow): boolean {
    return !!(row.children?.length || this.expandedRowTemplate());
  }

  isRowExpanded(row: TableRow): boolean {
    return this.expandedRowIds().has(row.id);
  }

  toggleRow(row: TableRow): void {
    if (!this.isRowExpandable(row)) return;

    const ids = new Set(this.expandedRowIds());
    const wasExpanded = ids.has(row.id);

    if (this.singleExpand()) {
      ids.clear();
    }

    if (wasExpanded) {
      ids.delete(row.id);
      this.expandedRowIds.set(ids);
      this.rowCollapsed.emit({ id: row.id, row, expanded: false });
    } else {
      ids.add(row.id);
      this.expandedRowIds.set(ids);
      this.rowExpanded.emit({ id: row.id, row, expanded: true });
    }
  }

  expandAll(): void {
    const ids = new Set<string | number>();
    for (const row of this.filteredData()) {
      if (this.isRowExpandable(row)) {
        ids.add(row.id);
      }
    }
    this.expandedRowIds.set(ids);
  }

  collapseAll(): void {
    this.expandedRowIds.set(new Set());
  }
}