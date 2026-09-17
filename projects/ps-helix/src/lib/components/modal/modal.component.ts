import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  input,
  model,
  OnDestroy,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { pshResolveConfigValue } from '../../utils/config-value';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PshButtonComponent } from '../button/button.component';
import { PshFocusTrapDirective } from '../../a11y/focus-trap.directive';
import { ModalSize, ModalConfig } from './modal.types';
import { PshOverlayService, OverlayHandle } from '../../a11y/overlay.service';
import { PshViewportService } from '../../a11y/viewport.service';
import { pshUniqueId } from '../../utils/unique-id';

/**
 * Injection token for global modal configuration
 *
 * @example
 * ```typescript
 * // In app.config.ts or main.ts
 * providers: [
 *   {
 *     provide: MODAL_CONFIG,
 *     useValue: {
 *       size: 'large',
 *       closeOnBackdrop: false,
 *     }
 *   }
 * ]
 * ```
 */
const MODAL_DEFAULTS = {
  size: 'medium',
  showClose: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  preventScroll: true,
  showFooter: true,
  dismissLabel: 'Close',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel'
} satisfies Partial<ModalConfig>;

export const MODAL_CONFIG = new InjectionToken<Partial<ModalConfig>>('MODAL_CONFIG', {
  factory: () => MODAL_DEFAULTS,
});

/**
 * Service for managing modal instances and global configuration
 *
 * Tracks all active modals and provides centralized configuration.
 * Useful for managing modal stacks and preventing multiple modals from conflicting.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private config = inject(MODAL_CONFIG);
  /**
   * Ordered stack of open modal ids (insertion order = visual stacking order).
   * The last entry is the topmost (most recently opened) modal.
   */
  private readonly modalsSignal = signal<readonly string[]>([]);

  /**
   * Computed signal exposing the number of active modals
   */
  readonly activeModalsCount = computed(() => this.modalsSignal().length);

  /**
   * Computed signal exposing the id of the topmost modal, or null if none are open
   */
  readonly topmostModalId = computed(() => {
    const modals = this.modalsSignal();
    return modals.length > 0 ? modals[modals.length - 1] : null;
  });

  /**
   * Returns the global modal configuration
   */
  getConfig(): Partial<ModalConfig> {
    return this.config;
  }

  /**
   * Generates a unique identifier for a modal instance
   */
  generateId(): string {
    return pshUniqueId('modal');
  }

  /**
   * Registers a modal instance when it opens, pushing it onto the stack
   * @param id - Unique modal identifier
   */
  register(id: string): void {
    this.modalsSignal.update(modals =>
      modals.includes(id) ? modals : [...modals, id]
    );
  }

  /**
   * Unregisters a modal instance when it closes, removing it from the stack
   * @param id - Unique modal identifier
   */
  unregister(id: string): void {
    this.modalsSignal.update(modals => modals.filter(modalId => modalId !== id));
  }

  /**
   * Checks if a modal is currently registered
   * @param id - Unique modal identifier
   */
  isRegistered(id: string): boolean {
    return this.modalsSignal().includes(id);
  }

  /**
   * Checks if a modal is the topmost (most recently opened) open modal.
   * Used to ensure Escape / backdrop only dismiss the modal on top of the stack.
   * @param id - Unique modal identifier
   */
  isTopmost(id: string): boolean {
    return this.topmostModalId() === id;
  }
}

/**
 * A modal dialog component that displays content in an overlay
 *
 * @example
 * ```typescript
 * // Basic usage with two-way binding
 * <psh-modal [(open)]="isOpen" title="My Modal">
 *   <p>Modal content</p>
 * </psh-modal>
 *
 * // With custom footer
 * <psh-modal [(open)]="isOpen" title="Confirm Action">
 *   <p>Are you sure?</p>
 *   <div psh-modal-footer #modalFooter>
 *     <psh-button (clicked)="isOpen = false">Cancel</psh-button>
 *     <psh-button color="primary" (clicked)="handleConfirm()">Confirm</psh-button>
 *   </div>
 * </psh-modal>
 * ```
 */
