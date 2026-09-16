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

/** Application-wide defaults for `psh-horizontal-card`, provided through `HORIZONTAL_CARD_CONFIG`. */
export interface HorizontalCardConfig {
  appearance: HorizontalCardVariant;
  hoverable: boolean;
  interactive: boolean;
  sideWidth: string;
  gap: string;
  sidePadding: string;
  contentPadding: string;
  mobileHeight: string;
}
