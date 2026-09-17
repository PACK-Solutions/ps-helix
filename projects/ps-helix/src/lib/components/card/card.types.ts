import { PshColor, PshSurfaceAppearance } from '../../types/semantic.types';
/**
 * Variantes visuelles disponibles pour la carte
 */
/**
 * @deprecated since 7.0.0 — use {@link PshSurfaceAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type CardVariant = PshSurfaceAppearance;

/**
 * Variantes de couleur pour les cartes spéciales
 */
/**
 * @deprecated since 7.0.0 — use {@link PshColor}. Every component now shares one
 * semantic colour union, so this alias exists only to ease the migration.
 */
export type CardColorVariant = PshColor;

/**
 * Niveaux de densité pour le spacing
 */
export type CardDensity = 'compact' | 'normal' | 'spacious';

/**
 * Alignement des actions dans la zone card-actions
 */
export type CardActionsAlignment = 'left' | 'center' | 'right' | 'space-between';
/** Application-wide defaults for `psh-card`, provided through `CARD_CONFIG`. */
export interface CardConfig {
  appearance: CardVariant;
  color: CardColorVariant;
  density: CardDensity;
  hoverable: boolean;
  interactive: boolean;
  bodyPadding: boolean;
  showHeaderDivider: boolean;
  showFooterDivider: boolean;
  showActionsDivider: boolean;
  actionsAlignment: CardActionsAlignment;
}
