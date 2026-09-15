import { PshSurfaceAppearance } from '../../types/semantic.types';
/**
 * @deprecated since 7.0.0 — use {@link PshSurfaceAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type HorizontalCardVariant = PshSurfaceAppearance;

export interface HorizontalCardOptions {
  sideWidth?: string;
  gap?: string;
  sidePadding?: string;
  contentPadding?: string;
  mobileHeight?: string;
}
