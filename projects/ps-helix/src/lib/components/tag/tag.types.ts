/**
 * Variantes disponibles pour le tag
 */
export type TagVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

/**
 * Tailles disponibles pour le tag
 */
export type TagSize = 'small' | 'medium' | 'large';

/**
 * Configuration complète d'un tag
 */
export interface TagConfig {
  variant: TagVariant;
  size: TagSize;
  icon?: string;
  closable: boolean;
  disabled: boolean;
  interactive?: boolean;
  closeLabel?: string;
}