/**
 * Variantes disponibles pour la barre de progression
 */
export type ProgressbarVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

/**
 * Tailles disponibles pour la barre de progression
 */
export type ProgressbarSize = 'small' | 'medium' | 'large';

/**
 * Mode d'affichage de la barre de progression
 */
export type ProgressbarMode = 'default' | 'striped' | 'animated' | 'indeterminate';

/**
 * Position du label
 */
export type ProgressbarLabelPosition = 'top' | 'bottom' | 'inline';

/**
 * Configuration complète d'une barre de progression
 */
export interface ProgressbarConfig {
  /** Valeur actuelle */
  value: number;
  /** Valeur maximale */
  max: number;
  /** Variante visuelle */
  variant: ProgressbarVariant;
  /** Taille de la barre */
  size: ProgressbarSize;
  /** Afficher le label */
  showLabel: boolean;
  /** Mode d'affichage */
  mode: ProgressbarMode;
  /** Position du label */
  labelPosition: ProgressbarLabelPosition;
}