import { TestBed } from '@angular/core/testing';

import { PSH_FRENCH_DEFAULTS } from './french';
import { provideHelix } from '../provide-helix';
import { PshModalComponent } from '../components/modal/modal.component';
import { PshSelectComponent } from '../components/select/select.component';
import { PshPaginationComponent } from '../components/pagination/pagination.component';

/**
 * `verify:i18n-preset` checks that the preset names every translatable default. This checks
 * the other half: that naming them actually changes what a component says.
 *
 * A structural guard alone would pass on a preset whose keys were all spelled right and wired
 * to nothing — which is the defect this whole lot keeps finding.
 */
describe('PSH_FRENCH_DEFAULTS', () => {
  afterEach(() => TestBed.resetTestingModule());

  function withPreset(component: Parameters<typeof TestBed.createComponent>[0]) {
    TestBed.configureTestingModule({
      providers: [provideHelix({ components: PSH_FRENCH_DEFAULTS })],
    });
    return TestBed.createComponent(component);
  }

  it('turns the modal into French', () => {
    const fixture = withPreset(PshModalComponent);
    const modal = fixture.componentInstance as PshModalComponent;

    expect(modal.dismissLabel()).toBe('Fermer');
    expect(modal.confirmLabel()).toBe('Valider');
    expect(modal.cancelLabel()).toBe('Annuler');
  });

  it('turns the select into French, search field included', () => {
    const fixture = withPreset(PshSelectComponent);
    const select = fixture.componentInstance as PshSelectComponent<string>;
    fixture.componentRef.setInput('options', []);

    expect(select.placeholder()).toBe('Sélectionner une option');
    expect(select.noResultsText()).toBe('Aucun résultat');
    expect(select.searchPlaceholder()).toBe('Rechercher…');
  });

  it('reaches the string that used to be built in French and could not be changed', () => {
    const fixture = withPreset(PshPaginationComponent);
    fixture.componentRef.setInput('totalPages', 7);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    // `Page 2 sur 7` was hard-coded, in French, in a component whose other labels were all
    // English inputs. It is two configured words now.
    expect(fixture.nativeElement.textContent).toContain('Page 2 sur 7');
  });

  it('leaves an element-level binding in charge', () => {
    const fixture = withPreset(PshModalComponent);
    fixture.componentRef.setInput('confirmLabel', 'Envoyer');

    expect((fixture.componentInstance as PshModalComponent).confirmLabel()).toBe('Envoyer');
  });
});
