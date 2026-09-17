/**
 * Every component that asks "is this a narrow screen?" asks the shared service.
 *
 * `psh-modal` used to answer it itself, with `innerWidth < 768` behind its own resize listener.
 * Two things followed. It did not scale with browser zoom, so at 150% its stylesheet switched
 * at an effective 1150px while this stayed at 768 — the modal was in its mobile layout while
 * `isMobileScreen()` still said no. And `verify:breakpoints` could not see it, because that
 * script reads stylesheets; a breakpoint written in TypeScript is invisible to it.
 *
 * Driving the fake viewport is what proves the component reads the shared source: a component
 * measuring the window on its own would not move.
 */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FakePshViewport, providePshViewportForTesting } from './viewport.testing';
import { PshModalComponent } from '../components/modal/modal.component';
import { PshSidebarComponent, SIDEBAR_CONFIG } from '../components/sidebar/sidebar.component';

const viewport = new FakePshViewport();

@Component({
  imports: [PshModalComponent],
  template: `<psh-modal [(open)]="open" title="t">body</psh-modal>`,
})
class ModalHost {
  open = true;
}

describe('the narrow-screen question', () => {
  let fixture: ComponentFixture<ModalHost>;

  beforeEach(async () => {
    viewport.mobile.set(false);
    await TestBed.configureTestingModule({
      imports: [ModalHost],
      providers: [providePshViewportForTesting(viewport)],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalHost);
    fixture.detectChanges();
  });

  it('psh-modal reads the shared viewport, not the window', () => {
    const modal = fixture.debugElement.query(By.directive(PshModalComponent))
      .componentInstance as PshModalComponent;

    expect(modal.isMobileScreen()).toBe(false);

    viewport.mobile.set(true);
    fixture.detectChanges();

    expect(modal.isMobileScreen()).toBe(true);
  });
});

describe('the sidebar breakpoint', () => {
  /**
   * It is a public input taking any CSS length, so the guarantee is about the *default*: the
   * scale the rest of the library switches on. A px default drifts from every stylesheet the
   * moment the page is zoomed.
   */
  it('defaults to the em scale, and still accepts px', async () => {
    await TestBed.configureTestingModule({ imports: [PshSidebarComponent] }).compileComponents();
    const fixture = TestBed.createComponent(PshSidebarComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.breakpoint()).toMatch(/em$/);

    fixture.componentRef.setInput('breakpoint', '768px');
    fixture.detectChanges();

    expect(fixture.componentInstance.breakpoint()).toBe('768px');
  });

  it('takes its default from the config token when one is provided', async () => {
    await TestBed.configureTestingModule({
      imports: [PshSidebarComponent],
      providers: [{ provide: SIDEBAR_CONFIG, useValue: { breakpoint: '30em' } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(PshSidebarComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.breakpoint()).toBe('30em');
  });
});
