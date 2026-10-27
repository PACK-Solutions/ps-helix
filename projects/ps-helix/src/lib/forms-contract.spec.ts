/// <reference types="node" />
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
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

/**
 * The visible required mark: one element, one rule, on all seven.
 *
 * It used to be three mechanisms. Input and textarea drew a `::after` on their label; select and
 * radio-group rendered a span — whose rule the select never got, so its asterisk took the label's
 * colour, and the select's span was announced on top of `aria-required`; checkbox, radio and
 * switch drew nothing. Now every one renders `<span class="psh-required-mark" aria-hidden="true">`
 * in its label, styled by `components/shared/required-mark.css`.
 *
 * jsdom cannot resolve `var()`, so the colour is checked in a browser. What a test can hold is
 * the shape: one mark per required control, hidden from assistive technology, none when the
 * control is optional — and one rule in one file, which leaves nothing to drift.
 */
@Component({
  selector: 'psh-mark-host',
  imports: [
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
    <psh-input [required]="required()" label="Text" />
    <psh-textarea [required]="required()" label="Notes" />
    <psh-select [required]="required()" [options]="options" label="Choice" />
    <psh-checkbox [required]="required()" label="Terms" />
    <psh-switch [required]="required()" label="Alerts" />
    <psh-radio class="lone" [required]="required()" value="yes" label="Lone" />
    <psh-radio-group [required]="required()" label="Plan">
      <psh-radio value="free" label="Free" />
      <psh-radio value="pro" label="Pro" />
    </psh-radio-group>
  `,
})
class MarkHostComponent {
  readonly required = signal(true);
  readonly options = [{ value: 'a', label: 'A' }];
}

describe('the required mark', () => {
  let fixture: ComponentFixture<MarkHostComponent>;
  const root = () => fixture.nativeElement as HTMLElement;

  /** Each control, and the label element its mark belongs in. */
  const CONTROLS: [string, string][] = [
    ['psh-input', '.psh-input-label'],
    ['psh-textarea', '.psh-textarea-label'],
    ['psh-select', '.psh-select-label'],
    ['psh-checkbox', '.psh-checkbox-label'],
    ['psh-switch', '.psh-switch-label'],
    ['psh-radio.lone', '.psh-radio-label'],
    ['psh-radio-group', '.psh-radio-group-label'],
  ];

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkHostComponent);
    fixture.detectChanges();
  });

  it.each(CONTROLS)('%s renders exactly one mark, in its label, hidden from assistive tech', (host, label) => {
    const marks = root().querySelector(host)!.querySelectorAll('.psh-required-mark');

    expect(marks).toHaveLength(1);
    expect(marks[0].getAttribute('aria-hidden')).toBe('true');
    expect(marks[0].textContent?.trim()).toBe('*');
    expect(marks[0].closest(label)).not.toBeNull();
  });

  it.each(CONTROLS)('%s sets the mark against its label, with no space before it', (host, label) => {
    // The gap is the mark's margin alone. A line break after `{{ label() }}` in a template
    // survives as a space, which put 5–6px before the asterisk instead of --psh-spacing-xxs.
    const mark = root().querySelector(host)!.querySelector('.psh-required-mark')!;
    const walker = document.createTreeWalker(mark.closest(label)!, NodeFilter.SHOW_TEXT);
    let before = '';
    for (let node = walker.nextNode(); node && !mark.contains(node); node = walker.nextNode()) {
      before += node.textContent;
    }

    expect(before.trim()).not.toBe('');
    expect(before).toBe(before.trimEnd());
  });

  it('marks a required radio group once, on its label — not once per radio', () => {
    const radios = root().querySelectorAll('psh-radio-group psh-radio');

    expect(radios).toHaveLength(2);
    radios.forEach((radio) => expect(radio.querySelector('.psh-required-mark')).toBeNull());
  });

  it('renders no mark on any of the seven when they are optional', () => {
    fixture.componentInstance.required.set(false);
    fixture.detectChanges();

    expect(root().querySelectorAll('.psh-required-mark')).toHaveLength(0);
  });

  it.each([
    ['psh-checkbox', PshCheckboxComponent],
    ['psh-radio', PshRadioComponent],
  ] as const)('%s keeps the mark out of its visible-label check', (_name, type) => {
    // Required and unlabelled: the asterisk is not a label, so the missing-label warning stands.
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const lone = TestBed.createComponent(type);
    lone.componentRef.setInput('required', true);
    lone.detectChanges();

    expect(lone.nativeElement.querySelector('.psh-required-mark')).not.toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('No accessible label'));
    warn.mockRestore();
  });
});

describe('the required mark is one rule in one file', () => {
  const components = join(__dirname, 'components');
  // Every place a rule can live: the stylesheets, and the components' code — an inline
  // `styles: […]` would compile a second rule in as surely as a second file.
  const sources: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(css|ts)$/.test(entry) && !entry.endsWith('.spec.ts')) sources.push(path);
    }
  };
  walk(__dirname);
  const uncommented = (path: string) =>
    readFileSync(path, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
  // A rule styles the mark when one selector of its list ends on it: `.psh-required-mark`,
  // `.x .psh-required-mark`, `.psh-required-mark:hover` — not `.psh-required-mark .child`.
  const stylesTheMark = (text: string) =>
    [...text.matchAll(/([^{};]+)\{/g)].some(([, prelude]) =>
      prelude.split(',').some((selector) => /\.psh-required-mark(?![\w-])[^\s>+~]*$/.test(selector.trim())),
    );

  it.each([
    'input/input.component.ts',
    'textarea/textarea.component.ts',
    'select/select.component.ts',
    'checkbox/checkbox.component.ts',
    'switch/switch.component.ts',
    'radio/radio.component.ts',
    'radio/radio-group.component.ts',
  ])('%s compiles the shared rule in', (file) => {
    const source = readFileSync(join(components, file), 'utf8');
    expect(source).toMatch(/styleUrls:\s*\[[^\]]*'\.\.\/shared\/required-mark\.css'/);
  });

  it('declares .psh-required-mark in exactly one stylesheet', () => {
    const declaring = sources.filter((path) => stylesTheMark(uncommented(path)));
    expect(declaring.map((path) => path.replace(/\\/g, '/').split('/lib/')[1])).toEqual([
      'components/shared/required-mark.css',
    ]);
  });

  it('draws no asterisk with generated content anywhere', () => {
    const generated = sources.filter((path) => /content:\s*\\?['"]\*\\?['"]/.test(uncommented(path)));
    expect(generated).toEqual([]);
  });
});
