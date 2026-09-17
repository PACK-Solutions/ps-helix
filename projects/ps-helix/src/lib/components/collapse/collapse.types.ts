import { PshSurfaceAppearance } from '../../types/semantic.types';
/**
 * Variantes disponibles pour le collapse
 */
/**
 * @deprecated since 7.0.0 — use {@link PshSurfaceAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type CollapseVariant = PshSurfaceAppearance;

/**
 * Tailles disponibles pour le collapse
 */
export type CollapseSize = 'small' | 'medium' | 'large';
/** Application-wide defaults for `psh-collapse`, provided through `COLLAPSE_CONFIG`. */
export interface CollapseConfig {
  appearance: CollapseVariant;
  size: CollapseSize;
  icon: string;
  /** `auto` measures the content; any CSS length caps it. */
  maxHeight: string;
  /** Accessible name used when the header has no text of its own. */
  defaultHeaderText: string;
  disableAnimation: boolean;
}
