import { Component, computed, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PshPaginationComponent, PAGINATION_CONFIG } from '@lib/components/pagination/pagination.component';
import { PshSpinLoaderComponent } from '@lib/components/spinloader/spinloader.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
}

type SupportedLanguage = 'fr' | 'en' | 'es' | 'de';

interface NavigationError {
  action: string;
  reason: string;
  timestamp: Date;
}

@Component({
  selector: 'ds-pagination-demo',
  imports: [
    CommonModule,
    TranslateModule,
    PshPaginationComponent,
    PshSpinLoaderComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent
  ],
  providers: [
    {
      provide: PAGINATION_CONFIG,
      useValue: {
        size: 'medium',
        variant: 'default',
        showFirstLast: true,
        showPrevNext: true,
        maxVisiblePages: 5,
        showItemsPerPage: false,
        itemsPerPageOptions: [5, 10, 25, 50]
      }
    }
  ],
  templateUrl: './pagination-demo.component.html',
  styleUrls: ['./pagination-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  readonly allUsers: User[] = this.generateUsers(100);

  readonly tableCurrentPage = signal(1);
  readonly tableItemsPerPage = signal(10);
  readonly tableTotalItems = signal(this.allUsers.length);

  readonly tableTotalPages = computed(() =>
    Math.ceil(this.tableTotalItems() / this.tableItemsPerPage())
  );

  readonly paginatedUsers = computed(() => {
    const start = (this.tableCurrentPage() - 1) * this.tableItemsPerPage();
    const end = start + this.tableItemsPerPage();
    return this.allUsers.slice(start, end);
  });

  readonly displayedRange = computed(() => {
    const start = (this.tableCurrentPage() - 1) * this.tableItemsPerPage() + 1;
    const end = Math.min(this.tableCurrentPage() * this.tableItemsPerPage(), this.tableTotalItems());
    return { start, end, total: this.tableTotalItems() };
  });

  readonly programmaticPagination = viewChild<PshPaginationComponent>('programmaticPagination');
  readonly programmaticCurrentPage = signal(1);
  readonly programmaticTotalPages = signal(10);
  readonly goToPageInput = signal(1);

  readonly errorDemoPagination = viewChild<PshPaginationComponent>('errorDemoPagination');
  readonly navigationErrors = signal<NavigationError[]>([]);
  readonly errorDemoCurrentPage = signal(1);
  readonly errorDemoTotalPages = signal(5);
  readonly errorTestPageInput = signal(0);

  readonly currentLanguage = signal<SupportedLanguage>('fr');
  readonly languages: { code: SupportedLanguage; name: string; flag: string }[] = [
    { code: 'fr', name: 'Français', flag: 'FR' },
    { code: 'en', name: 'English', flag: 'EN' },
    { code: 'es', name: 'Español', flag: 'ES' },
    { code: 'de', name: 'Deutsch', flag: 'DE' }
  ];

  readonly translations: Record<SupportedLanguage, typeof this.labels> = {
    fr: {
      first: 'Premier',
      previous: 'Précédent',
      next: 'Suivant',
      last: 'Dernier',
      page: 'Page',
      items: 'éléments',
      itemsPerPage: 'Éléments par page'
    },
    en: {
      first: 'First',
      previous: 'Previous',
      next: 'Next',
      last: 'Last',
      page: 'Page',
      items: 'items',
      itemsPerPage: 'Items per page'
    },
    es: {
      first: 'Primero',
      previous: 'Anterior',
      next: 'Siguiente',
      last: 'Último',
      page: 'Página',
      items: 'elementos',
      itemsPerPage: 'Elementos por página'
    },
    de: {
      first: 'Erste',
      previous: 'Zurück',
      next: 'Weiter',
      last: 'Letzte',
      page: 'Seite',
      items: 'Elemente',
      itemsPerPage: 'Elemente pro Seite'
    }
  };

  readonly currentLabels = computed(() => this.translations[this.currentLanguage()]);
  readonly i18nCurrentPage = signal(1);
  readonly i18nTotalPages = signal(10);

  readonly computedCurrentPage = signal(1);
  readonly computedTotalPages = signal(25);
  readonly computedItemsPerPage = signal(10);
  readonly computedTotalItems = signal(245);

  readonly progressPercentage = computed(() => {
    const current = this.computedCurrentPage();
    const total = this.computedTotalPages();
    return Math.round((current / total) * 100);
  });

  readonly itemsDisplayed = computed(() => {
    const start = (this.computedCurrentPage() - 1) * this.computedItemsPerPage() + 1;
    const end = Math.min(this.computedCurrentPage() * this.computedItemsPerPage(), this.computedTotalItems());
    return { start, end };
  });

  readonly remainingItems = computed(() => {
    const displayed = this.computedCurrentPage() * this.computedItemsPerPage();
    return Math.max(0, this.computedTotalItems() - displayed);
  });

  readonly remainingPages = computed(() => {
    return this.computedTotalPages() - this.computedCurrentPage();
  });

  readonly isLoading = signal(false);
  readonly simulatedUsers = signal<User[]>([]);
  readonly simulatedCurrentPage = signal(1);
  readonly simulatedTotalPages = signal(10);
  readonly simulatedItemsPerPage = signal(10);

  private generateUsers(count: number): User[] {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eva', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'];
    const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
    const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer'];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending'];

    return Array.from({ length: count }, (_, i): User => ({
      id: i + 1,
      name: `${firstNames[i % firstNames.length]!} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]!}`,
      email: `user${i + 1}@example.com`,
      role: roles[i % roles.length]!,
      status: statuses[i % statuses.length]!,
      department: departments[i % departments.length]!
    }));
  }

  handlePageChange(context: string, page: number): void {
    console.log(`[${context}] Page changed to:`, page);
  }

  handleTablePageChange(page: number): void {
    this.tableCurrentPage.set(page);
  }

  handleTableItemsPerPageChange(items: number): void {
    this.tableItemsPerPage.set(items);
    this.tableCurrentPage.set(1);
  }

  goToFirst(): void {
    this.programmaticPagination()?.goToFirstPage();
  }

  goToLast(): void {
    this.programmaticPagination()?.goToLastPage();
  }

  goToNext(): void {
    this.programmaticPagination()?.goToNextPage();
  }

  goToPrevious(): void {
    this.programmaticPagination()?.goToPreviousPage();
  }

  goToSpecificPage(): void {
    this.programmaticPagination()?.goToPage(this.goToPageInput());
  }

  updateGoToPageInput(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value)) {
      this.goToPageInput.set(value);
    }
  }

  handleNavigationError(error: { action: string; reason: string }): void {
    this.navigationErrors.update(errors => [
      { ...error, timestamp: new Date() },
      ...errors.slice(0, 4)
    ]);
  }

  updateErrorTestInput(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.errorTestPageInput.set(isNaN(value) ? 0 : value);
  }

  triggerNavigationError(): void {
    const pag = this.errorDemoPagination();
    if (pag) {
      pag.goToPage(this.errorTestPageInput());
    }
  }

  clearErrors(): void {
    this.navigationErrors.set([]);
  }

  setLanguage(lang: SupportedLanguage): void {
    this.currentLanguage.set(lang);
  }

  async loadSimulatedData(): Promise<void> {
    this.isLoading.set(true);
    this.simulatedUsers.set([]);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const start = (this.simulatedCurrentPage() - 1) * this.simulatedItemsPerPage();
    const end = start + this.simulatedItemsPerPage();
    this.simulatedUsers.set(this.allUsers.slice(start, end));
    this.isLoading.set(false);
  }

  handleSimulatedPageChange(page: number): void {
    this.simulatedCurrentPage.set(page);
    this.loadSimulatedData();
  }

  handleItemsPerPageChange(items: number): void {
    console.log('Items per page changed to:', items);
    this.itemsPerPageCurrent = 1;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      active: 'status-active',
      inactive: 'status-inactive',
      pending: 'status-pending'
    };
    return classes[status] || '';
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

  paginatedTableCode = `// Component
readonly allUsers: User[] = this.generateUsers(100);
readonly currentPage = signal(1);
readonly itemsPerPage = signal(10);
readonly totalItems = signal(this.allUsers.length);

readonly totalPages = computed(() =>
  Math.ceil(this.totalItems() / this.itemsPerPage())
);

readonly paginatedUsers = computed(() => {
  const start = (this.currentPage() - 1) * this.itemsPerPage();
  const end = start + this.itemsPerPage();
  return this.allUsers.slice(start, end);
});

// Template
<table>
  @for (user of paginatedUsers(); track user.id) {
    <tr>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  }
</table>

<psh-pagination
  [(currentPage)]="currentPage"
  [totalPages]="totalPages()"
  [(itemsPerPage)]="itemsPerPage"
  [showItemsPerPage]="true"
></psh-pagination>`;

  viewChildCode = `// Component
readonly pagination = viewChild<PshPaginationComponent>('myPagination');

goToFirst(): void {
  this.pagination()?.goToFirstPage();
}

goToLast(): void {
  this.pagination()?.goToLastPage();
}

goToNext(): void {
  this.pagination()?.goToNextPage();
}

goToPrevious(): void {
  this.pagination()?.goToPreviousPage();
}

goToSpecificPage(page: number): void {
  this.pagination()?.goToPage(page);
}

// Template
<psh-pagination #myPagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
></psh-pagination>

<button (click)="goToFirst()">Première</button>
<button (click)="goToPrevious()">Précédente</button>
<button (click)="goToNext()">Suivante</button>
<button (click)="goToLast()">Dernière</button>`;

  errorHandlingCode = `// Component
readonly errors = signal<NavigationError[]>([]);

handleNavigationError(error: { action: string; reason: string }): void {
  this.errors.update(list => [
    { ...error, timestamp: new Date() },
    ...list.slice(0, 4)
  ]);
}

// Template
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  (navigationError)="handleNavigationError($event)"
></psh-pagination>

@if (errors().length > 0) {
  <div class="error-list">
    @for (error of errors(); track error.timestamp) {
      <div class="error-item">
        <strong>{{ error.action }}</strong>: {{ error.reason }}
      </div>
    }
  </div>
}`;

  i18nCode = `// Component
readonly currentLanguage = signal<'fr' | 'en' | 'es' | 'de'>('fr');

readonly translations = {
  fr: { first: 'Premier', previous: 'Précédent', next: 'Suivant', last: 'Dernier' },
  en: { first: 'First', previous: 'Previous', next: 'Next', last: 'Last' },
  es: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Último' },
  de: { first: 'Erste', previous: 'Zurück', next: 'Weiter', last: 'Letzte' }
};

readonly labels = computed(() => this.translations[this.currentLanguage()]);

// Template
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [firstLabel]="labels().first"
  [previousLabel]="labels().previous"
  [nextLabel]="labels().next"
  [lastLabel]="labels().last"
></psh-pagination>`;

  computedStatsCode = `// Component
readonly currentPage = signal(1);
readonly totalPages = signal(25);
readonly itemsPerPage = signal(10);
readonly totalItems = signal(245);

readonly progressPercentage = computed(() => {
  return Math.round((this.currentPage() / this.totalPages()) * 100);
});

readonly itemsDisplayed = computed(() => {
  const start = (this.currentPage() - 1) * this.itemsPerPage() + 1;
  const end = Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems());
  return { start, end };
});

readonly remainingItems = computed(() => {
  const displayed = this.currentPage() * this.itemsPerPage();
  return Math.max(0, this.totalItems() - displayed);
});

// Template
<div class="stats">
  <span>{{ itemsDisplayed().start }}-{{ itemsDisplayed().end }} sur {{ totalItems() }}</span>
  <span>Progression: {{ progressPercentage() }}%</span>
  <span>Restant: {{ remainingItems() }} éléments</span>
</div>`;

  backendSimulationCode = `// Component
readonly isLoading = signal(false);
readonly users = signal<User[]>([]);

async loadData(): Promise<void> {
  this.isLoading.set(true);

  // Simuler un appel API
  const response = await fetch(\`/api/users?page=\${this.currentPage()}\`);
  const data = await response.json();

  this.users.set(data.users);
  this.isLoading.set(false);
}

handlePageChange(page: number): void {
  this.currentPage.set(page);
  this.loadData();
}

// Template
@if (isLoading()) {
  <psh-spinloader size="medium" />
} @else {
  <table>
    @for (user of users(); track user.id) {
      <tr><td>{{ user.name }}</td></tr>
    }
  </table>
}

<psh-pagination
  [(currentPage)]="currentPage"
  [totalPages]="totalPages()"
  (pageChange)="handlePageChange($event)"
></psh-pagination>`;

  globalConfigCode = `// app.config.ts ou module
import { PAGINATION_CONFIG } from 'ps-helix';

export const appConfig = {
  providers: [
    {
      provide: PAGINATION_CONFIG,
      useValue: {
        size: 'medium',
        variant: 'outline',
        showFirstLast: true,
        showPrevNext: true,
        maxVisiblePages: 7,
        showItemsPerPage: true,
        itemsPerPageOptions: [10, 25, 50, 100]
      }
    }
  ]
};

// Toutes les paginations utiliseront cette config par défaut
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
></psh-pagination>`;
}
