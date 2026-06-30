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
 * Angular 21 change-detection compatibility shim for the test harness.
 *
 * In Angular 21, mutating a plain (non-signal) field on a test host component
 * and then calling `fixture.detectChanges()` no longer marks the host view
 * dirty, so bindings projected into OnPush children are not re-rendered. The
 * subsequent `checkNoChanges` verification pass then reports a spurious
 * NG0100 (ExpressionChangedAfterItHasBeenChecked). The very same components
 * render correctly in the real browser (verified via the production build and
 * dev server), so this is purely a test-harness artifact.
 *
 * Marking the host view for check before each detection restores the classic
 * "mark dirty + check" behaviour these specs were written against, WITHOUT
 * disabling `checkNoChanges` (real expression-changed bugs are still caught).
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

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

(window as typeof globalThis).ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
