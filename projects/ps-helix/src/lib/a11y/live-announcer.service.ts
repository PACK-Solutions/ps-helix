import { DestroyRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type AnnouncerPoliteness = 'polite' | 'assertive';

const SR_ONLY_STYLE =
  'position:absolute;width:1px;height:1px;margin:-1px;border:0;padding:0;' +
  'overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';

/**
 * Centralised ARIA live-region announcer.
 *
 * Provides a single pair of visually-hidden `aria-live` regions (polite and
 * assertive) shared across the whole application, instead of every component
 * rendering its own live region. Inject it and call {@link announce} to read a
 * message to assistive technology (toasts, async loading, form validation…).
 *
 * @example
 * ```typescript
 * private announcer = inject(PshLiveAnnouncerService);
 * this.announcer.announce('3 results found');
 * this.announcer.announce('Save failed', 'assertive');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class PshLiveAnnouncerService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  /**
   * Announces a message in the requested live region.
   * The region is cleared first so the same message announced twice is re-read.
   */
  announce(message: string, politeness: AnnouncerPoliteness = 'polite'): void {
    if (!this.isBrowser) return;
    const region = this.getRegion(politeness);
    region.textContent = '';
    // Re-assign after clearing so assistive tech registers the change.
    region.textContent = message;
  }

  /** Clears both live regions. */
  clear(): void {
    if (this.politeRegion) this.politeRegion.textContent = '';
    if (this.assertiveRegion) this.assertiveRegion.textContent = '';
  }

  private getRegion(politeness: AnnouncerPoliteness): HTMLElement {
    if (politeness === 'assertive') {
      this.assertiveRegion ??= this.createRegion('assertive');
      return this.assertiveRegion;
    }
    this.politeRegion ??= this.createRegion('polite');
    return this.politeRegion;
  }

  private createRegion(politeness: AnnouncerPoliteness): HTMLElement {
    const region = this.document.createElement('div');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
    region.setAttribute('style', SR_ONLY_STYLE);
    region.classList.add('psh-live-announcer');
    this.document.body.appendChild(region);
    return region;
  }

  private dispose(): void {
    this.politeRegion?.remove();
    this.assertiveRegion?.remove();
    this.politeRegion = null;
    this.assertiveRegion = null;
  }
}
