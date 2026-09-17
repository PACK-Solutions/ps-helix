/**
 * A component that dismisses something on Escape must stop the event there.
 *
 * `psh-modal` and `psh-sidebar` listen for Escape on the document, which is the only place
 * they can hear it from — the focus is inside their content. So a select, dropdown or
 * suggestion list opened *inside* a modal used to cost the user their whole form: one
 * Escape closed the list and the dialog behind it, in the same keypress. Found by opening a
 * select inside a modal in a real browser; jsdom renders it, but no spec pressed the key.
 *
 * The rule is narrow on purpose: stop the event only when the component actually acted. An
 * Escape on a closed select still belongs to the modal, and must reach it.
 */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshSelectComponent } from '../components/select/select.component';
import { PshDropdownComponent } from '../components/dropdown/dropdown.component';
import { PshInputComponent } from '../components/input/input.component';
import { PshCollapseComponent } from '../components/collapse/collapse.component';

@Component({
  imports: [PshSelectComponent, PshDropdownComponent, PshInputComponent, PshCollapseComponent],
  template: `
    <psh-select [options]="options" />
    <psh-dropdown [items]="items" label="Menu" />
    <psh-input [suggestions]="suggestions" [autocompleteConfig]="{ minLength: 1, debounceTime: 0 }" />
    <psh-collapse title="Section"><p>content</p></psh-collapse>
  `,
})
class HostComponent {
  readonly options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Bravo' },
  ];
  readonly items = [
    { value: 'x', label: 'Ex' },
    { value: 'y', label: 'Why' },
  ];
  readonly suggestions = ['alpha', 'bravo'];
}

describe('Escape inside a dialog', () => {
  let fixture: ComponentFixture<HostComponent>;
  /** What a modal's document-level listener would see. */
  let reachedDocument: number;

  function pressEscape(target: Element): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    reachedDocument = 0;
    document.addEventListener('keydown', countEscape);
  });

  afterEach(() => document.removeEventListener('keydown', countEscape));

  function countEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') reachedDocument += 1;
  }

  it('an open select swallows it', () => {
    const select = fixture.nativeElement.querySelector('psh-select');
    const trigger = select.querySelector('[role="combobox"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();

    pressEscape(trigger);

    expect(reachedDocument).toBe(0);
  });

  it('a closed select lets it through, because the modal owns it', () => {
    const trigger = fixture.nativeElement.querySelector(
      'psh-select [role="combobox"]',
    ) as HTMLElement;

    pressEscape(trigger);

    expect(reachedDocument).toBe(1);
  });

  it('an open dropdown swallows it', () => {
    const trigger = fixture.nativeElement.querySelector('psh-dropdown button') as HTMLElement;

    trigger.click();
    fixture.detectChanges();

    pressEscape(trigger);

    expect(reachedDocument).toBe(0);
  });

  it('a field with no suggestions showing lets it through', () => {
    const field = fixture.nativeElement.querySelector('psh-input input') as HTMLElement;

    pressEscape(field);

    expect(reachedDocument).toBe(1);
  });

  it('a field showing suggestions swallows it', async () => {
    const field = fixture.nativeElement.querySelector('psh-input input') as HTMLInputElement;

    field.value = 'al';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 20));
    fixture.detectChanges();

    // Guard against a vacuous pass: the list has to actually be up.
    expect(document.querySelectorAll('[role="option"]').length).toBeGreaterThan(0);

    pressEscape(field);

    expect(reachedDocument).toBe(0);
  });

  it('an expanded collapse swallows it, a closed one does not', () => {
    const header = fixture.nativeElement.querySelector(
      'psh-collapse [role="button"], psh-collapse button',
    ) as HTMLElement;

    pressEscape(header);
    expect(reachedDocument).toBe(1);

    header.click();
    fixture.detectChanges();
    pressEscape(header);

    expect(reachedDocument).toBe(1);
  });
});
