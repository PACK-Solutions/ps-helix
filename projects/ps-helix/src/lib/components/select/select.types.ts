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

export interface SearchConfig {
  debounceTime: number;
  placeholder: string;
  minLength: number;
}