/**
 * Tailles disponibles pour la checkbox exprimées en rem dans le CSS
 */
export type CheckboxSize = 'small' | 'medium' | 'large';

/**
 * Positionnement du label par rapport au contrôle visuel
 */
export type CheckboxLabelPosition = 'left' | 'right';

/**
 * Configuration globale immuable pour le composant Checkbox
 */
export interface CheckboxConfig {
  /** État coché initial */
  readonly checked: boolean;
  /** État désactivé initial */
  readonly disabled: boolean;
  /** État requis par défaut */
  readonly required: boolean;
  /** État indéterminé initial */
  readonly indeterminate: boolean;
  /** Label par défaut */
  readonly label: string;
  /** Taille par défaut */
  readonly size: CheckboxSize;
  /** Position du label par défaut */
  readonly labelPosition: CheckboxLabelPosition;
  /** Label ARIA pour l'accessibilité */
  readonly ariaLabel?: string;
  /** Message d'erreur par défaut */
  readonly error?: string | null;
  /** Message de succès par défaut */
  readonly success?: string | null;
}