/**
 * Type pour les variantes du stepper
 */
export type StepperVariant = 'default' | 'numbered' | 'progress';

/**
 * Labels ARIA pour l'accessibilité du stepper
 */
export interface StepperAriaLabels {
  /** Label pour "Étape" */
  step: string;
  /** Label pour une étape complétée */
  completed: string;
  /** Label pour l'étape active */
  active: string;
  /** Label pour une étape incomplète */
  incomplete: string;
  /** Label pour une étape désactivée */
  disabled: string;
}

/**
 * Configuration du stepper
 */
export interface StepperConfig {
  /** Variante visuelle */
  variant: StepperVariant;
  /** Navigation linéaire forcée */
  linear: boolean;
  /** Labels ARIA */
  ariaLabels?: StepperAriaLabels;
}

/**
 * Interface pour une étape
 */
export interface StepConfig {
  /** Titre de l'étape */
  title: string;
  /** Sous-titre optionnel */
  subtitle: string | undefined;
  /** Icône optionnelle */
  icon: string | undefined;
  /** État désactivé */
  disabled: boolean;
  /** État complété */
  completed: boolean;
  /** État de chargement */
  loading: boolean;
  /** Message d'erreur */
  error?: string;
  /** Message d'avertissement */
  warning?: string;
  /** Message de succès */
  success?: string;
}

