/**
 * Interface pour un élément du dropdown
 */
export interface DropdownItem<T = string> {
  /** Contenu à afficher (pas de traduction) */
  content: string;
  /** Valeur associée */
  value: T;
  /** Icône optionnelle */
  icon?: string;
  /** État désactivé */
  disabled?: boolean;
  /** État actif */
  active?: boolean;
}

/**
 * Tailles disponibles pour le dropdown
 */
export type DropdownSize = 'small' | 'medium' | 'large';

/**
 * Positions possibles du menu
 */
export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/**
 * Configuration complète du dropdown
 */
export interface DropdownConfig {
  /** Variante visuelle */
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  /** Taille du dropdown */
  size?: DropdownSize;
  /** Position du menu */
  placement?: DropdownPlacement;
  /** État désactivé */
  disabled?: boolean;
}