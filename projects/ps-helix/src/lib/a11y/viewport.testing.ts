import { Provider, Signal, signal } from '@angular/core';

import { PshViewportService } from './viewport.service';

/**
 * A `PshViewportService` a test drives directly.
 *
 * `jsdom` has no layout, so `matchMedia` there answers whatever `setup-jest` stubs it with and
 * never changes. Before 7.0.0 the two card components each held their own writable `isMobile`
 * signal and the specs set it — which tested the class field rather than the path the viewport
 * actually travels. They set this instead, and the component reads it the way it does in a
 * browser.
 *
 * @example
 * const viewport = new FakePshViewport();
 * TestBed.configureTestingModule({ providers: [providePshViewportForTesting(viewport)] });
 * viewport.mobile.set(true);
 *
 * @internal
 */
export class FakePshViewport {
  /** Every query answers with this, which is all any consumer asks today. */
  readonly mobile = signal(false);

  below(): Signal<boolean> {
    return this.mobile.asReadonly();
  }

  matches(): Signal<boolean> {
    return this.mobile.asReadonly();
  }
}

/** @internal */
export function providePshViewportForTesting(fake: FakePshViewport): Provider {
  return { provide: PshViewportService, useValue: fake };
}
