/**
 * Application-wide defaults for `psh-select`.
 *
 * Provide it to set a default once for every psh-select in the application:
 *
 *     provideHelix({ components: { select: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { SelectConfig } from './select.types';

const SELECT_DEFAULTS = {
  appearance: 'outline',
  size: 'medium',
  searchable: false,
  clearable: false,
  fullWidth: false,
  placeholder: 'Sélectionner une option',
  multiplePlaceholder: 'Sélectionner des options',
  noResultsText: 'Aucun résultat',
  clearLabel: 'Effacer la sélection',
  searchConfig: { debounceTime: 300, placeholder: 'Rechercher...', minLength: 1 },
} satisfies Partial<SelectConfig>;

export const SELECT_CONFIG = new InjectionToken<Partial<SelectConfig>>('SELECT_CONFIG', {
  factory: () => SELECT_DEFAULTS,
});
