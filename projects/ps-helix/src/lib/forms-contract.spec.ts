import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PshCheckboxComponent } from './components/checkbox/checkbox.component';
import { PshInputComponent } from './components/input/input.component';
import { PshRadioComponent } from './components/radio/radio.component';
import { PshRadioGroupComponent } from './components/radio/radio-group.component';
import { PshSelectComponent } from './components/select/select.component';
import { PshSwitchComponent } from './components/switch/switch.component';
import { PshTextareaComponent } from './components/textarea/textarea.component';

/**
 * The two halves of the form contract that were declared but not connected.
 *
 * **`required` did not validate.** `NG_VALIDATORS` appeared nowhere in the library: the input
 * drew an asterisk, set `aria-required`, and reported itself valid while empty. A form built
 * from required ps-helix fields was valid from the start, so `form.invalid` guarded nothing.
 *
 * **`touch` was not emitted.** `FormUiControl` declares `touched` (an input the field pushes
 * down) and `touch` (an output the field listens to). The controls only had
 * `touched = model(false)`, whose derived output is `touchedChange` — which the `Field`
 * directive does not listen to. Blur-based rules never fired.
 *
 * Both are asserted here rather than in each component's spec: it is one contract, and six
 * copies of it would drift.
 */

@Component({
  selector: 'psh-required-host',
  imports: [
    ReactiveFormsModule,
    PshInputComponent,
    PshTextareaComponent,
    PshSelectComponent,
    PshCheckboxComponent,
    PshSwitchComponent,
    PshRadioGroupComponent,
    PshRadioComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form">
      <psh-input formControlName="text" [required]="true" label="Text" />
      <psh-textarea formControlName="notes" [required]="true" label="Notes" />
      <psh-select formControlName="choice" [required]="true" [options]="options" label="Choice" />
      <psh-checkbox formControlName="terms" [required]="true" label="Terms" />
      <psh-switch formControlName="alerts" [required]="true" label="Alerts" />
      <psh-radio-group formControlName="plan" [required]="true" label="Plan">
        <psh-radio value="free" label="Free" />
        <psh-radio value="pro" label="Pro" />
      </psh-radio-group>
    </form>
  `,
})
class RequiredHostComponent {
  readonly options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ];
  readonly form = new FormGroup({
    text: new FormControl(''),
    notes: new FormControl(''),
    choice: new FormControl<string | null>(null),
    terms: new FormControl(false),
    alerts: new FormControl(false),
    plan: new FormControl<string | null>(null),
  });
}

@Component({
  selector: 'psh-optional-host',
  imports: [ReactiveFormsModule, PshInputComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form">
      <psh-input formControlName="text" [required]="isRequired()" label="Text" />
    </form>
  `,
})
class ToggleRequiredHostComponent {
  readonly isRequired = signal(false);
  readonly form = new FormGroup({ text: new FormControl('') });
}

describe('required actually validates', () => {
  let fixture: ComponentFixture<RequiredHostComponent>;
  let host: RequiredHostComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('reports every empty required control as invalid', () => {
    const controls = host.form.controls;

    expect(controls.text.hasError('required')).toBe(true);
    expect(controls.notes.hasError('required')).toBe(true);
    expect(controls.choice.hasError('required')).toBe(true);
    expect(controls.terms.hasError('required')).toBe(true);
    expect(controls.alerts.hasError('required')).toBe(true);
    expect(controls.plan.hasError('required')).toBe(true);
  });

  it('reports the form as invalid, which is what a submit button reads', () => {
    expect(host.form.invalid).toBe(true);
  });

  it('clears the error once the control is filled', () => {
    host.form.setValue({
      text: 'x',
      notes: 'y',
      choice: 'a',
      terms: true,
      alerts: true,
      plan: 'pro',
    });
    fixture.detectChanges();

    expect(host.form.valid).toBe(true);
  });

  it('treats whitespace as empty for a text value', () => {
    host.form.controls.text.setValue('   ');
    fixture.detectChanges();

    expect(host.form.controls.text.hasError('required')).toBe(true);
  });

  it('uses Angular’s own error key, so a consumer Validators.required does not double up', () => {
    expect(Object.keys(host.form.controls.text.errors ?? {})).toEqual(['required']);
  });
});

describe('required revalidates when it changes at runtime', () => {
  it('goes from valid to invalid when required is switched on', () => {
    const fixture = TestBed.createComponent(ToggleRequiredHostComponent);
    const host = fixture.componentInstance;
    fixture.detectChanges();

    expect(host.form.valid).toBe(true);

    // A value change revalidates on its own; a change to `required` only does so because the
    // component calls the `registerOnValidatorChange` callback.
    host.isRequired.set(true);
    fixture.detectChanges();

    expect(host.form.controls.text.hasError('required')).toBe(true);
  });
});

describe('touch is the output the Field directive listens to', () => {
  const CASES: readonly { name: string; component: new (...args: never[]) => unknown }[] = [
    { name: 'psh-input', component: PshInputComponent },
    { name: 'psh-textarea', component: PshTextareaComponent },
    { name: 'psh-select', component: PshSelectComponent },
    { name: 'psh-checkbox', component: PshCheckboxComponent },
    { name: 'psh-switch', component: PshSwitchComponent },
    { name: 'psh-radio-group', component: PshRadioGroupComponent },
  ];

  for (const { name, component } of CASES) {
    it(`${name} declares it`, () => {
      const fixture = TestBed.createComponent(component);
      const instance = fixture.componentInstance as { touch?: { subscribe?: unknown } };

      expect(instance.touch).toBeDefined();
      expect(typeof instance.touch?.subscribe).toBe('function');
    });
  }

  it('psh-checkbox emits it on blur, not only on toggle', () => {
    const fixture = TestBed.createComponent(PshCheckboxComponent);
    fixture.componentRef.setInput('label', 'Terms');
    fixture.detectChanges();

    const touched = jest.fn();
    fixture.componentInstance.touch.subscribe(touched);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    // Tabbing through a required checkbox without ticking it still means the user has been
    // there, which is what a field needs before it may show "required".
    expect(touched).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.checked()).toBe(false);
  });

  it('psh-input emits it on blur', () => {
    const fixture = TestBed.createComponent(PshInputComponent);
    fixture.detectChanges();

    const touched = jest.fn();
    fixture.componentInstance.touch.subscribe(touched);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(touched).toHaveBeenCalledTimes(1);
  });
});
