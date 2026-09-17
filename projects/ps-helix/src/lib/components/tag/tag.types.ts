import { PshColor } from '../../types/semantic.types';
import { PshConfigValue } from '../../utils/config-value';
/**
 * Variantes disponibles pour le tag
 */
/**
 * @deprecated since 7.0.0 — use {@link PshColor}. Every component now shares one
 * semantic colour union, so this alias exists only to ease the migration.
 */
export type TagVariant = PshColor;

/**
 * Tailles disponibles pour le tag
 */
export type TagSize = 'small' | 'medium' | 'large';

/**
 * Configuration complète d'un tag
 */
export interface TagConfig {
  color: TagVariant;
  size: TagSize;
  icon?: string;
  closable: boolean;
  disabled: boolean;
  interactive?: boolean;
  closeLabel?: PshConfigValue<string>;
}