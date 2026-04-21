import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshPaginationComponent } from '@lib/components/pagination/pagination.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-pagination-demo',
  imports: [TranslateModule, PshPaginationComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './pagination-demo.component.html',
  styleUrls: ['./pagination-demo.component.css']
})
export class PaginationDemoComponent {
  labels = {
    first: 'Premier',
    previous: 'Précédent',
    next: 'Suivant',
    last: 'Dernier',
    page: 'Page',
    items: 'éléments',
    itemsPerPage: 'Éléments par page'
  };

  defaultCurrentPage = 1;
  defaultTotalPages = 10;

  outlineCurrentPage = 1;
  outlineTotalPages = 10;

  smallCurrentPage = 1;
  mediumCurrentPage = 1;
  largeCurrentPage = 1;
  sizesTotalPages = 10;

  itemsPerPageCurrent = 1;
  itemsPerPageTotal = 20;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 25, 50];

  customNavCurrent = 1;
  customNavTotal = 15;

  keyboardCurrent = 1;
  keyboardTotal = 10;

  accessibilityCurrent = 1;
  accessibilityTotal = 10;

  handlePageChange(context: string, page: number): void {
    console.log(`[${context}] Page changed to:`, page);
  }

  defaultVariantCode = `<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  variant="default"
></psh-pagination>`;

  outlineVariantCode = `<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  variant="outline"
></psh-pagination>`;

  smallSizeCode = `<psh-pagination
  size="small"
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
></psh-pagination>`;

  mediumSizeCode = `<psh-pagination
  size="medium"
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
></psh-pagination>`;

  largeSizeCode = `<psh-pagination
  size="large"
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
></psh-pagination>`;

  itemsPerPageCode = `<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [(itemsPerPage)]="itemsPerPage"
  [showItemsPerPage]="true"
  [itemsPerPageOptions]="[10, 25, 50]"
  (itemsPerPageChange)="onItemsChange($event)"
></psh-pagination>`;

  customNavigationCode = `<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [showFirstLast]="false"
  [maxVisiblePages]="3"
></psh-pagination>`;

  keyboardNavigationCode = `<!-- La navigation au clavier est automatique -->
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  ariaLabel="Navigation des résultats"
></psh-pagination>`;

  handleItemsPerPageChange(items: number): void {
    console.log('Items per page changed to:', items);
    this.itemsPerPageCurrent = 1;
  }
}
