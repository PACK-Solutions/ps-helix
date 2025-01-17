import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableColumn, TableRow, TableSort, TableFilter } from './table.types';

@Component({
  selector: 'lib-table',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() set data(value: TableRow[]) {
    this._originalData = [...value];
    this._data = [...value];
    this.applyFiltersAndSort();
  }
  get data(): TableRow[] {
    return this._data;
  }

  @Input() striped = false;
  @Input() hoverable = false;
  @Input() bordered = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'default' | 'outline' = 'default';
  @Input() loading = false;
  @Input() emptyMessage = 'TABLE.NO_DATA';
  @Input() sortable = false;
  @Input() globalSearch = false;
  @Input() globalSearchPlaceholder = 'TABLE.GLOBAL_SEARCH';

  @Output() sortChange = new EventEmitter<TableSort>();
  @Output() globalSearchChange = new EventEmitter<string>();

  private _originalData: TableRow[] = [];
  private _data: TableRow[] = [];
  currentSort?: TableSort;
  globalSearchValue = '';

  handleGlobalSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.globalSearchValue = value;
    this.globalSearchChange.emit(value);
    this.applyFiltersAndSort();
  }

  handleSort(column: TableColumn): void {
    if (!column.sortable) return;

    const direction = !this.currentSort || this.currentSort.key !== column.key
      ? 'asc'
      : this.currentSort.direction === 'asc'
        ? 'desc'
        : 'asc';

    this.currentSort = { key: column.key, direction };
    this.sortChange.emit(this.currentSort);
    this.applyFiltersAndSort();
  }

  getSortClass(column: TableColumn): string {
    if (!this.currentSort || this.currentSort.key !== column.key) {
      return '';
    }
    return this.currentSort.direction === 'asc' ? 'asc' : 'desc';
  }

  private applyFiltersAndSort(): void {
    let filteredData = [...this._originalData];

    // Apply global search
    if (this.globalSearchValue) {
      const searchTerm = this.globalSearchValue.toLowerCase();
      filteredData = filteredData.filter(row => 
        Object.values(row).some(value => 
          value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply sorting
    if (this.currentSort) {
      filteredData.sort((a, b) => {
        const aValue = a[this.currentSort!.key];
        const bValue = b[this.currentSort!.key];
        
        if (this.currentSort!.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    this._data = filteredData;
  }
}