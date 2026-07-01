import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { PshFocusTrapDirective } from './focus-trap.directive';

@Component({
  template: `
    <button id="outside">Outside</button>
    <div [pshFocusTrap]="trapped()" [pshFocusTrapAutoFocus]="autoFocus()">
      <button id="first">First</button>
      <button id="mid">Mid</button>
      <button id="last">Last</button>
    </div>
  `,
  imports: [PshFocusTrapDirective],
})
class TestHostComponent {
  trapped = signal(false);
  autoFocus = signal(true);
}

const byId = (id: string) => document.getElementById(id) as HTMLButtonElement;

const dispatchTab = (target: HTMLElement, shift = false) => {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey: shift,
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
};

describe('PshFocusTrapDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    // Attach to the document so offsetParent-based visibility detection works.
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  it('moves focus to the first focusable element when activated', async () => {
    byId('outside').focus();
    expect(document.activeElement).toBe(byId('outside'));

    host.trapped.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(byId('first'));
  });

  it('wraps focus from last to first on Tab', () => {
    host.trapped.set(true);
    fixture.detectChanges();

    byId('last').focus();
    const event = dispatchTab(byId('last'));

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(byId('first'));
  });

  it('wraps focus from first to last on Shift+Tab', () => {
    host.trapped.set(true);
    fixture.detectChanges();

    byId('first').focus();
    const event = dispatchTab(byId('first'), true);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(byId('last'));
  });

  it('does not trap Tab when inactive', () => {
    byId('last').focus();
    const event = dispatchTab(byId('last'));

    expect(event.defaultPrevented).toBe(false);
  });

  it('pulls focus inside the container on activation even if focus was outside', async () => {
    byId('outside').focus();
    expect(document.activeElement).toBe(byId('outside'));

    host.trapped.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.trapped()).toBe(true);
    expect(document.activeElement).toBe(byId('first'));
  });

  it('does not steal initial focus when autoFocus is false, but still traps', async () => {
    byId('outside').focus();
    host.autoFocus.set(false);
    host.trapped.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    // Focus stays outside (not moved into the container)...
    expect(document.activeElement).toBe(byId('outside'));

    // ...but Tab from the last element still wraps inside.
    byId('last').focus();
    const event = dispatchTab(byId('last'));
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(byId('first'));
  });

  it('restores focus to the previously focused element on deactivation', async () => {
    byId('outside').focus();

    host.trapped.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement).toBe(byId('first'));

    host.trapped.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(byId('outside'));
  });
});