@Component({
  selector: 'psh-modal',
  imports: [PshButtonComponent, PshFocusTrapDirective],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshModalComponent implements AfterViewInit, OnDestroy {
  private readonly config = inject(MODAL_CONFIG);
  private readonly modalService = inject(ModalService);
  private readonly overlay = inject(PshOverlayService);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  /** Elements this modal marked `inert`, so it only ever undoes its own. */
  private inertedByThisModal: HTMLElement[] = [];
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly modalId = this.modalService.generateId();
  private overlayHandle: OverlayHandle | null = null;
  /** z-index assigned by the overlay stack while open (keeps stacked modals layered). */
  protected readonly zIndex = signal<number | null>(null);
  private modalElement?: ElementRef<HTMLElement>;
  private isAttachedToBody = false;
  /**
   * Read from the shared `matchMedia`, on the same `md` step the stylesheet uses.
   *
   * It was `innerWidth < 768` behind a resize listener per modal — a pixel breakpoint written
   * in TypeScript, which no amount of `verify:breakpoints` could see because that script reads
   * stylesheets. It also did not follow browser zoom: at 150% the stylesheet switched at an
   * effective 1150px while this stayed at 768, so the modal was in its mobile layout while
   * `isMobileScreen()` still said no, and a consumer binding it — the demo does, for full-width
   * footer buttons — got desktop buttons in a mobile dialog.
   */
  private readonly isMobile = inject(PshViewportService).below('md');

  /**
   * Controls the visibility of the modal (two-way binding)
   */
  readonly open = model(false);

  /**
   * Size of the modal dialog
   */
  readonly size = input<ModalSize>(this.config.size ?? 'medium');

  /**
   * Whether to show the close button in the header
   */
  readonly showClose = input(this.config.showClose ?? true);

  /**
   * Whether clicking the backdrop closes the modal
   */
  readonly closeOnBackdrop = input(this.config.closeOnBackdrop ?? true);

  /**
   * Whether pressing Escape closes the modal
   */
  readonly closeOnEscape = input(this.config.closeOnEscape ?? true);

  /**
   * Whether to prevent scrolling of the page when modal is open
   */
  readonly preventScroll = input(this.config.preventScroll ?? true);

  /**
   * Whether to show the default footer with action buttons
   */
  readonly showFooter = input(this.config.showFooter ?? true);

  /**
   * Title displayed in the modal header
   */
  readonly title = input('Modal Title');

  /**
   * Accessible label for the close button
   */
  readonly dismissLabelInput = input<string | undefined>(undefined, { alias: 'dismissLabel' });
  readonly dismissLabel = computed(
    () => this.dismissLabelInput() ?? pshResolveConfigValue(this.config.dismissLabel) ?? 'Close',
  );

  /**
   * Label for the confirm button in the default footer
   */
  readonly confirmLabelInput = input<string | undefined>(undefined, { alias: 'confirmLabel' });
  readonly confirmLabel = computed(
    () => this.confirmLabelInput() ?? pshResolveConfigValue(this.config.confirmLabel) ?? 'Confirm',
  );

  /**
   * Label for the cancel button in the default footer
   */
  readonly cancelLabelInput = input<string | undefined>(undefined, { alias: 'cancelLabel' });
  readonly cancelLabel = computed(
    () => this.cancelLabelInput() ?? pshResolveConfigValue(this.config.cancelLabel) ?? 'Cancel',
  );

  /**
   * Custom CSS class(es) for the modal panel.
   *
   * The only kind of passthrough that survives 7.0.0: the panel is rendered away from the
   * host — a backdrop covering the viewport, positioned by the overlay stack — so a class on
   * `<psh-modal>` cannot reach it. Every component that styles its own host lost its
   * passthrough instead.
   *
   * @example
   * ```html
   * <psh-modal panelClass="my-custom-modal" />
   * ```
   */
  readonly panelClass = input('');

  /**
   * Name of the dialog, for the case where no visible title is rendered.
   *
   * When it is set it **replaces** `aria-labelledby`, because that attribute wins over
   * `aria-label` and would make this input silently do nothing. Setting it is therefore the
   * caller saying "the visible title is absent or unsuitable".
   */
  readonly ariaLabel = input<string>();

  protected readonly labelledBy = computed(() =>
    this.ariaLabel() ? null : `${this.modalDialogId()}-title`,
  );

  /**
   * Custom CSS class(es) to apply to the modal backdrop
   * Useful for stacked modals with different z-index or opacity
   *
   * @example
   * ```html
   * <psh-modal backdropClass="higher-z-index" />
   * ```
   */
  readonly backdropClass = input('');

  /**
   * Emitted when the modal is closed
   */
  closed = output<void>();

  /**
   * Emitted when the confirm button is clicked
   */
  confirmed = output<void>();

  /**
   * Content child for detecting custom footer projection
   */
  private readonly customFooter = contentChild<ElementRef>('modalFooter');

  /**
   * View child reference to the modal backdrop element
   */
  private readonly modalBackdrop = viewChild<ElementRef>('modalBackdrop');

  /**
   * Keyboard event handler for Escape key
   */
  private readonly escapeHandler = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    if (this.closeOnEscape() && this.open() && this.modalService.isTopmost(this.modalId)) {
      this.handleClose();
    }
  };

  /**
   * Computed signal indicating if a custom footer is projected
   */
  readonly hasCustomFooter = computed(() => !!this.customFooter());

  /**
   * Computed signal for the modal state
   */
  readonly state = computed(() => this.open() ? 'open' : 'closed');

  /**
   * Computed signal for the modal dialog ID for accessibility
   */
  readonly modalDialogId = computed(() => `${this.modalId}-dialog`);

  /**
   * Computed signal for the modal description ID for accessibility
   */
  readonly modalDescriptionId = computed(() => `${this.modalId}-description`);

  /**
   * Computed signal indicating if the screen is mobile-sized
   */
  readonly isMobileScreen = this.isMobile;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.onModalOpen();
      } else {
        this.onModalClose();
      }
    });
  }

  ngAfterViewInit(): void {
    this.attachModalToBody();
  }

  /**
   * Handles all setup when modal opens
   */
  private onModalOpen(): void {
    this.modalService.register(this.modalId);
    this.overlayHandle = this.overlay.push();
    this.zIndex.set(this.overlayHandle.zIndex);
    if (!this.isBrowser) return;
    this.setupScrollLock();
    this.setBackgroundInert();
    this.addEventListeners();
    // Initial focus + focus trapping + focus restoration are handled by
    // the [pshFocusTrap] directive on the modal container.
  }

  /**
   * Handles all cleanup when modal closes
   */
  private onModalClose(): void {
    this.modalService.unregister(this.modalId);
    this.releaseOverlay();
    if (!this.isBrowser) return;
    this.removeScrollLock();
    this.releaseBackgroundInert();
    this.removeEventListeners();
  }

  /**
   * Takes the rest of the page out of the accessibility tree while the modal is open.
   *
   * The focus trap holds the *keyboard*, and that was all there was: a screen reader's virtual
   * cursor reads by position, not by focus, so it walked straight through the page behind the
   * modal. `inert` is the one attribute that stops both.
   *
   * It applies to the siblings of the backdrop, which is appended to `document.body` — so the
   * list depends on the page, and the elements it touched are remembered rather than
   * recomputed. An element that was already `inert` is left alone and not recorded: it belongs
   * to whoever set it, most likely a modal underneath this one.
   */
  private setBackgroundInert(): void {
    const backdrop = this.modalBackdrop()?.nativeElement;
    for (const sibling of Array.from(this.document.body.children)) {
      if (sibling === backdrop || sibling.hasAttribute('inert')) continue;
      sibling.setAttribute('inert', '');
      this.inertedByThisModal.push(sibling as HTMLElement);
    }
  }

  private releaseBackgroundInert(): void {
    for (const element of this.inertedByThisModal) element.removeAttribute('inert');
    this.inertedByThisModal = [];
  }

  /** Releases this modal's overlay layer and clears its z-index. */
  private releaseOverlay(): void {
    if (this.overlayHandle) {
      this.overlay.remove(this.overlayHandle.id);
      this.overlayHandle = null;
    }
    this.zIndex.set(null);
  }

  /**
   * Adds keyboard event listeners
   */
  private addEventListeners(): void {
    this.document.addEventListener('keydown', this.escapeHandler);
  }

  /**
   * Removes keyboard event listeners
   */
  private removeEventListeners(): void {
    this.document.removeEventListener('keydown', this.escapeHandler);
  }

  /**
   * Closes the modal and emits the closed event
   */
  handleClose(): void {
    this.open.set(false);
    this.closed.emit();
  }

  /**
   * Emits the confirmed event without closing the modal
   * Allows parent component to handle confirmation logic and close if needed
   */
  handleConfirm(): void {
    this.confirmed.emit();
  }

  /**
   * Handles clicks on the backdrop
   * Closes the modal if closeOnBackdrop is true and click is on backdrop itself
   */
  handleBackdropClick(event: MouseEvent): void {
    if (
      this.closeOnBackdrop() &&
      this.modalService.isTopmost(this.modalId) &&
      event.target === event.currentTarget
    ) {
      this.handleClose();
    }
  }

  /**
   * Prevents page scrolling when modal is open
   * Calculates scrollbar width to prevent layout shift
   */
  private setupScrollLock(): void {
    if (!this.preventScroll() || !this.isBrowser) return;

    const root = this.document.documentElement;
    const view = this.document.defaultView;
    if (view && !root.style.getPropertyValue('--psh-scrollbar-width')) {
      const scrollbarWidth = view.innerWidth - root.clientWidth;
      root.style.setProperty('--psh-scrollbar-width', `${scrollbarWidth}px`);
    }
    this.document.body.classList.add('psh-modal-open');
  }

  /**
   * Removes scroll lock when modal closes
   */
  private removeScrollLock(): void {
    if (!this.preventScroll() || !this.isBrowser) return;
    this.document.body.classList.remove('psh-modal-open');
  }

  /**
   * Attaches the modal element to document.body for proper overlay rendering
   */
  private attachModalToBody(): void {
    const backdrop = this.modalBackdrop();
    if (backdrop && backdrop.nativeElement && !this.isAttachedToBody) {
      this.modalElement = backdrop;
      this.renderer.appendChild(this.document.body, backdrop.nativeElement);
      this.isAttachedToBody = true;
    }
  }

  /**
   * Detaches the modal element from document.body
   */
  private detachModalFromBody(): void {
    if (this.modalElement && this.modalElement.nativeElement && this.isAttachedToBody) {
      this.renderer.removeChild(this.document.body, this.modalElement.nativeElement);
      this.isAttachedToBody = false;
    }
  }

  /**
   * Cleanup on component destruction
   */
  ngOnDestroy(): void {
    this.removeScrollLock();
    this.removeEventListeners();
    this.modalService.unregister(this.modalId);
    this.releaseOverlay();
    this.detachModalFromBody();
  }
}
