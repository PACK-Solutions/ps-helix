export type InputType = 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'date' | 'number';
export type InputVariant = 'outlined' | 'filled';
export type InputSize = 'small' | 'medium' | 'large';

export interface AutocompleteConfig {
  minLength: number;
  debounceTime: number;
}

export interface InputConfig {
  type: InputType;
  variant: InputVariant;
  size: InputSize;
  disabled: boolean;
  required: boolean;
  readonly: boolean;
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
  showPassword: 'Afficher le mot de passe',
  hidePassword: 'Masquer le mot de passe'
} as const;