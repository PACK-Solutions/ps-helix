import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PshRadioGroupComponent } from './radio-group.component';
import { PshRadioComponent } from './radio.component';

/**
 * `psh-radio` never carried a form contract, and could not: the value of a radio in a form is
 * not a boolean per button, it is which one of the set is selected. There was nothing for a
 * form control to bind to, so `formControlName`, `[(ngModel)]` and `[formField]` all silently
 * did nothing.
 *
 * These tests cover what the group exists for: owning that value, and the keyboard behaviour
 * a set of radios needs — which used to be two empty methods on the radio, commented
 * "Implementation requires radio group context".
 */

@Component({
  selector: 'psh-plain-host',
  imports: [PshRadioGroupComponent, PshRadioComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <psh-radio-group [(value)]="plan" label="Plan" [disabled]="groupDisabled()">
      <psh-radio value="free" label="Free" />
      <psh-radio value="pro" label="Pro" [disabled]="proDisabled()" />
      <psh-radio value="max" label="Max" />
    </psh-radio-group>
  `,
})
class PlainHostComponent {
  readonly plan = signal<string | null>(null);
  readonly groupDisabled = signal(false);
  readonly proDisabled = signal(false);
}

@Component({
  selector: 'psh-reactive-host',
  imports: [PshRadioGroupComponent, PshRadioComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form">
      <psh-radio-group formControlName="plan" label="Plan">
        <psh-radio value="free" label="Free" />
        <psh-radio value="pro" label="Pro" />
      </psh-radio-group>
    </form>
  `,
})
class ReactiveHostComponent {
  readonly form = new FormGroup({ plan: new FormControl<string | null>('pro') });
}

function inputs(fixture: ComponentFixture<unknown>): HTMLInputElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
}

/** The nth radio input, asserted to exist — a missing one is a broken test, not a null case. */
function radio(fixture: ComponentFixture<unknown>, index: number): HTMLInputElement {
  const el = inputs(fixture)[index];
  if (!el) throw new Error(`no radio at index ${index}`);
  return el;
}

