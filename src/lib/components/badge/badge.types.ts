export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'disabled';
export type BadgeDisplayType = 'dot' | 'counter' | 'text';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BadgeConfig<T = number> {
  size?: BadgeSize;
  variant?: BadgeVariant;
  displayType?: BadgeDisplayType;
  content?: string;
  visible?: boolean;
  overlap?: boolean;
  position?: BadgePosition;
  max?: number;
  showZero?: boolean;
  value?: T;
  formatter?: (value: T) => string;
}