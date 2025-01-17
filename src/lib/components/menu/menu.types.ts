export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
  divider?: boolean;
  badge?: string | number;
}

export type MenuVariant = 'default' | 'compact' | 'expanded';
export type MenuMode = 'vertical' | 'horizontal';