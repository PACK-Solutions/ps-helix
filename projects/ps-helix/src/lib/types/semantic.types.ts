/**
 * The vocabulary every ps-helix component shares.
 *
 * Before 7.0.0 one notion — "which semantic colour is this?" — was spelled six different
 * ways: `variant` on badge, button, dropdown, progressbar and tag; `color` on spinloader;
 * `type` on alert and toast; `colorVariant` on card; `tagVariant` on stat-card; and `tone`
 * on info-card rows. Each carried its own union, so `info` existed on five components and
 * not on the other six. Asking for red meant remembering which component you were holding.
 *
 * There is now one name and one union.
 */

/**
 * Semantic colour. The same seven values on every component that has a colour, so
 * `color="danger"` means the same thing wherever it appears.
 *
 * `neutral` replaces the assorted `default` and `muted` values that used to mean
 * "no semantic emphasis".
 */
export type PshColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

/** Every value of {@link PshColor}, for iterating in demos, tests and documentation. */
export const PSH_COLORS: readonly PshColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
] as const;

/**
 * Size. Already homogeneous across all 30 components before 7.0.0 — the one axis that was
 * never inconsistent — and deliberately left alone.
 */
export type PshSize = 'small' | 'medium' | 'large';

export const PSH_SIZES: readonly PshSize[] = ['small', 'medium', 'large'] as const;
