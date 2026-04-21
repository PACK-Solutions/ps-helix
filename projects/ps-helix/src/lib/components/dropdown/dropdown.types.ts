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
 * Placement de l'icône dans le trigger du dropdown.
 * `'only'` rend un bouton carré sans label ni flèche : `icon` est requis et
 * `ariaLabel` (ou `label`) est obligatoire pour respecter WCAG 4.1.2.
 */
export type DropdownIconPosition = 'left' | 'right' | 'only';

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
  /** Placement de l'icône dans le trigger */
  iconPosition?: DropdownIconPosition;
  /** État désactivé */
  disabled?: boolean;
}