import type { ButtonAppearance, ButtonVariant } from '../button/button.types';

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
 * Apparences disponibles pour le dropdown.
 *
 * Axe partage avec `psh-button` : decrit uniquement le style de remplissage
 * du trigger (plein, contour, plat). La couleur semantique est portee par
 * `DropdownVariant`.
 */
export type DropdownAppearance = ButtonAppearance;

/**
 * Variantes semantiques du dropdown (couleur d'intention).
 *
 * Axe partage avec `psh-button` pour garantir une API coherente entre tous
 * les composants cliquables du design system.
 */
export type DropdownVariant = ButtonVariant;

/**
 * Tailles disponibles pour le dropdown
 */
export type DropdownSize = 'small' | 'medium' | 'large';

/**
 * Positions possibles du menu
 */
export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/**
 * Placement de l'icône dans le trigger du dropdown.
 * - `'left'` (défaut) : icône avant le label, suivie de la flèche caret.
 * - `'only'` : rend un bouton carré sans label ni caret. `icon` est requis
 *   et `ariaLabel` est obligatoire pour respecter WCAG 4.1.2.
 */
export type DropdownIconPosition = 'left' | 'only';

/**
 * Configuration complète du dropdown
 */
export interface DropdownConfig {
  /** Apparence visuelle (forme / remplissage) */
  appearance?: DropdownAppearance;
  /** Variante semantique (couleur d'intention) */
  variant?: DropdownVariant;
  /** Taille du dropdown */
  size?: DropdownSize;
  /** Position du menu */
  placement?: DropdownPlacement;
  /** Placement de l'icône dans le trigger */
  iconPosition?: DropdownIconPosition;
  /** État désactivé */
  disabled?: boolean;
}
