import { PshColor, PshControlAppearance } from '../../types/semantic.types';
import { PshConfigValue } from '../../utils/config-value';
/**
 * Interface pour un élément du dropdown
 */
export interface DropdownItem<T = string> {
  /** Contenu à afficher (pas de traduction) */
  content: string;
  /** Valeur associée */
  value: T;
  /** Icône optionnelle */
  icon?: string;
  /** État désactivé */
  disabled?: boolean;
  /** État actif */
  active?: boolean;
}

/**
 * Apparences disponibles pour le dropdown
 */
/**
 * @deprecated since 7.0.0 — use {@link PshControlAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type DropdownAppearance = PshControlAppearance;

/**
 * Variantes disponibles pour le dropdown
 */
/**
 * @deprecated since 7.0.0 — use {@link PshColor}. Every component now shares one
 * semantic colour union, so this alias exists only to ease the migration.
 */
export type DropdownVariant = PshColor;

/** See {@link ButtonColor}: same colour-by-appearance matrix, same temporary subset. */
export type DropdownColor = Exclude<PshColor, 'info' | 'neutral'>;

/**
 * Tailles disponibles pour le dropdown
 */
export type DropdownSize = 'small' | 'medium' | 'large';

/**
 * Positions possibles du menu
 */
export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/**
 * Configuration complète du dropdown
 */
export interface DropdownConfig {
  /** Apparence visuelle */
  appearance?: DropdownAppearance;
  /** Variante de couleur — la union restreinte que le composant accepte réellement */
  color?: DropdownColor;
  /** Taille du dropdown */
  size?: DropdownSize;
  /** Position du menu */
  placement?: DropdownPlacement;
  /** État désactivé */
  disabled?: boolean;
  /** Mode icône seule (masque le label et le caret) */
  iconOnly?: boolean;
  /** Texte accessible (aria-label) quand iconOnly est actif */
  iconOnlyText?: string;
  /** Libellé du déclencheur */
  label?: PshConfigValue<string>;
}