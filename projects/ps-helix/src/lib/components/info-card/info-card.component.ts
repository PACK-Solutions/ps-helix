import { PshSurfaceAppearance } from '../../types/semantic.types';
import { pshResolveConfigValue } from '../../utils/config-value';
import { Component, ChangeDetectionStrategy, computed, input, signal, PLATFORM_ID, inject, output, ViewEncapsulation, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';
import { PshViewportService } from '../../a11y/viewport.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { InfoCardData, InfoCardOptions } from './info-card.types';
import { INFO_CARD_CONFIG } from './info-card.tokens';

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
 *   appearance="elevated"
 * ></psh-info-card>
 * ```
 */
@Component({
  selector: 'psh-info-card',
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClasses()',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeydown($event)',
    role: 'region',
    '[attr.tabindex]': 'interactive() && !disabled() ? 0 : null',
    '[attr.aria-label]': 'computedAriaLabel()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
})
export class PshInfoCardComponent implements AfterContentInit, OnDestroy {
  private readonly config = inject(INFO_CARD_CONFIG);


  readonly hasHeaderActions = signal<boolean>(false);

  /** Title displayed in the card header */
  readonly title = input<string>('');

  /** Array of label-value pairs to display */
  readonly data = input.required<InfoCardData[]>();

  /**
   * Display options for the card.
   *
   * `emptyStateMessage` is deliberately absent from the default: carrying it here would
   * shadow the application's configured default, since this object wins over it.
   */
  readonly options = input<InfoCardOptions>({
    showEmptyState: true,
    labelWidth: undefined,
    valueWidth: undefined
  });

  /** Base card variant style */
  readonly appearance = input<PshSurfaceAppearance>(this.config.appearance ?? 'outline');

  /** Icon to display in the header (Phosphor icon name without 'ph-' prefix) */
  readonly icon = input<string>(this.config.icon ?? 'circle-dashed');

  /** Custom ARIA label for accessibility */
  readonly ariaLabel = input<string>();



  /** Whether the card should be interactive/clickable */
  readonly interactive = input<boolean>(this.config.interactive ?? false);

  /** Whether to show hover effects */
  readonly hoverable = input<boolean>(this.config.hoverable ?? false);

  /** Indicates if data is loading */
  readonly loading = input<boolean>(false);

  /** Whether the card is disabled */
  readonly disabled = input<boolean>(false);

  /** Emitted when card is clicked */
  clicked = output<MouseEvent | KeyboardEvent>();

  /** Whether to show copy buttons on rows (opt-in) */
  readonly copyable = input<boolean>(this.config.copyable ?? false);

  /** Label prefix for the copy button aria-label */
  readonly copyButtonLabelInput = input<string | undefined>(undefined, { alias: 'copyButtonLabel' });
  readonly copyButtonLabel = computed(
    () => this.copyButtonLabelInput() ?? pshResolveConfigValue(this.config.copyButtonLabel) ?? 'Copy',
  );

  /** Text shown as feedback after successful copy */
  readonly notProvidedTextInput = input<string | undefined>(undefined, { alias: 'notProvidedText' });
  /** Stands in for a row value that is null or undefined. */
  readonly notProvidedText = computed(
    () =>
      this.notProvidedTextInput() ??
      pshResolveConfigValue(this.config.notProvidedText) ??
      'Not provided',
  );

  readonly copyFeedbackTextInput = input<string | undefined>(undefined, { alias: 'copyFeedbackText' });
  readonly copyFeedbackText = computed(
    () => this.copyFeedbackTextInput() ?? pshResolveConfigValue(this.config.copyFeedbackText) ?? 'Copied',
  );

  /** Emitted when a row value is successfully copied */
  copied = output<InfoCardData>();

  /** Emitted when a copy attempt fails */
  copyFailed = output<InfoCardData>();

  /** Tracks the row index currently showing success feedback */
  readonly copiedRowIndex = signal<number | null>(null);

  /** Whether to auto-enable full width buttons on mobile (default: true) */
  readonly autoFullWidthOnMobile = input<boolean>(this.config.autoFullWidthOnMobile ?? true);

  /** Signal to track if viewport is mobile */

  private platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private feedbackTimeout?: ReturnType<typeof setTimeout>;

  /** Determines if the empty state should be shown */
  readonly shouldShowEmptyState = computed(() => {
    const opts = this.options();
    const dataArray = this.data();
    return opts.showEmptyState && (!dataArray || dataArray.length === 0);
  });

  /**
   * The message shown when there is nothing to list.
   *
   * Three sources, narrowest first: the `options` input of this card, then the application's
   * configured default, then the library's own.
   */
  readonly getEmptyStateMessage = computed(
    () =>
      this.options().emptyStateMessage ||
      pshResolveConfigValue(this.config.emptyStateMessage) ||
      'No information available',
  );

  /** Full icon class name for Phosphor icons */
  readonly titleIcon = computed(() => {
    const iconName = this.icon();
    return iconName ? `ph-${iconName}` : '';
  });

  /** Computed ARIA label for the component */
  readonly computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    const titleText = this.title();
    return customLabel || (titleText ? `Information card: ${titleText}` : 'Information card');
  });

  /** Computed CSS classes */
  readonly computedClasses = computed(() => {
    const classes = ['psh-info-card'];
    classes.push(`psh-appearance-${this.appearance()}`);

    if (this.hoverable()) classes.push('psh-hoverable');
    if (this.interactive()) classes.push('psh-interactive');
    if (this.loading()) classes.push('psh-loading');
    if (this.disabled()) classes.push('psh-disabled');

    return classes.join(' ');
  });


  /** Gets CSS classes for card-actions based on mobile state */
  readonly getActionsClasses = computed(() => {
    const classes: string[] = [];
    if (this.autoFullWidthOnMobile() && this.isMobile()) {
      classes.push('psh-mobile-full-width-buttons');
    }
    return classes.join(' ');
  });

  private elementRef = inject(ElementRef);

  /** Shared with every other card on the page. See `PshViewportService`. */
  readonly isMobile = inject(PshViewportService).below('sm');

  ngAfterContentInit(): void {
    this.checkHeaderActionsContent();
  }

  private checkHeaderActionsContent(): void {
    if (isPlatformBrowser(this.platformId)) {
      const headerActionsEl = this.elementRef.nativeElement.querySelector('[psh-info-card-header-actions]');
      this.hasHeaderActions.set(!!headerActionsEl);
    }
  }

  ngOnDestroy(): void {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
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

  isRowCopyable(item: InfoCardData): boolean {
    return item.copyable ?? this.copyable();
  }

  hasNonEmptyValue(item: InfoCardData): boolean {
    const val = item.value;
    if (val == null) return false;
    return val.toString().trim().length > 0;
  }

  /**
   * Calcule les classes CSS de la valeur d'une ligne à partir de son emphasis.
   * Fonction pure (compatible OnPush) : aucun effet de bord.
   * Un emphasis explicite prime sur l'auto-muted des valeurs nullish.
   */
  getValueClasses(item: InfoCardData): string {
    const classes = ['psh-info-card-value'];
    const emphasis = item.emphasis;
    const isEmpty = item.value == null;
    const autoMuted = isEmpty && this.options().mutedEmptyValues !== false && !emphasis;

    if (autoMuted) {
      classes.push('psh-info-card-value--italic', 'psh-info-card-value--color-neutral');
    } else if (emphasis) {
      if (emphasis.italic) classes.push('psh-info-card-value--italic');
      if (emphasis.bold) classes.push('psh-info-card-value--bold');
      if (emphasis.strikethrough) classes.push('psh-info-card-value--strikethrough');
      if (emphasis.color) classes.push(`psh-info-card-value--color-${emphasis.color}`);
    }

    return classes.join(' ');
  }

  copyRowValue(item: InfoCardData, index: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.copyFailed.emit(item);
      return;
    }

    const view = this.document.defaultView;
    if (!view?.isSecureContext || !view.navigator.clipboard) {
      this.copyFailed.emit(item);
      return;
    }

    const text = item.copyValue ?? item.value?.toString() ?? '';

    view.navigator.clipboard.writeText(text).then(
      () => {
        if (this.feedbackTimeout) {
          clearTimeout(this.feedbackTimeout);
        }
        this.copiedRowIndex.set(index);
        this.copied.emit(item);
        this.feedbackTimeout = setTimeout(() => {
          this.copiedRowIndex.set(null);
        }, 1800);
      },
      () => {
        this.copyFailed.emit(item);
      }
    );
  }
}