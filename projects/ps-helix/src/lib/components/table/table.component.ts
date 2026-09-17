import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, InjectionToken, TemplateRef } from '@angular/core';
import { PshLiveAnnouncerService } from '../../a11y/live-announcer.service';
import { pshResolveConfigValue } from '../../utils/config-value';
import { NgTemplateOutlet } from '@angular/common';
import { PshInputComponent } from '../input/input.component';
import { TableColumn, TableRow, TableSort, TableConfig, TableRowClickEvent, TableRowExpandEvent, TableExpandedRowContext, TableHeaderContext, TableEmptyContext } from './table.types';

const TABLE_DEFAULTS = {
  appearance: 'flat',
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
  singleExpand: false,
  expandColumnLabel: 'Expand',
  expandRowLabel: 'Expand row',
  collapseRowLabel: 'Collapse row',
  sortedAscendingLabel: 'sorted ascending',
  sortedDescendingLabel: 'sorted descending',
  resultsFoundLabel: 'results found',
} satisfies Partial<TableConfig>;

export const TABLE_CONFIG = new InjectionToken<Partial<TableConfig>>('TABLE_CONFIG', {
  factory: () => TABLE_DEFAULTS,
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
  private readonly announcer = inject(PshLiveAnnouncerService);

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
  emptyMessageInput = input<string | undefined>(undefined, { alias: 'emptyMessage' });
  emptyMessage = computed(
    () => this.emptyMessageInput() ?? pshResolveConfigValue(this.config.emptyMessage) ?? 'No data available',
  );
  noResultsMessageInput = input<string | undefined>(undefined, { alias: 'noResultsMessage' });
  noResultsMessage = computed(
    () => this.noResultsMessageInput() ?? pshResolveConfigValue(this.config.noResultsMessage) ?? 'No results found',
  );
  globalSearchPlaceholderInput = input<string | undefined>(undefined, { alias: 'globalSearchPlaceholder' });
  globalSearchPlaceholder = computed(
    () => this.globalSearchPlaceholderInput() ?? pshResolveConfigValue(this.config.globalSearchPlaceholder) ?? 'Search in all columns...',
  );
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

  /** Name of the table itself. There was none, so several tables on a page were all "table". */
  readonly ariaLabel = input<string>();
  /** Name of the expand column header, which has no visible text. Was a literal. */
  readonly expandColumnLabelInput = input<string | undefined>(undefined, { alias: 'expandColumnLabel' });
  readonly expandColumnLabel = computed(
    () => this.expandColumnLabelInput() ?? pshResolveConfigValue(this.config.expandColumnLabel) ?? 'Expand',
  );
  /** Name of a row's expand toggle. Was a pair of literals. */
  readonly expandRowLabelInput = input<string | undefined>(undefined, { alias: 'expandRowLabel' });
  readonly expandRowLabel = computed(
    () => this.expandRowLabelInput() ?? pshResolveConfigValue(this.config.expandRowLabel) ?? 'Expand row',
  );
  /** Name of a row's collapse toggle. Was a pair of literals. */
  readonly sortedAscendingLabel = computed(
    () => pshResolveConfigValue(this.config.sortedAscendingLabel) ?? 'sorted ascending',
  );
  readonly sortedDescendingLabel = computed(
    () => pshResolveConfigValue(this.config.sortedDescendingLabel) ?? 'sorted descending',
  );
  readonly resultsFoundLabel = computed(
    () => pshResolveConfigValue(this.config.resultsFoundLabel) ?? 'results found',
  );

  readonly collapseRowLabelInput = input<string | undefined>(undefined, { alias: 'collapseRowLabel' });
  readonly collapseRowLabel = computed(
    () => this.collapseRowLabelInput() ?? pshResolveConfigValue(this.config.collapseRowLabel) ?? 'Collapse row',
  );

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

    // `aria-sort` states the new order for a reader that goes back to the header. Nothing
    // told a user who is not there that the whole body had just been reordered.
    this.announcer.announce(
      `${column.label}: ${direction === 'asc' ? this.sortedAscendingLabel() : this.sortedDescendingLabel()}`,
    );
  }

  onSearchValueChange(value: string): void {
    this.globalSearchChange.emit(value);
    // Filtering replaces the body silently too, and the count is the useful part of it.
    this.announcer.announce(`${this.filteredData().length} ${this.resultsFoundLabel()}`);
  }

  handleRowClick(row: TableRow): void {
    this.rowClicked.emit({ id: row.id, row });
  }

  /**
   * The path of each column, split once instead of once per cell.
   *
   * `getCellValue` runs rows × columns times per change-detection cycle and used to split the
   * path string on every one of them. The split depends on the columns, not on the data.
   */
  private readonly columnPaths = computed(
    () => new Map(this.columns().map(column => [column, (column.path || column.key).split('.')])),
  );

  protected getCellValue(row: TableRow, column: TableColumn): unknown {
    const path = this.columnPaths().get(column) ?? (column.path || column.key).split('.');
    return path.reduce<unknown>(
      (acc, part) =>
        acc != null && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined,
      row,
    );
  }

  /**
   * The context a custom header receives.
   *
   * `toggleSort` is handed over rather than left to the caller: the component keeps owning
   * `aria-sort` and the keyboard path, so a custom header cannot accidentally ship a `<div>`
   * that only responds to a mouse — which is the bug B1 fixed on the default header.
   */
  private readonly headerContexts = computed(() => {
    const sort = this.currentSort();
    return new Map<TableColumn, TableHeaderContext>(
      this.columns().map(column => [
        column,
        {
          $implicit: column,
          sort: sort?.key === column.key ? sort.direction : null,
          toggleSort: () => this.handleSort(column),
        },
      ]),
    );
  });

  /**
   * Built once per render rather than once per cycle. The object used to be new every cycle —
   * and `toggleSort` a new closure with it — so `NgTemplateOutlet` saw a changed context each
   * time and re-rendered every custom header for nothing.
   */
  protected headerContext(column: TableColumn): TableHeaderContext {
    return (
      this.headerContexts().get(column) ?? {
        $implicit: column,
        sort: null,
        toggleSort: () => this.handleSort(column),
      }
    );
  }

  protected readonly emptyContext = computed<TableEmptyContext>(() => ({
    $implicit: this.computedEmptyMessage(),
    searchTerm: this.searchTerm(),
  }));

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