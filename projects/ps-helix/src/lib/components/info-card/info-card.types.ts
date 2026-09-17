import { PshColor, PshSurfaceAppearance } from '../../types/semantic.types';
/**
 * Represents a single data row in the info card
 */
export interface InfoCardData {
  /** Label text for the data field */
  label: string;
  /** Value to display (will be converted to string) */
  value: string | number | boolean | null | undefined;
  /** Optional custom width for the label column */
  labelWidth?: string;
  /** Optional custom width for the value column */
  valueWidth?: string;
  /** Optional custom CSS class for styling */
  customClass?: string;
  /** Whether this row's value can be copied (overrides component-level copyable) */
  copyable?: boolean;
  /** Raw value to copy if different from the displayed value */
  copyValue?: string;
  /** Mise en forme optionnelle de la valeur de la ligne (cumulable). */
  emphasis?: InfoCardEmphasis;
}

/**
 * Configuration options for the info card
 */
export interface InfoCardOptions {
  /** Whether to show empty state when no data */
  showEmptyState?: boolean;
  /** Custom message to display in empty state */
  emptyStateMessage?: string;
  /** Default width for all label columns */
  labelWidth?: string;
  /** Default width for all value columns */
  valueWidth?: string;
  /** Applique automatiquement le rendu "muted" (italique + couleur secondaire) aux valeurs nullish. Défaut: true. */
  mutedEmptyValues?: boolean;
}

/**
 * Available card variant styles
 */
/**
 * @deprecated since 7.0.0 — use {@link PshSurfaceAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type InfoCardVariant = PshSurfaceAppearance;

/**
 * Couleurs sémantiques autorisées pour la mise en forme d'une valeur.
 * Jeu fermé, mappé sur les tokens du thème (clair et sombre).
 */
/**
 * @deprecated Since 7.0.0 — use {@link PshColor}. `muted` is now `neutral`.
 */
export type InfoCardTone = PshColor;

/**
 * Mise en forme optionnelle de la valeur d'une ligne.
 * Toutes les options sont indépendantes et **cumulables**
 * (ex. { italic: true, strikethrough: true, color: 'danger' }).
 * Jeu volontairement fermé : pas de CSS ni de couleur arbitraire —
 * pour du contenu riche, utiliser psh-table.
 */
export interface InfoCardEmphasis {
  /** Italique. */
  italic?: boolean;
  /** Gras (poids renforcé via token). */
  bold?: boolean;
  /** Barré (line-through). */
  strikethrough?: boolean;
  /** Couleur sémantique. Même union que partout ailleurs : {@link PshColor}. */
  color?: PshColor;
}
/** Application-wide defaults for `psh-info-card`, provided through `INFO_CARD_CONFIG`. */
export interface InfoCardConfig {
  appearance: InfoCardVariant;
  icon: string;
  hoverable: boolean;
  interactive: boolean;
  copyable: boolean;
  copyButtonLabel: string;
  copyFeedbackText: string;
  autoFullWidthOnMobile: boolean;
}
