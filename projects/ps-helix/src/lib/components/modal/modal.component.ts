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
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PshButtonComponent } from '../button/button.component';
import { ModalSize, ModalConfig } from './modal.types';

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
export const MODAL_CONFIG = new InjectionToken<Partial<ModalConfig>>('MODAL_CONFIG', {
  factory: () => ({
    size: 'medium',
    showClose: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    preventScroll: true,
    showFooter: true,
    dismissLabel: 'Close',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel'
  })
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
  private modalsSignal = signal<Set<string>>(new Set());

  /**
   * Computed signal exposing the number of active modals
   */
  readonly activeModalsCount = computed(() => this.modalsSignal().size);

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
    return `modal-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Registers a modal instance when it opens
   * @param id - Unique modal identifier
   */
  register(id: string): void {
    this.modalsSignal.update(modals => {
      const newSet = new Set(modals);
      newSet.add(id);
      return newSet;
    });
  }

  /**
   * Unregisters a modal instance when it closes
   * @param id - Unique modal identifier
   */
  unregister(id: string): void {
    this.modalsSignal.update(modals => {
      const newSet = new Set(modals);
      newSet.delete(id);
      return newSet;
    });
  }

  /**
   * Checks if a modal is currently registered
   * @param id - Unique modal identifier
   */
  isRegistered(id: string): boolean {
    return this.modalsSignal().has(id);
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
 *   <div modal-footer #modalFooter>
 *     <psh-button (clicked)="isOpen = false">Cancel</psh-button>
 *     <psh-button variant="primary" (clicked)="handleConfirm()">Confirm</psh-button>
 *   </div>
 * </psh-modal>
 * ```
 */
@Component({
  selector: 'psh-modal',
  imports: [CommonModule, PshButtonComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshModalComponent implements AfterViewInit, OnDestroy {
  private readonly config = inject(MODAL_CONFIG);
  private readonly modalService = inject(ModalService);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly modalId = this.modalService.generateId();
  private previousActiveElement: HTMLElement | null = null;
  private modalElement?: ElementRef<HTMLElement>;
  private isAttachedToBody = false;
  private resizeListener?: () => void;
  private readonly isMobileSignal = signal(false);
  private readonly mobileBreakpoint = 768;

  /**
   * Controls the visibility of the modal (two-way binding)
   */
  open = model(false);

  /**
   * Size of the modal dialog
   */
  size = input<ModalSize>(this.config.size ?? 'medium');

  /**
   * Whether to show the close button in the header
   */
  showClose = input(this.config.showClose ?? true);

  /**
   * Whether clicking the backdrop closes the modal
   */
  closeOnBackdrop = input(this.config.closeOnBackdrop ?? true);

  /**
   * Whether pressing Escape closes the modal
   */
  closeOnEscape = input(this.config.closeOnEscape ?? true);

  /**
   * Whether to prevent scrolling of the page when modal is open
   */
  preventScroll = input(this.config.preventScroll ?? true);

  /**
   * Whether to show the default footer with action buttons
   */
  showFooter = input(this.config.showFooter ?? true);

  /**
   * Title displayed in the modal header
   */
  title = input('Modal Title');

  /**
   * Accessible label for the close button
   */
  dismissLabel = input(this.config.dismissLabel ?? 'Close');

  /**
   * Label for the confirm button in the default footer
   */
  confirmLabel = input(this.config.confirmLabel ?? 'Confirm');

  /**
   * Label for the cancel button in the default footer
   */
  cancelLabel = input(this.config.cancelLabel ?? 'Cancel');

  /**
   * Custom CSS class(es) to apply to the modal container
   * Allows for custom styling without using deep selectors
   *
   * @example
   * ```html
   * <psh-modal styleClass="my-custom-modal" />
   * ```
   */
  styleClass = input('');

  /**
   * Custom CSS class(es) to apply to the modal backdrop
   * Useful for stacked modals with different z-index or opacity
   *
   * @example
   * ```html
   * <psh-modal backdropClass="higher-z-index" />
   * ```
   */
  backdropClass = input('');

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
    if (this.closeOnEscape() && this.open() && event.key === 'Escape') {
      this.handleClose();
    }
  };

  /**
   * Keyboard event handler for focus trap
   */
  private readonly focusTrapHandler = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && this.open()) {
      this.handleFocusTrap(event);
    }
  };

  /**
   * Computed signal indicating if a custom footer is projected
   */
  hasCustomFooter = computed(() => !!this.customFooter());

  /**
   * Computed signal for the modal state
   */
  state = computed(() => this.open() ? 'open' : 'closed');

  /**
   * Computed signal for the modal dialog ID for accessibility
   */
  modalDialogId = computed(() => `${this.modalId}-dialog`);

  /**
   * Computed signal for the modal description ID for accessibility
   */
  modalDescriptionId = computed(() => `${this.modalId}-description`);

  /**
   * Computed signal indicating if the screen is mobile-sized
   */
  isMobileScreen = computed(() => this.isMobileSignal());

  constructor() {
    effect(() => {
      if (this.open()) {
        this.onModalOpen();
      } else {
        this.onModalClose();
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  ngAfterViewInit(): void {
    this.attachModalToBody();
    this.setupResizeListener();
  }

  /**
   * Handles all setup when modal opens
   */
  private onModalOpen(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.modalService.register(this.modalId);
    this.setupScrollLock();
    this.addEventListeners();
    this.focusFirstElement();
  }

  /**
   * Handles all cleanup when modal closes
   */
  private onModalClose(): void {
    this.modalService.unregister(this.modalId);
    this.removeScrollLock();
    this.removeEventListeners();
    this.restoreFocus();
  }

  /**
   * Checks if the current screen size is mobile
   */
  private checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileSignal.set(window.innerWidth < this.mobileBreakpoint);
    }
  }

  /**
   * Sets up resize listener to detect screen size changes
   */
  private setupResizeListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeListener = () => this.checkScreenSize();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  /**
   * Removes resize listener
   */
  private removeResizeListener(): void {
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  /**
   * Adds keyboard event listeners
   */
  private addEventListeners(): void {
    document.addEventListener('keydown', this.escapeHandler);
    document.addEventListener('keydown', this.focusTrapHandler);
  }

  /**
   * Removes keyboard event listeners
   */
  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.escapeHandler);
    document.removeEventListener('keydown', this.focusTrapHandler);
  }

  /**
   * Focuses the first focusable element in the modal
   */
  private focusFirstElement(): void {
    setTimeout(() => {
      const modalElement = document.getElementById(this.modalDialogId());
      if (!modalElement) return;

      const focusableElements = this.getFocusableElements(modalElement);
      const firstElement = focusableElements[0];
      if (firstElement) {
        firstElement.focus();
      }
    }, 100);
  }

  /**
   * Restores focus to the element that opened the modal
   */
  private restoreFocus(): void {
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      setTimeout(() => {
        this.previousActiveElement?.focus();
      }, 100);
    }
  }

  /**
   * Handles focus trap to keep focus within the modal
   */
  private handleFocusTrap(event: KeyboardEvent): void {
    const modalElement = document.getElementById(this.modalDialogId());
    if (!modalElement) return;

    const focusableElements = this.getFocusableElements(modalElement);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (!firstElement || !lastElement) return;

    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Gets all focusable elements within a container
   */
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll<HTMLElement>(selector))
      .filter(el => el.offsetParent !== null);
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
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.handleClose();
    }
  }

  /**
   * Prevents page scrolling when modal is open
   * Calculates scrollbar width to prevent layout shift
   */
  private setupScrollLock(): void {
    if (!this.preventScroll() || typeof window === 'undefined') return;

    if (!document.documentElement.style.getPropertyValue('--scrollbar-width')) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        '--scrollbar-width',
        `${scrollbarWidth}px`
      );
    }
    document.body.classList.add('modal-open');
  }

  /**
   * Removes scroll lock when modal closes
   */
  private removeScrollLock(): void {
    if (!this.preventScroll() || typeof window === 'undefined') return;
    document.body.classList.remove('modal-open');
  }

  /**
   * Attaches the modal element to document.body for proper overlay rendering
   */
  private attachModalToBody(): void {
    const backdrop = this.modalBackdrop();
    if (backdrop && backdrop.nativeElement && !this.isAttachedToBody) {
      this.modalElement = backdrop;
      this.renderer.appendChild(document.body, backdrop.nativeElement);
      this.isAttachedToBody = true;
    }
  }

  /**
   * Detaches the modal element from document.body
   */
  private detachModalFromBody(): void {
    if (this.modalElement && this.modalElement.nativeElement && this.isAttachedToBody) {
      this.renderer.removeChild(document.body, this.modalElement.nativeElement);
      this.isAttachedToBody = false;
    }
  }

  /**
   * Cleanup on component destruction
   */
  ngOnDestroy(): void {
    this.removeScrollLock();
    this.removeEventListeners();
    this.removeResizeListener();
    this.modalService.unregister(this.modalId);
    this.detachModalFromBody();
  }
}
