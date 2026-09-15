import { PshColor, PshSurfaceAppearance } from '../../types/semantic.types';

/**
 * @deprecated since 7.0.0 — use {@link PshColor}. The input is `tagColor`, not
 * `tagVariant`: it colours the tag inside the card, and it now speaks the same
 * vocabulary as every other colour in the library.
 */
export type StatTagVariant = PshColor;

export type StatCardLayout = 'horizontal' | 'vertical';

/**
 * @deprecated since 7.0.0 — use {@link PshSurfaceAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type StatCardVariant = PshSurfaceAppearance;
