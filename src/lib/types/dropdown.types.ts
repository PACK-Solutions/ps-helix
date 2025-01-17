export interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  active?: boolean;
}

export type DropdownSize = 'small' | 'medium' | 'large';
export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';