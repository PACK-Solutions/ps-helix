import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  model,
  output,
  linkedSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationSize, PaginationVariant, PaginationConfig } from './pagination.types';
import { InjectionToken } from '@angular/core';

export const PAGINATION_CONFIG = new InjectionToken<Partial<PaginationConfig>>(
  'PAGINATION_CONFIG',
  {
    factory: () => ({
      size: 'medium',
      variant: 'default',
      showFirstLast: true,
      showPrevNext: true,
      maxVisiblePages: 5,
      showItemsPerPage: false,
      itemsPerPageOptions: [5, 10, 25, 50],
    }),
  },
);

@Component({
  selector: 'psh-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshPaginationComponent {
  private config = inject(PAGINATION_CONFIG);
  private static idCounter = 0;
  private readonly uniqueId = `pagination-${++PshPaginationComponent.idCounter}`;

  currentPage = model(1);
  totalPages = model(1);
  itemsPerPageInput = input(10, { alias: 'itemsPerPage' });
  itemsPerPage = linkedSignal(this.itemsPerPageInput);

  /**
   * Number of pages used for rendering and navigation: never below 1, and never
   * written back to the `totalPages` input. `totalPages` is derived data owned by
   * the caller (`Math.ceil(total / pageSize)`, or a server-side page count), so the
   * component reads it and clamps its own view of it instead of correcting it.
   */
  private readonly effectiveTotalPages = computed(() => {
    const total = this.totalPages();
    return Number.isInteger(total) && total >= 1 ? total : 1;
  });

  constructor() {
    if (isDevMode()) {
      effect(() => {
        // `0` is a legitimate state (empty list, or a server-side page count that is
        // not loaded yet): stay silent. Only report what betrays a caller bug.
        const total = this.totalPages();
        if (total !== 0 && (!Number.isInteger(total) || total < 1)) {
          console.warn(`[psh-pagination] Invalid totalPages "${total}", using 1 page`);
        }
      });

      effect(() => {
        const maxVisible = this.maxVisiblePages();
        if (maxVisible < 1 || !Number.isFinite(maxVisible)) {
          console.warn(`[psh-pagination] Invalid maxVisiblePages "${maxVisible}", must be >= 1`);
        }
      });
    }

    // `currentPage` IS owned by the component (it navigates), so correcting it with
    // a write-back is the intended behaviour — clamped on the derived page count.
    effect(() => {
      const current = this.currentPage();
      const total = this.effectiveTotalPages();
      if (current < 1 || !Number.isFinite(current)) {
        if (isDevMode()) {
          console.warn(`[psh-pagination] Invalid currentPage "${current}", setting to 1`);
        }
        this.currentPage.set(1);
      } else if (current > total) {
        if (isDevMode()) {
          console.warn(
            `[psh-pagination] currentPage "${current}" exceeds totalPages "${total}", setting to ${total}`,
          );
        }
        this.currentPage.set(total);
      }
    });
  }

  readonly size = input(this.config.size ?? ('medium' as PaginationSize), {
    transform: (value: PaginationSize): PaginationSize => {
      if (!['small', 'medium', 'large'].includes(value)) {
        if (isDevMode()) {
          console.warn(`[psh-pagination] Invalid size "${value}", falling back to "medium"`);
        }
        return 'medium';
      }
      return value;
    },
  });
  readonly variant = input(this.config.variant ?? ('default' as PaginationVariant), {
    transform: (value: PaginationVariant): PaginationVariant => {
      if (!['default', 'outline'].includes(value)) {
        if (isDevMode()) {
          console.warn(`[psh-pagination] Invalid variant "${value}", falling back to "default"`);
        }
        return 'default';
      }
      return value;
    },
  });
  readonly showFirstLast = input(this.config.showFirstLast ?? true);
  readonly showPrevNext = input(this.config.showPrevNext ?? true);
  readonly maxVisiblePages = input(this.config.maxVisiblePages ?? 5);
  readonly showItemsPerPage = input(this.config.showItemsPerPage ?? false);
  readonly itemsPerPageOptions = input<number[]>([5, 10, 25, 50]);
  readonly firstLabel = input('First');
  readonly previousLabel = input('Previous');
  readonly nextLabel = input('Next');
  readonly lastLabel = input('Last');
  readonly pageLabel = input('Page');
  readonly itemsLabel = input('items');
  readonly itemsPerPageLabel = input('Items per page');
  readonly id = input<string>();
  readonly ariaLabel = input<string>('Pagination navigation');

  pageChange = output<number>();
  itemsPerPageChange = output<number>();
  navigationError = output<{ action: string; reason: string }>();

  protected readonly navigationId = computed(() => {
    const customId = this.id();
    return customId || this.uniqueId;
  });

  protected readonly pages = computed(() => {
    const pages: number[] = [];
    const halfVisible = Math.floor(this.maxVisiblePages() / 2);
    let start = Math.max(1, this.currentPage() - halfVisible);
    const end = Math.min(this.effectiveTotalPages(), start + this.maxVisiblePages() - 1);

    if (end - start + 1 < this.maxVisiblePages()) {
      start = Math.max(1, end - this.maxVisiblePages() + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  protected readonly state = computed(() => this.getState());

  protected readonly canGoNext = computed(() => this.currentPage() < this.effectiveTotalPages());
  protected readonly canGoPrevious = computed(() => this.currentPage() > 1);
  protected readonly isFirstPage = computed(() => this.currentPage() === 1);
  protected readonly isLastPage = computed(
    () => this.currentPage() === this.effectiveTotalPages(),
  );

  protected readonly currentPageAnnouncement = computed(() => {
    return `Page ${this.currentPage()} sur ${this.effectiveTotalPages()}`;
  });

  private getState(): string {
    if (this.currentPage() === 1) return 'first';
    if (this.currentPage() === this.effectiveTotalPages()) return 'last';
    return 'default';
  }

  goToPage(page: number): void {
    const total = this.effectiveTotalPages();
    if (page !== this.currentPage() && page >= 1 && page <= total) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    } else if (page < 1 || page > total) {
      this.navigationError.emit({
        action: 'goToPage',
        reason: `Page ${page} is out of bounds (1-${total})`,
      });
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.effectiveTotalPages());
  }

  goToNextPage(): void {
    if (this.canGoNext()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.canGoPrevious()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  onItemsPerPageChange(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value);
    this.itemsPerPage.set(value);
    this.itemsPerPageChange.emit(value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.goToPreviousPage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.goToNextPage();
        break;
      case 'Home':
        event.preventDefault();
        this.goToFirstPage();
        break;
      case 'End':
        event.preventDefault();
        this.goToLastPage();
        break;
    }
  }
}
