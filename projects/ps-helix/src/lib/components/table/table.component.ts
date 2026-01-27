import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, InjectionToken } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TableColumn, TableRow, TableSort, TableConfig, TableRowClickEvent } from './table.types';

export const TABLE_CONFIG = new InjectionToken<Partial<TableConfig>>('TABLE_CONFIG', {
  factory: () => ({
    variant: 'default',
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
    fullWidth: false
  })
});

@Component({
  selector: 'psh-table',
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'psh-table',
    '[class.full-width]': 'fullWidth()'
  }
})
export class PshTableComponent {
  private config = inject(TABLE_CONFIG);

  variant = input<'default' | 'outline'>(this.config.variant ?? 'default');
  size = input<'small' | 'medium' | 'large'>(this.config.size ?? 'medium');
  striped = input(this.config.striped ?? false);
  hoverable = input(this.config.hoverable ?? false);
  bordered = input(this.config.bordered ?? false);
  loading = input(this.config.loading ?? false);
  globalSearch = input(this.config.globalSearch ?? false);
  fullWidth = input(this.config.fullWidth ?? false);
  columns = input<TableColumn[]>([]);
  data = input<TableRow[]>([]);
  emptyMessage = input<string>(this.config.emptyMessage ?? 'No data available');
  noResultsMessage = input<string>(this.config.noResultsMessage ?? 'No results found');
  globalSearchPlaceholder = input(this.config.globalSearchPlaceholder ?? 'Search in all columns...');
  tableLayout = input<'auto' | 'fixed'>(this.config.tableLayout ?? 'auto');
  truncateText = input(this.config.truncateText ?? false);

  sortChange = output<TableSort>();
  globalSearchChange = output<string>();
  rowClick = output<TableRowClickEvent>();

  private currentSortSignal = signal<TableSort | undefined>(undefined);
  private searchTermSignal = signal('');

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
    return 'default';
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
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
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
        return value?.toString().toLowerCase().includes(term);
      });
    });
  }

  /**
   * Récupère la valeur d'un objet imbriqué en utilisant un chemin
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
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

  handleGlobalSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTermSignal.set(value);
    this.globalSearchChange.emit(value);
  }

  handleRowClick(row: TableRow): void {
    this.rowClick.emit({ id: row.id, row });
  }

  /**
   * Récupère la valeur d'une cellule pour affichage
   */
  protected getCellValue(row: TableRow, column: TableColumn): any {
    return this.getNestedValue(row, column.path || column.key);
  }
}