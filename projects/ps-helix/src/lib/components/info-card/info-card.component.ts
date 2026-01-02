import { Component, ChangeDetectionStrategy, computed, input, signal, PLATFORM_ID, inject, output, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { InfoCardData, InfoCardOptions, InfoCardVariant } from './info-card.types';

/**
 * Info Card Component - Autonomous
 *
 * A fully independent card component that displays structured data as label/value pairs.
 * Provides a consistent way to present information with proper accessibility and responsive design.
 *
 * @example
 * ```typescript
 * const userData: InfoCardData[] = [
 *   { label: 'Name', value: 'John Doe' },
 *   { label: 'Email', value: 'john@example.com' }
 * ];
 * ```
 *
 * ```html
 * <psh-info-card
 *   title="User Information"
 *   [data]="userData"
 *   icon="user"
 *   variant="elevated"
 * ></psh-info-card>
 * ```
 */
@Component({
  selector: 'psh-info-card',
  imports: [CommonModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PshInfoCardComponent {

  /** Title displayed in the card header */
  title = input<string>('');

  /** Array of label-value pairs to display */
  data = input<InfoCardData[]>([]);

  /** Display options for the card */
  options = input<InfoCardOptions>({
    showEmptyState: true,
    emptyStateMessage: 'Aucune information disponible',
    labelWidth: undefined,
    valueWidth: undefined
  });

  /** Base card variant style */
  variant = input<InfoCardVariant>('outlined');

  /** Icon to display in the header (Phosphor icon name without 'ph-' prefix) */
  icon = input<string>('circle-dashed');

  /** Custom ARIA label for accessibility */
  ariaLabel = input<string>();

  /** Custom CSS classes */
  cssClass = input<string>('');

  /** Custom inline styles */
  customStyle = input<Record<string, string>>({});

  /** Whether the card should be interactive/clickable */
  interactive = input<boolean>(false);

  /** Whether to show hover effects */
  hoverable = input<boolean>(false);

  /** Indicates if data is loading */
  loading = input<boolean>(false);

  /** Whether the card is disabled */
  disabled = input<boolean>(false);

  /** Emitted when card is clicked */
  clicked = output<MouseEvent | KeyboardEvent>();

  /** Whether to auto-enable full width buttons on mobile (default: true) */
  autoFullWidthOnMobile = input<boolean>(true);

  /** Signal to track if viewport is mobile */
  isMobile = signal<boolean>(false);

  private platformId = inject(PLATFORM_ID);
  private resizeObserver?: ResizeObserver;

  /** Determines if the empty state should be shown */
  shouldShowEmptyState = computed(() => {
    const opts = this.options();
    const dataArray = this.data();
    return opts.showEmptyState && (!dataArray || dataArray.length === 0);
  });

  /** Returns the empty state message to display */
  getEmptyStateMessage = computed(() => {
    return this.options().emptyStateMessage || 'Aucune information disponible';
  });

  /** Full icon class name for Phosphor icons */
  titleIcon = computed(() => {
    const iconName = this.icon();
    return iconName ? `ph-${iconName}` : '';
  });

  /** Computed ARIA label for the component */
  computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    const titleText = this.title();
    return customLabel || (titleText ? `Information card: ${titleText}` : 'Information card');
  });

  /** Computed CSS classes */
  computedClasses = computed(() => {
    const classes = ['info-card'];
    classes.push(`variant-${this.variant()}`);

    if (this.hoverable()) classes.push('hoverable');
    if (this.interactive()) classes.push('interactive');
    if (this.loading()) classes.push('loading');
    if (this.disabled()) classes.push('disabled');
    if (this.cssClass()) classes.push(this.cssClass());

    return classes.join(' ');
  });

  /** Computed styles */
  computedStyles = computed(() => {
    return { ...this.customStyle() };
  });

  /** Gets CSS classes for card-actions based on mobile state */
  getActionsClasses = computed(() => {
    const classes: string[] = [];
    if (this.autoFullWidthOnMobile() && this.isMobile()) {
      classes.push('mobile-full-width-buttons');
    }
    return classes.join(' ');
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileViewport();

      if (typeof window !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          this.checkMobileViewport();
        });
        this.resizeObserver.observe(document.documentElement);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private checkMobileViewport(): void {
    if (typeof window !== 'undefined') {
      this.isMobile.set(window.innerWidth <= 640);
    }
  }

  /**
   * Handles click events on the card
   */
  handleClick(event: MouseEvent): void {
    if (this.interactive() && !this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }

  /**
   * Handles keyboard navigation
   */
  handleKeydown(event: KeyboardEvent): void {
    if (this.interactive() && !this.disabled() && !this.loading()) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.clicked.emit(event);
      }
    }
  }
}