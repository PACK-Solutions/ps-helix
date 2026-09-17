import { PshFieldAppearance } from '../../types/semantic.types';
import { PshConfigValue } from '../../utils/config-value';
export type InputType = 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'date' | 'number';
/**
 * @deprecated since 7.0.0 — use {@link PshFieldAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type InputVariant = PshFieldAppearance;
export type InputSize = 'small' | 'medium' | 'large';

export interface AutocompleteConfig {
  minLength: number;
  debounceTime: number;
}

export interface InputConfig {
  type: InputType;
  appearance: InputVariant;
  size: InputSize;
  required: boolean;
  /** Accessible name of the password toggle while the password is hidden */
  showPasswordLabel: PshConfigValue<string>;
  /** Accessible name of the password toggle while the password is shown */
  hidePasswordLabel: PshConfigValue<string>;
  fullWidth: boolean;
  showLabel: boolean;
  label: string;
  placeholder: string;
  error: string | null | undefined;
  success: string | null | undefined;
  hint: string | null | undefined;
  ariaLabel: string | null;
}

export interface SuggestionResult {
  suggestions: string[];
  error?: string;
}

export const INPUT_LABELS = {
  showPassword: 'Show password',
  hidePassword: 'Hide password'
} as const;