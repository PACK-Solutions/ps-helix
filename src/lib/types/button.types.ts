export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonIconPosition = 'left' | 'right' | 'only';

export interface ButtonConfig {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: ButtonIconPosition;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  showLabel?: boolean;
}