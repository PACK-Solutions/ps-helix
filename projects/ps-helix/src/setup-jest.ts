import 'jest-preset-angular/setup-env/zone';
import { getTestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { toHaveNoViolations } from 'jest-axe';

// Enable the jest-axe accessibility matcher across all specs.
expect.extend(toHaveNoViolations);

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

/**
 * Change-detection compatibility shim for the test harness.
 *
 * These specs drive components through inline test-host wrappers, mutating a
 * plain (non-signal) host field and then calling `fixture.detectChanges()`.
 * Marking the host view for check before each detection keeps that classic
 * "mark dirty + check" flow working, WITHOUT disabling `checkNoChanges`
 * (real ExpressionChangedAfterItHasBeenChecked bugs are still caught).
 *
 * NOTE: the test-host components are additionally declared with
 * `ChangeDetectionStrategy.Eager` — since Angular 22 made OnPush the default
 * strategy, an un-annotated host would no longer re-evaluate its template
 * bindings on a plain-field mutation.
 */
const originalDetectChanges = ComponentFixture.prototype.detectChanges;
ComponentFixture.prototype.detectChanges = function (
  this: ComponentFixture<unknown>,
  checkNoChanges?: boolean,
): void {
  this.changeDetectorRef.markForCheck();
  originalDetectChanges.call(this, checkNoChanges);
};

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

// jsdom does not implement matchMedia; provide a minimal stub for components
// that read media queries (spinloader reduce-motion, sidebar breakpoints…).
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

(window as typeof globalThis).ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
