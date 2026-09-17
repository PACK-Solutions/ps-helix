import { PshFieldAppearance } from '../../types/semantic.types';
import { PshConfigValue } from '../../utils/config-value';
export interface SelectOption<T> {
  label: string;
  value: T;
  icon?: string;
  disabled?: boolean;
  description?: string;
}

export interface SelectOptionGroup<T> {
  label: string;
  options: SelectOption<T>[];
  disabled?: boolean;
}

export type SelectSize = 'small' | 'medium' | 'large';
/**
 * @deprecated since 7.0.0 — use {@link PshFieldAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type SelectVariant = PshFieldAppearance;

export interface SearchConfig {
  debounceTime: number;
  placeholder: PshConfigValue<string>;
  minLength: number;
}
/**
 * Contexte du template d'option.
 *
 * Le rendu d'une option était figé : icône, label, description, et rien d'autre. Afficher un
 * avatar, un badge ou deux colonnes dans une option imposait `::ng-deep`. Le composant garde
 * l'enveloppe — `role="option"`, l'`id`, `aria-selected`, le clic — et ne cède que son
 * contenu : un template ne peut donc pas casser l'accessibilité de la listbox.
 */
export interface SelectOptionContext<T> {
  /** L'option rendue. */
  $implicit: SelectOption<T>;
  /** Fait partie de la valeur courante. */
  selected: boolean;
  /** Désactivée, par elle-même ou par son groupe. */
  disabled: boolean;
}

/** Application-wide defaults for `psh-select`, provided through `SELECT_CONFIG`. */
export interface SelectConfig {
  appearance: SelectVariant;
  size: SelectSize;
  searchable: boolean;
  clearable: boolean;
  fullWidth: boolean;
  placeholder: string;
  multiplePlaceholder: PshConfigValue<string>;
  noResultsText: PshConfigValue<string>;
  clearLabel: PshConfigValue<string>;
  searchConfig: SearchConfig;
}
