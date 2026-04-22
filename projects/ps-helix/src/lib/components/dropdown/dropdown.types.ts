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
 * Apparences disponibles pour le dropdown
 */
export type DropdownAppearance = 'filled' | 'outline' | 'text';

/**
 * Variantes disponibles pour le dropdown
 */
export type DropdownVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

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
  /** Apparence visuelle */
  appearance?: DropdownAppearance;
  /** Variante de couleur */
  variant?: DropdownVariant;
  /** Taille du dropdown */
  size?: DropdownSize;
  /** Position du menu */
  placement?: DropdownPlacement;
  /** État désactivé */
  disabled?: boolean;
  /** Mode icône seule (masque le label et le caret) */
  iconOnly?: boolean;
  /** Texte accessible (aria-label) quand iconOnly est actif */
  iconOnlyText?: string;
}