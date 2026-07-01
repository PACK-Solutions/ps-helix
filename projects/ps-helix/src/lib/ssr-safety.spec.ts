import { Component, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeService } from './services/theme/theme.service';
import { PshModalComponent } from './components/modal/modal.component';

/**
 * SSR-safety guard tests.
 *
 * These run under the `server` platform id so the `isPlatformBrowser` guards
 * take their server branch. jsdom still provides `document`, so we assert that
 * the browser-only side effects are *skipped* — i.e. a component/service running
 * on the server does not mutate the DOM or throw. A full render smoke test would
 * additionally need `@angular/platform-server`; static analysis already confirms
 * there is no unguarded global browser access.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-modal [open]="true" title="SSR modal"><p>content</p></psh-modal>`,
  imports: [PshModalComponent],
})
class SsrModalHost {}

describe('SSR safety (server platform)', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
  });

  afterEach(() => {
    document.body
      .querySelectorAll('[role="dialog"]')
      .forEach(dialog => dialog.remove());
  });

  it('ThemeService constructs and toggles without touching the DOM on the server', () => {
    const service = TestBed.inject(ThemeService);
    expect(() => service.setDarkTheme(true)).not.toThrow();
    expect(() => service.updateTheme('dark')).not.toThrow();
    // The `data-theme` attribute is only written in the browser.
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('renders an open modal on the server without throwing', () => {
    const fixture: ComponentFixture<SsrModalHost> = TestBed.createComponent(SsrModalHost);
    expect(() => fixture.detectChanges()).not.toThrow();
    // Dialog markup is produced (server-rendered) — the browser-only listeners /
    // focus trap / scroll lock simply don't run.
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();
  });
});
