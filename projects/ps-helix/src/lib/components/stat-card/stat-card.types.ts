export interface StatCardData {
  value: string | number;
  description: string;
  icon: string;
  tagVariant?: 'success' | 'danger' | 'warning' | 'primary';
  tagLabel?: string;
  iconBackground?: string;
  rowDirection?: boolean;
}

export type StatTagVariant = 'success' | 'danger' | 'warning' | 'primary';

export type StatCardLayout = 'horizontal' | 'vertical';

export type StatCardVariant = 'default' | 'elevated' | 'outlined';
