import { PshColor, PshControlAppearance } from '../../types/semantic.types';
import { PshConfigValue } from '../../utils/config-value';
/**
 * Apparences disponibles pour le bouton
 */
/**
 * @deprecated since 7.0.0 — use {@link PshControlAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type ButtonAppearance = PshControlAppearance;

/**
 * Variantes disponibles pour le bouton
 */
/**
 * @deprecated since 7.0.0 — use {@link PshColor}. Every component now shares one
 * semantic colour union, so this alias exists only to ease the migration.
 */
export type ButtonVariant = PshColor;

/**
 * The colours button currently renders. `info` and `neutral` are part of {@link PshColor}
 * but button's colour matrix is crossed with its three appearances and guarded by
 * `:not()` chains that the appearance rework replaces; extending it here would mean
 * writing into a structure that is about to change. Typed as a subset rather than
 * accepting a value that would fall through to the default styling.
 */
export type ButtonColor = Exclude<PshColor, 'info' | 'neutral'>;

/**
 * Tailles disponibles pour le bouton
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Positions possibles de l'icône
 */
export type ButtonIconPosition = 'left' | 'right' | 'only';
/** Application-wide defaults for `psh-button`, provided through `BUTTON_CONFIG`. */
export interface ButtonConfig {
  appearance: ButtonAppearance;
  color: ButtonColor;
  size: ButtonSize;
  type: 'button' | 'submit' | 'reset';
  iconPosition: ButtonIconPosition;
  fullWidth: boolean;
  /** Announced while `loading` is set. */
  loadingText: PshConfigValue<string>;
  /** Announced while `disabled` is set. */
  disabledText: PshConfigValue<string>;
}
