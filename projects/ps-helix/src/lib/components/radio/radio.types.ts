/**
 * Tailles disponibles pour le radio button
 */
export type RadioSize = 'small' | 'medium' | 'large';

/**
 * Configuration complète d'un radio button
 */
export interface RadioConfig {
  /** État coché */
  checked: boolean;
  /** État désactivé */
  disabled: boolean;
  /** État requis */
  required: boolean;
  /** Label du radio */
  label: string;
  /** Nom du groupe */
  name: string;
  /** Valeur associée */
  value: any;
  /** Taille du radio */
  size: RadioSize;
  /** Position du label */
  labelPosition: 'left' | 'right';
  /** Message d'erreur */
  error?: string;
  /** Message de succès */
  success?: string;
}