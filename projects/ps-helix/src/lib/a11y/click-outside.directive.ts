import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Emits when a click occurs outside the host element.
 *
 * Shared primitive replacing the per-component document click listeners used by
 * select / dropdown to close on outside click. Typically consumed as a host
 * directive:
 *
 * @example
 * ```typescript
 * @Component({ hostDirectives: [PshClickOutsideDirective] })
 * export class MyPopover {
 *   constructor() {
 *     inject(PshClickOutsideDirective).pshClickOutside.subscribe(() => this.close());
 *   }
 * }
 * ```
 */
@Directive({
  selector: '[pshClickOutside]',
})
export class PshClickOutsideDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Emitted when a click lands outside the host element. */
  readonly pshClickOutside = output<MouseEvent>();

  constructor() {
    if (!this.isBrowser) return;
    this.document.addEventListener('click', this.onDocumentClick);
    inject(DestroyRef).onDestroy(() =>
      this.document.removeEventListener('click', this.onDocumentClick),
    );
  }

  private readonly onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.pshClickOutside.emit(event);
    }
  };
}
