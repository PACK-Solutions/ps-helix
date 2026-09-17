import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, Signal, inject, signal } from '@angular/core';

/**
 * One media query per breakpoint, for the whole application.
 *
 * `psh-card` and `psh-info-card` each built a `ResizeObserver` on `document.documentElement`
 * to answer one question — is the viewport narrow? — so a grid of fifty cards installed fifty
 * observers on the root element, each firing on every resize frame. The answer is the same for
 * all of them, and `matchMedia` gives it without measuring anything: the browser evaluates the
 * query and fires only when it flips.
 *
 * The queries are also back on the documented scale. Both components asked
 * `innerWidth <= 640`, a pixel breakpoint written in TypeScript, which is why
 * `verify:breakpoints` never saw it — that script reads stylesheets. An `em` query follows the
 * user's root font size, so a component and the CSS beside it switch together under zoom.
 *
 * @example
 * private readonly viewport = inject(PshViewportService);
 * readonly isMobile = this.viewport.below('sm');
 */

/** The scale of `breakpoints.tokens.css`, as the exclusive `max-width` of each step. */
const BELOW = {
  xs: '29.9375em',
  sm: '39.9375em',
  md: '47.9375em',
  lg: '63.9375em',
  xl: '79.9375em',
  '2xl': '95.9375em',
} as const;

export type PshBreakpoint = keyof typeof BELOW;

@Injectable({ providedIn: 'root' })
export class PshViewportService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  /** One entry per distinct query, however many components ask for it. */
  private readonly queries = new Map<string, Signal<boolean>>();

  /**
   * Whether the viewport is narrower than the given breakpoint.
   *
   * Exclusive, like the `max-width` rules in the stylesheets: at exactly the breakpoint the
   * answer is `false`, so a component and its CSS never disagree about which side they are on.
   *
   * On the server it is `false` and never changes — the same value the components defaulted to
   * before, so the first paint is unchanged.
   */
  below(breakpoint: PshBreakpoint): Signal<boolean> {
    return this.matches(`(max-width: ${BELOW[breakpoint]})`);
  }

  /** Any media query, as a signal. Shared with every other caller that passes the same one. */
  matches(query: string): Signal<boolean> {
    const existing = this.queries.get(query);
    if (existing) return existing;

    const state = signal(false);
    // The read-only view is what is cached, so two callers get the *same* signal rather than
    // two wrappers over one — and nothing outside can write it.
    const readonly = state.asReadonly();
    this.queries.set(query, readonly);

    const view = this.isBrowser ? this.document.defaultView : null;
    if (view?.matchMedia) {
      const list = view.matchMedia(query);
      state.set(list.matches);

      const onChange = (event: MediaQueryListEvent) => state.set(event.matches);
      list.addEventListener('change', onChange);
      this.destroyRef.onDestroy(() => list.removeEventListener('change', onChange));
    }

    return readonly;
  }
}
