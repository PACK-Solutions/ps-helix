import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PshTableComponent } from '../components/table/table.component';
import { provideHelix } from '../provide-helix';
import { PSH_FRENCH_DEFAULTS } from '../i18n/french';

/**
 * `PshLiveAnnouncerService` had **no consumer** in the library, while `ACCESSIBILITY.md` said
 * the shared primitives "back the components". It does now, in the one place that needed it.
 *
 * Most of the library already announces declaratively: toast, alert, spinloader, progressbar,
 * pagination and every field message render their own `aria-live` region, which is better —
 * it cannot fall out of step with what is on screen. `psh-table` was the exception. Sorting a
 * column or typing in the global search replaces every row in the body and said nothing at
 * all: `aria-sort` states the new order, but only to a reader who goes back to the header.
 */
@Component({
  selector: 'psh-announce-host',
  imports: [PshTableComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <psh-table [columns]="columns" [data]="data" [globalSearch]="true" />
  `,
})
class AnnounceHostComponent {
  columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'city', label: 'City', sortable: true },
  ];
  data = [
    { name: 'Ada', city: 'London' },
    { name: 'Grace', city: 'New York' },
    { name: 'Alan', city: 'London' },
  ];
}

/** What the shared polite region is currently saying. */
function announced(): string {
  const region = document.body.querySelector('[aria-live="polite"]');
  return region?.textContent ?? '';
}

describe('psh-table says what it just did', () => {
  let fixture: ComponentFixture<AnnounceHostComponent>;

  function build(providers: unknown[] = []) {
    TestBed.configureTestingModule({ providers: providers as never[] });
    fixture = TestBed.createComponent(AnnounceHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture.nativeElement.remove();
    TestBed.resetTestingModule();
  });

  function sortButton(index: number): HTMLElement {
    return fixture.nativeElement.querySelectorAll<HTMLElement>('.psh-sort-button')[index]!;
  }

  it('announces the column and the direction when a header is activated', () => {
    build();
    sortButton(0).click();
    fixture.detectChanges();

    expect(announced()).toBe('Name: sorted ascending');
  });

  it('announces the other direction on the second activation', () => {
    build();
    sortButton(0).click();
    fixture.detectChanges();
    sortButton(0).click();
    fixture.detectChanges();

    expect(announced()).toBe('Name: sorted descending');
  });

  it('announces how many rows are left after filtering', () => {
    build();
    const search = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    search.value = 'London';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(announced()).toBe('2 results found');
  });

  it('announces in the configured language', () => {
    build([provideHelix({ components: PSH_FRENCH_DEFAULTS })]);
    sortButton(0).click();
    fixture.detectChanges();

    expect(announced()).toBe('Name: trié par ordre croissant');
  });
});
