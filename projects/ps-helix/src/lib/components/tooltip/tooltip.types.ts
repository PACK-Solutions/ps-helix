/**
 * Positions possibles pour le tooltip
 */
export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * Configuration complète d'un tooltip
 */
export interface TooltipConfig {
  /** Variante visuelle */
  variant: 'light' | 'dark';
  /** Position du tooltip */
  position: TooltipPosition;
  /** Délai avant affichage */
  showDelay: number;
  /** Délai avant masquage */
  hideDelay: number;
  /** Largeur maximale */
  maxWidth: number;
}