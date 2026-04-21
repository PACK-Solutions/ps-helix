/**
 * Types de toast disponibles
 */
export type ToastType = 'info' | 'success' | 'warning' | 'danger';

/**
 * Positions possibles pour les toasts
 */
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * Interface pour un toast
 */
export interface Toast {
  /** Identifiant unique */
  id?: string;
  /** Message à afficher */
  message: string;
  /** Type de toast */
  type: ToastType;
  /** Durée d'affichage en ms */
  duration?: number;
  /** Icône personnalisée */
  icon?: string;
  /** Afficher le bouton de fermeture (surcharge la config globale) */
  showCloseButton?: boolean;
}

/**
 * Configuration complète des toasts
 */
export interface ToastConfig {
  /** Position des toasts */
  position: ToastPosition;
  /** Durée d'affichage par défaut */
  duration: number;
  /** Nombre maximum de toasts */
  maxToasts: number;
  /** Pause au survol */
  pauseOnHover: boolean;
  /** Afficher l'icône */
  showIcon: boolean;
  /** Afficher le bouton de fermeture */
  showCloseButton: boolean;
}