import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PshInputComponent } from '../components/input/input.component';
import { PshSelectComponent } from '../components/select/select.component';

/**
 * The combobox contract, asserted on both components that implement one.
 *
 * `psh-select` had it right and `psh-input` had none of it: it teleported a `role="listbox"`
 * into the body while its `<input>` carried no `role`, no `aria-expanded`, no `aria-controls`
 * and no `aria-activedescendant`. A screen reader was never told the list existed, and arrow
 * keys moved a highlight it could not see.
 *
 * Testing the two together is the point — the correct implementation already lived in this
 * repository, three files away from the one that lacked it.
 */

/** Every attribute a combobox owes its user, and what it should say when the list is shut. */
function expectClosedCombobox(el: HTMLElement): void {
  expect(el.getAttribute('role')).toBe('combobox');
  expect(el.getAttribute('aria-expanded')).toBe('false');
  expect(el.getAttribute('aria-activedescendant')).toBeNull();
}

function expectOpenCombobox(el: HTMLElement): void {
  expect(el.getAttribute('role')).toBe('combobox');
  expect(el.getAttribute('aria-expanded')).toBe('true');

  const listboxId = el.getAttribute('aria-controls');
  expect(listboxId).toBeTruthy();

  const listbox = document.getElementById(listboxId!);
  expect(listbox?.getAttribute('role')).toBe('listbox');
  expect(listbox!.querySelectorAll('[role="option"]').length).toBeGreaterThan(0);
}

describe('psh-input announces its suggestions', () => {
  let fixture: ComponentFixture<PshInputComponent>;
  const getInput = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(PshInputComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.componentRef.setInput('suggestions', ['Apple', 'Apricot', 'Banana']);
    fixture.componentRef.setInput('autocompleteConfig', { minLength: 1, debounceTime: 0 });
    fixture.detectChanges();
  });

  afterEach(() => fixture.nativeElement.remove());

  function type(value: string): void {
    const input = getInput();
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new FocusEvent('focus'));
    tick(0);
    fixture.detectChanges();
  }

  it('is a combobox before the list opens, and says the list is shut', () => {
    expectClosedCombobox(getInput());
  });

  it('points at the listbox once it opens', fakeAsync(() => {
    type('a');
    expectOpenCombobox(getInput());
  }));

  it('names the highlighted option through aria-activedescendant', fakeAsync(() => {
    type('a');
    const input = getInput();
    expect(input.getAttribute('aria-activedescendant')).toBeNull();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    const active = input.getAttribute('aria-activedescendant');
    expect(active).toBeTruthy();

    // The id has to resolve, and to the option the highlight is on.
    const option = document.getElementById(active!);
    expect(option?.getAttribute('role')).toBe('option');
    expect(option?.classList.contains('psh-focused')).toBe(true);
  }));

  it('claims nothing when the field has no suggestions to offer', () => {
    const plain = TestBed.createComponent(PshInputComponent);
    document.body.appendChild(plain.nativeElement);
    plain.detectChanges();

    // A combobox role on a field with no popup promises a list that will never arrive.
    const input = plain.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('role')).toBeNull();
    expect(input.getAttribute('aria-expanded')).toBeNull();

    plain.nativeElement.remove();
  });
});

describe('psh-select keeps the pattern it already had', () => {
  let fixture: ComponentFixture<PshSelectComponent<string>>;
  const getTrigger = () =>
    fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent<PshSelectComponent<string>>(PshSelectComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'Apple' },
      { value: 'b', label: 'Banana' },
    ]);
    fixture.detectChanges();
  });

  afterEach(() => fixture.nativeElement.remove());

  it('is a combobox before the list opens', () => {
    expectClosedCombobox(getTrigger());
  });

  it('points at the listbox once it opens', () => {
    getTrigger().click();
    fixture.detectChanges();

    expectOpenCombobox(getTrigger());
  });
});
