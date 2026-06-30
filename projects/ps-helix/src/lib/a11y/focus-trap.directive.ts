import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Headless focus-trap primitive.
 *
 * Apply to a container element and toggle activation with `[pshFocusTrap]`.
 * When active it:
 * - remembers the element that had focus before activation,
 * - moves focus to the first focusable element inside the container
 *   (deterministically, after the next render — no `setTimeout`),
 * - keeps Tab / Shift+Tab focus cycling within the container, and
 * - restores focus to the previously focused element on deactivation/destroy.
 *
 * Handles the case where focus is currently outside the container.
 *
 * @example
 * ```html
 * <div [pshFocusTrap]="isOpen()">…</div>
 * ```
 */
@Directive({
  selector: '[pshFocusTrap]',
})
export class PshFocusTrapDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Whether the trap is active. */
  readonly pshFocusTrap = input<boolean>(true);

  /** Whether to restore focus to the previously focused element on deactivation. */
  readonly pshFocusTrapRestore = input<boolean>(true);

  private previouslyFocused: HTMLElement | null = null;
  private active = false;

  constructor() {
    effect(() => {
      const enabled = this.pshFocusTrap();
      if (!this.isBrowser) return;
      if (enabled) {
        this.activate();
      } else {
        this.deactivate();
      }
    });

    inject(DestroyRef).onDestroy(() => this.restoreFocus(true));
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.active || event.key !== 'Tab') return;

    const focusables = this.getFocusableElements();
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) {
      // Nothing focusable inside — keep focus pinned to the container.
      event.preventDefault();
      return;
    }

    const current = this.document.activeElement;
    const inside = this.host.nativeElement.contains(current);

    if (event.shiftKey) {
      if (!inside || current === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (!inside || current === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  private activate(): void {
    if (this.active) return;
    this.active = true;
    this.previouslyFocused = this.document.activeElement as HTMLElement | null;

    // Deterministic post-render focus (replaces setTimeout-based focusing).
    afterNextRender(
      () => {
        if (!this.active) return;
        if (!this.host.nativeElement.contains(this.document.activeElement)) {
          this.getFocusableElements()[0]?.focus();
        }
      },
      { injector: this.injector },
    );
  }

  private deactivate(): void {
    if (!this.active) return;
    this.active = false;
    this.restoreFocus(false);
  }

  private restoreFocus(immediate: boolean): void {
    const target = this.previouslyFocused;
    this.previouslyFocused = null;

    if (!this.pshFocusTrapRestore() || !target || typeof target.focus !== 'function') {
      return;
    }

    if (immediate) {
      target.focus();
    } else {
      afterNextRender(() => target.focus(), { injector: this.injector });
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    // The selector already excludes the common non-focusable cases (disabled,
    // tabindex="-1"). We intentionally avoid an offsetParent/layout-based
    // visibility filter: the browser itself skips display:none elements on
    // focus(), and layout metrics are unavailable in non-rendering test envs.
    return Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>(selector),
    ).filter(el => !el.hasAttribute('hidden'));
  }
}
