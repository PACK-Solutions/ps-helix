/**
 * Types d'alertes disponibles
 */
export type AlertType = 'info' | 'success' | 'warning' | 'danger';

/**
 * Positions possibles de l'icône
 */
export type IconPosition = 'left' | 'right';

/**
 * Tailles disponibles pour l'alerte
 */
export type AlertSize = 'small' | 'medium' | 'large';

/**
 * Rôles ARIA possibles pour l'alerte
 */
export type AlertRole = 'alert' | 'status';

/** Labels pour l'alerte */
export interface AlertLabels {
  /** Label pour le bouton de fermeture */
  dismiss?: string;
}

/**
 * Configuration complète d'une alerte
 */
export interface AlertConfig {
  /** Type de l'alerte */
  type: AlertType;
  /** Position de l'icône */
  iconPosition: IconPosition;
  /** Indique si l'alerte peut être fermée */
  closable: boolean;
  /** Taille de l'alerte */
  size: AlertSize;
  /** Indique si l'icône doit être affichée */
  showIcon: boolean;
  /** Rôle ARIA de l'alerte */
  role: AlertRole;
  /** Icône personnalisée (optionnel) */
  icon?: string;
  /** Label ARIA personnalisé (optionnel) */
  ariaLabel?: string;
  /** Niveau de politesse ARIA (optionnel) */
  ariaLive?: 'polite' | 'assertive';
  /** Labels personnalisés */
  labels?: AlertLabels;
}