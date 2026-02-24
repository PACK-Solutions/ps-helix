/**
 * Tailles disponibles pour la checkbox (mappées en rem dans le CSS)
 */
export type CheckboxSize = 'small' | 'medium' | 'large';

/**
 * Positionnement du label par rapport au contrôle visuel
 */
export type CheckboxLabelPosition = 'left' | 'right';

/**
 * Configuration immuable pour l'injection via InjectionToken
 */
export interface CheckboxConfig {
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly required: boolean;
  readonly indeterminate: boolean;
  readonly label: string;
  readonly size: CheckboxSize;
  readonly labelPosition: CheckboxLabelPosition;
  readonly ariaLabel?: string;
  readonly error?: string | null;
  readonly success?: string | null;
}