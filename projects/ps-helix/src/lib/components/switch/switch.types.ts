/**
 * Tailles disponibles pour le switch
 */
export type SwitchSize = 'small' | 'medium' | 'large';

/**
 * Configuration complète d'un switch
 */
export interface SwitchConfig {
  /** État coché */
  checked: boolean;
  /** État désactivé */
  disabled: boolean;
  /** État requis */
  required: boolean;
  /** Label du switch */
  label: string;
  /** Taille du switch */
  size: SwitchSize;
  /** Position du label */
  labelPosition: 'left' | 'right';
  /** Message d'erreur */
  error?: string;
  /** Message de succès */
  success?: string;
}