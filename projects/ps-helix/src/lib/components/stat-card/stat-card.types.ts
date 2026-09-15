import { PshColor } from '../../types/semantic.types';

/**
 * @deprecated since 7.0.0 — use {@link PshColor}. The input is `tagColor`, not
 * `tagVariant`: it colours the tag inside the card, and it now speaks the same
 * vocabulary as every other colour in the library.
 */
export type StatTagVariant = PshColor;

export type StatCardLayout = 'horizontal' | 'vertical';

export type StatCardVariant = 'default' | 'elevated' | 'outlined';
