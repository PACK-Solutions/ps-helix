import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ScrollService } from './scroll.service';

@Component({ template: '' })
class BlankComponent {}

/**
 * It scrolls to the top on navigation, and it does so through a subscription — the one
 * subscription in the library that used to have no teardown. `providedIn: 'root'` made that
 * invisible in an application and real in a test suite, which recreates the root injector
 * between specs.
 *
 * The teardown itself is **not** asserted here. A test that resets the TestBed and then
 * navigates passes with or without `takeUntilDestroyed`, so it would prove nothing — and a
 * test that cannot fail is worse than none. What guards it is
 * `@angular-eslint/no-implicit-take-until-destroyed`, enabled in this same lot: a subscription
 * without one does not lint.
 */
describe('ScrollService', () => {
  let scrollTo: jest.Mock;

  beforeEach(() => {
    scrollTo = jest.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: BlankComponent },
          { path: 'next', component: BlankComponent },
        ]),
      ],
    });
  });

  it('scrolls to the top when a navigation ends', async () => {
    TestBed.inject(ScrollService);
    const router = TestBed.inject(Router);

    await router.navigate(['/next']);

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('does not scroll before anything has navigated', () => {
    TestBed.inject(ScrollService);

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
