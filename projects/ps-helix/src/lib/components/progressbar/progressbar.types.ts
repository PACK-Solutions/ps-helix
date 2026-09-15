import { PshColor } from '../../types/semantic.types';
/**
 * Variantes disponibles pour la barre de progression
 */
/**
 * @deprecated since 7.0.0 — use {@link PshColor}. Every component now shares one
 * semantic colour union, so this alias exists only to ease the migration.
 */
export type ProgressbarVariant = PshColor;

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
  color: ProgressbarVariant;
  /** Taille de la barre */
  size: ProgressbarSize;
  /** Afficher le label */
  showLabel: boolean;
  /** Mode d'affichage */
  mode: ProgressbarMode;
  /** Position du label */
  labelPosition: ProgressbarLabelPosition;
}