import { PshFieldAppearance } from '../../types/semantic.types';
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
  placeholder: string;
  minLength: number;
}