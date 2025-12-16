/**
 * Variantes disponibles pour le spinner
 */
export type SpinLoaderVariant = 'circle' | 'dots' | 'pulse';

/**
 * Tailles disponibles pour le spinner
 */
export type SpinLoaderSize = 'small' | 'medium' | 'large';

/**
 * Couleurs disponibles pour le spinner
 */
export type SpinLoaderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

/**
 * Configuration complète du spinner
 */
export interface SpinLoaderConfig {
  /** Variante visuelle */
  variant: SpinLoaderVariant;
  /** Taille du spinner */
  size: SpinLoaderSize;
  /** Couleur du spinner */
  color: SpinLoaderColor;
}