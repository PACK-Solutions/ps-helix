import { PshColor } from '../../types/semantic.types';
export type BadgeSize = 'small' | 'medium' | 'large';
/**
 * @deprecated since 7.0.0 — use {@link PshColor}. Every component now shares one
 * semantic colour union, so this alias exists only to ease the migration.
 */
export type BadgeVariant = PshColor;
export type BadgeDisplayType = 'dot' | 'counter' | 'text';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
/** Application-wide defaults for `psh-badge`, provided through `BADGE_CONFIG`. */
export interface BadgeConfig {
  color: PshColor;
  size: BadgeSize;
  displayType: BadgeDisplayType;
  position: BadgePosition;
  max: number;
  showZero: boolean;
  overlap: boolean;
  disabled: boolean;
}