function press(el: Element, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('PshRadioGroupComponent', () => {
  describe('owning the value', () => {
    let fixture: ComponentFixture<PlainHostComponent>;
    let host: PlainHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(PlainHostComponent);
      host = fixture.componentInstance;
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
    });

    afterEach(() => fixture.nativeElement.remove());

    it('checks the radio whose value matches, and only that one', () => {
      host.plan.set('pro');
      fixture.detectChanges();

      expect(inputs(fixture).map(i => i.checked)).toEqual([false, true, false]);
    });

    it('writes the selected value back through the two-way binding', () => {
      radio(fixture, 2).click();
      fixture.detectChanges();

      expect(host.plan()).toBe('max');
    });

    it('moves the selection when another radio is chosen', () => {
      radio(fixture, 0).click();
      fixture.detectChanges();
      radio(fixture, 1).click();
      fixture.detectChanges();

      expect(host.plan()).toBe('pro');
      expect(inputs(fixture).map(i => i.checked)).toEqual([false, true, false]);
    });

    it('gives every radio the group name, so the browser treats them as one set', () => {
      const names = new Set(inputs(fixture).map(i => i.name));
      expect(names.size).toBe(1);
      expect([...names][0]).toMatch(/^psh-radio-group-\d+$/);
    });

    it('disables every radio when the group is disabled', () => {
      host.groupDisabled.set(true);
      fixture.detectChanges();

      expect(inputs(fixture).every(i => i.disabled)).toBe(true);
    });

    it('ignores a click on a disabled radio', () => {
      host.proDisabled.set(true);
      fixture.detectChanges();

      radio(fixture, 1).click();
      fixture.detectChanges();

      expect(host.plan()).toBeNull();
    });

    it('is a radiogroup for assistive technology', () => {
      const group: HTMLElement = fixture.nativeElement.querySelector('psh-radio-group');
      expect(group.getAttribute('role')).toBe('radiogroup');
      expect(group.getAttribute('aria-labelledby')).toBeTruthy();

      const labelId = group.getAttribute('aria-labelledby')!;
      expect(document.getElementById(labelId)?.textContent).toContain('Plan');
    });
  });

  describe('roving tabindex', () => {
    let fixture: ComponentFixture<PlainHostComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(PlainHostComponent);
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
    });

    afterEach(() => fixture.nativeElement.remove());

    it('exposes exactly one tab stop before anything is selected', () => {
      const stops = inputs(fixture).filter(i => i.tabIndex === 0);
      expect(stops.length).toBe(1);
      expect(stops[0]?.value).toBe('free');
    });

    it('moves the tab stop to the selected radio', () => {
      fixture.componentInstance.plan.set('max');
      fixture.detectChanges();

      const stops = inputs(fixture).filter(i => i.tabIndex === 0);
      expect(stops.length).toBe(1);
      expect(stops[0]?.value).toBe('max');
    });
  });

  describe('keyboard', () => {
    let fixture: ComponentFixture<PlainHostComponent>;
    let host: PlainHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(PlainHostComponent);
      host = fixture.componentInstance;
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
    });

    afterEach(() => fixture.nativeElement.remove());

    it('selects the next radio on ArrowDown and moves focus to it', () => {
      host.plan.set('free');
      fixture.detectChanges();

      press(radio(fixture, 0), 'ArrowDown');
      fixture.detectChanges();

      expect(host.plan()).toBe('pro');
      expect(document.activeElement).toBe(radio(fixture, 1));
    });

    it('selects the previous radio on ArrowUp', () => {
      host.plan.set('pro');
      fixture.detectChanges();

      press(radio(fixture, 1), 'ArrowUp');
      fixture.detectChanges();

      expect(host.plan()).toBe('free');
    });

    it('treats ArrowRight and ArrowLeft the same way', () => {
      host.plan.set('free');
      fixture.detectChanges();

      press(radio(fixture, 0), 'ArrowRight');
      fixture.detectChanges();
      expect(host.plan()).toBe('pro');

      press(radio(fixture, 1), 'ArrowLeft');
      fixture.detectChanges();
      expect(host.plan()).toBe('free');
    });

    it('wraps at both ends', () => {
      host.plan.set('max');
      fixture.detectChanges();
      press(radio(fixture, 2), 'ArrowDown');
      fixture.detectChanges();
      expect(host.plan()).toBe('free');

      press(radio(fixture, 0), 'ArrowUp');
      fixture.detectChanges();
      expect(host.plan()).toBe('max');
    });

    it('skips a disabled radio', () => {
      host.proDisabled.set(true);
      host.plan.set('free');
      fixture.detectChanges();

      press(radio(fixture, 0), 'ArrowDown');
      fixture.detectChanges();

      expect(host.plan()).toBe('max');
    });

    it('jumps to the first and last with Home and End', () => {
      host.plan.set('pro');
      fixture.detectChanges();

      press(radio(fixture, 1), 'End');
      fixture.detectChanges();
      expect(host.plan()).toBe('max');

      press(radio(fixture, 2), 'Home');
      fixture.detectChanges();
      expect(host.plan()).toBe('free');
    });

    it('does nothing when the group is disabled', () => {
      fixture.componentInstance.groupDisabled.set(true);
      fixture.detectChanges();

      press(radio(fixture, 0), 'ArrowDown');
      fixture.detectChanges();

      expect(fixture.componentInstance.plan()).toBeNull();
    });
  });

  describe('Reactive Forms', () => {
    let fixture: ComponentFixture<ReactiveHostComponent>;
    let host: ReactiveHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ReactiveHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('renders the control value as the checked radio', () => {
      expect(inputs(fixture).map(i => i.checked)).toEqual([false, true]);
    });

    it('writes the user selection back to the control', () => {
      radio(fixture, 0).click();
      fixture.detectChanges();

      expect(host.form.controls.plan.value).toBe('free');
    });

    it('follows a programmatic setValue', () => {
      host.form.controls.plan.setValue('free');
      fixture.detectChanges();

      expect(radio(fixture, 0).checked).toBe(true);
    });

    it('marks the control touched once the user has chosen', () => {
      expect(host.form.controls.plan.touched).toBe(false);

      radio(fixture, 0).click();
      fixture.detectChanges();

      expect(host.form.controls.plan.touched).toBe(true);
    });

    it('disables every radio through the control', () => {
      host.form.controls.plan.disable();
      fixture.detectChanges();

      expect(inputs(fixture).every(i => i.disabled)).toBe(true);
    });
  });

  describe('the Signal Forms contract', () => {
    it('emits touch, which is what the Field directive listens to', () => {
      const fixture = TestBed.createComponent(PshRadioGroupComponent);
      const touched = jest.fn();
      fixture.componentInstance.touch.subscribe(touched);
      fixture.detectChanges();

      fixture.componentInstance.markTouched();

      expect(touched).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.touched()).toBe(true);
    });

    it('exposes value as a model, which FormValueControl requires', () => {
      const fixture = TestBed.createComponent(PshRadioGroupComponent);
      fixture.detectChanges();

      fixture.componentInstance.value.set('x');
      expect(fixture.componentInstance.value()).toBe('x');
    });
  });
});
