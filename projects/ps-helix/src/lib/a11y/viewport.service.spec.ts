import { TestBed } from '@angular/core/testing';

import { PshViewportService } from './viewport.service';

/**
 * The point of the service is that N components asking the same question cost one listener,
 * so that is what this asserts — alongside the breakpoints being the documented ones.
 */
describe('PshViewportService', () => {
  let queries: { query: string; listeners: number; onChange?: (e: MediaQueryListEvent) => void }[];

  beforeEach(() => {
    queries = [];
    window.matchMedia = ((query: string) => {
        const entry = { query, listeners: 0, matches: false } as (typeof queries)[number] & {
          matches: boolean;
        };
        queries.push(entry);
        return {
          get matches() {
            return entry.matches;
          },
          media: query,
          addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
            entry.listeners++;
            entry.onChange = cb;
          },
          removeEventListener: () => {
            entry.listeners--;
          },
      };
    }) as unknown as typeof window.matchMedia;
    TestBed.configureTestingModule({});
  });

  it('asks the browser once, however many callers there are', () => {
    const service = TestBed.inject(PshViewportService);

    const a = service.below('sm');
    const b = service.below('sm');
    const c = service.below('sm');

    expect(queries.length).toBe(1);
    expect(queries[0]!.listeners).toBe(1);
    // and they are the same signal, so they cannot disagree
    expect(b).toBe(a);
    expect(c).toBe(a);
  });

  it('uses the exclusive max-width of the documented scale', () => {
    const service = TestBed.inject(PshViewportService);
    service.below('sm');
    service.below('md');

    // 39.9375em is 640px minus a pixel: at exactly the breakpoint the component and the
    // stylesheet have to agree on which side they are on.
    expect(queries.map(q => q.query)).toEqual([
      '(max-width: 39.9375em)',
      '(max-width: 47.9375em)',
    ]);
  });

  it('updates every caller when the query flips', () => {
    const service = TestBed.inject(PshViewportService);
    const isMobile = service.below('sm');
    expect(isMobile()).toBe(false);

    queries[0]!.onChange!({ matches: true } as MediaQueryListEvent);
    expect(isMobile()).toBe(true);
  });

  it('answers false, and stays there, with no matchMedia at all', () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    // The server has none, and it is the value the components used to default to, so the
    // first paint is what it always was.
    expect(TestBed.inject(PshViewportService).below('sm')()).toBe(false);
  });
});
