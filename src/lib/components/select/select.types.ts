export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export type SelectSize = 'small' | 'medium' | 'large';

export interface SelectState {
  isOpen: boolean;
  searchTerm: string;
  selectedLabel: string;
  filteredOptions: SelectOption[];
}