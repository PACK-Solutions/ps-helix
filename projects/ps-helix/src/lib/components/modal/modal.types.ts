/**
 * Tailles disponibles pour la modale
 */
export type ModalSize = 'small' | 'medium' | 'large';

/**
 * Configuration complète d'une modale
 */
export interface ModalConfig {
  /** Taille de la modale */
  size: ModalSize;
  /** Afficher le bouton de fermeture */
  showClose: boolean;
  /** Fermer au clic sur l'arrière-plan */
  closeOnBackdrop: boolean;
  /** Fermer avec la touche Échap */
  closeOnEscape: boolean;
  /** Empêcher le scroll de la page */
  preventScroll: boolean;
  /** Afficher le footer */
  showFooter: boolean;
  /** Label du bouton de fermeture */
  dismissLabel?: string;
  /** Label du bouton de confirmation */
  confirmLabel?: string;
  /** Label du bouton d'annulation */
  cancelLabel?: string;
}