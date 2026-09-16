import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy, Type } from '@angular/core';

import { PshCheckboxComponent } from '../components/checkbox/checkbox.component';
import { PshInputComponent } from '../components/input/input.component';
import { PshRadioComponent } from '../components/radio/radio.component';
import { PshSelectComponent } from '../components/select/select.component';
import { PshSwitchComponent } from '../components/switch/switch.component';
import { PshTextareaComponent } from '../components/textarea/textarea.component';

/**
 * `aria-describedby` is the only thing tying a field to its error message for a screen
 * reader, and nothing in this repository was checking that it points at an element that
 * exists.
 *
 * That gap is not hypothetical. During the 7.0.0 class-namespacing pass a rename rewrote
 * `getStepDescribedBy()`'s return value — an element id, not a class — and left the matching
 * `[id]` in the template alone. The link was broken and all 2 195 tests stayed green;
 * jest-axe did not flag it either, because `aria-valid-attr-value` does not resolve ids under
 * jsdom in this configuration. Only reading the template caught it.
 *
 * So this suite asserts the one property that matters and no unit test states: every id an
 * `aria-describedby` names is rendered.
 */

interface Case {
  readonly name: string;
  readonly component: Type<unknown>;
  /** Message inputs to exercise. Each is set on its own, then all together. */
  readonly messages: readonly string[];
  /** Inputs the component requires in order to render at all. */
  readonly required?: Readonly<Record<string, unknown>>;
}

const CASES: readonly Case[] = [
  { name: 'psh-input', component: PshInputComponent, messages: ['error', 'success', 'hint'] },
  {
    name: 'psh-textarea',
    component: PshTextareaComponent,
    messages: ['error', 'success', 'hint'],
  },
  {
    name: 'psh-select',
    component: PshSelectComponent,
    messages: ['error', 'success', 'hint'],
    required: { options: [] },
  },
  {
    name: 'psh-checkbox',
    component: PshCheckboxComponent,
    messages: ['error', 'success', 'hint'],
  },
  { name: 'psh-switch', component: PshSwitchComponent, messages: ['error', 'success', 'hint'] },
  { name: 'psh-radio', component: PshRadioComponent, messages: ['error', 'success', 'hint'] },
];

/**
 * Every id listed in an `aria-describedby` anywhere in the fixture must resolve to a rendered
 * element. Returns the ids that do not.
 */
function danglingIds(fixture: ComponentFixture<unknown>): string[] {
  const root: HTMLElement = fixture.nativeElement;
  const dangling: string[] = [];

  for (const el of Array.from(root.querySelectorAll('[aria-describedby]'))) {
    const value = el.getAttribute('aria-describedby');
    if (!value) continue;
    for (const id of value.split(/\s+/).filter(Boolean)) {
      // `getElementById` rather than a `#id` selector: jsdom has no `CSS.escape`, and the
      // lookup has to reach the whole document anyway — a teleported panel renders its
      // message outside the component's own host. The fixture is attached for that reason.
      if (!document.getElementById(id)) dangling.push(id);
    }
  }
  return dangling;
}

/** How many elements in the document carry this id. Two is the bug 6.2.5 fixed on `psh-input`. */
function countById(id: string): number {
  return Array.from(document.querySelectorAll('[id]')).filter(el => el.id === id).length;
}

describe('aria-describedby points at a rendered element', () => {
  for (const { name, component, messages, required } of CASES) {
    describe(name, () => {
      let fixture: ComponentFixture<unknown>;

      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [component],
        }).compileComponents();

        fixture = TestBed.createComponent(component);
        for (const [key, value] of Object.entries(required ?? {})) {
          fixture.componentRef.setInput(key, value);
        }
        document.body.appendChild(fixture.nativeElement);
      });

      afterEach(() => {
        fixture.nativeElement.remove();
      });

      for (const message of messages) {
        it(`resolves the id it publishes for "${message}"`, () => {
          fixture.componentRef.setInput(message, `A ${message} message`);
          fixture.detectChanges();

          expect(danglingIds(fixture)).toEqual([]);
        });
      }

      it('resolves the id it publishes when every message is set at once', () => {
        for (const message of messages) {
          fixture.componentRef.setInput(message, `A ${message} message`);
        }
        fixture.detectChanges();

        expect(danglingIds(fixture)).toEqual([]);
      });

      it('publishes no aria-describedby when there is no message', () => {
        fixture.detectChanges();

        const described = Array.from(
          (fixture.nativeElement as HTMLElement).querySelectorAll('[aria-describedby]'),
        ).filter(el => el.getAttribute('aria-describedby'));

        expect(described).toEqual([]);
      });

      /**
       * `aria-describedby` takes a list, and that is the whole reason `ariaDescribedBy`
       * merges instead of replacing. Before 7.0.0 there was no input at all — zero across
       * all 33 classes — so attaching extra guidance meant setting the attribute from
       * outside, which overwrote the id of the control's own error message.
       */
      it('merges the caller ids with its own instead of replacing them', () => {
        const help = document.createElement('p');
        help.id = 'external-help';
        help.textContent = 'Extra guidance';
        document.body.appendChild(help);

        fixture.componentRef.setInput('error', 'Required');
        fixture.componentRef.setInput('ariaDescribedBy', 'external-help');
        fixture.detectChanges();

        const el = (fixture.nativeElement as HTMLElement).querySelector('[aria-describedby]');
        const ids = el?.getAttribute('aria-describedby')?.split(/\s+/) ?? [];

        expect(ids).toContain('external-help');
        expect(ids.length).toBe(2);
        expect(danglingIds(fixture)).toEqual([]);

        help.remove();
      });

      it('publishes the caller ids on their own when it has no message', () => {
        fixture.componentRef.setInput('ariaDescribedBy', 'a b');
        fixture.detectChanges();

        const el = (fixture.nativeElement as HTMLElement).querySelector('[aria-describedby]');
        expect(el?.getAttribute('aria-describedby')).toBe('a b');
      });
    });
  }
});

/**
 * The ids have to be unique per instance as well as resolvable. Two fields in error on one
 * page sharing an id is the failure mode that made a screen reader read the first field's
 * message for both — fixed on `psh-input` in 6.2.5, and worth holding for every control.
 */
@Component({
  selector: 'psh-described-by-host',
  imports: [
    PshInputComponent,
    PshTextareaComponent,
    PshCheckboxComponent,
    PshSwitchComponent,
    PshRadioComponent,
    PshSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <psh-input error="First" />
    <psh-input error="Second" />
    <psh-textarea error="First" />
    <psh-textarea error="Second" />
    <psh-checkbox error="First" />
    <psh-checkbox error="Second" />
    <psh-switch error="First" />
    <psh-switch error="Second" />
    <psh-radio error="First" />
    <psh-radio error="Second" />
    <psh-select [options]="[]" error="First" />
    <psh-select [options]="[]" error="Second" />
  `,
})
class TwoOfEachHostComponent {}

describe('aria-describedby is unique per instance', () => {
  it('gives two controls of the same kind two different message ids', () => {
    const fixture = TestBed.createComponent(TwoOfEachHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    const root: HTMLElement = fixture.nativeElement;

    const described = Array.from(root.querySelectorAll('[aria-describedby]'))
      .map(el => el.getAttribute('aria-describedby'))
      .filter((v): v is string => !!v);

    expect(described.length).toBe(12);
    expect(new Set(described).size).toBe(described.length);
    expect(danglingIds(fixture)).toEqual([]);

    // And every id is actually rendered exactly once.
    for (const id of described) {
      expect(countById(id)).toBe(1);
    }

    fixture.nativeElement.remove();
  });
});
