/**
 * Tailles disponibles pour la checkbox
 */
export type CheckboxSize = 'small' | 'medium' | 'large';

/**
 * Configuration complète d'une checkbox
 */
export interface CheckboxConfig {
  /** État coché */
  checked: boolean;
  /** État désactivé */
  disabled: boolean;
  /** État requis */
  required: boolean;
  /** État indéterminé */
  indeterminate: boolean;
  /** Label de la checkbox */
  label: string;
  /** Taille de la checkbox */
  size: CheckboxSize;
  /** Position du label */
  labelPosition: 'left' | 'right';
  /** Label ARIA pour l'accessibilité */
  ariaLabel?: string;
  /** Message d'erreur */
  error?: string;
  /** Message de succès */
  success?: string;
}