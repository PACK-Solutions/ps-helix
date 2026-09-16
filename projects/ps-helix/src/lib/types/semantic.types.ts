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
 * Surface treatment — how a component is drawn, independent of what colour it is.
 *
 * `variant` used to carry three incompatible notions at once: elevation on card and
 * table, colour on badge and button, display form on tabs and stepper. Colour moved to
 * {@link PshColor}; surface treatment lives here.
 *
 *   solid     filled with its colour            (was `filled`)
 *   soft      tinted background, same hue
 *   outline   border only                       (was `outline` / `outlined`)
 *   ghost     no border and no fill             (was `text`)
 *   elevated  raised with a shadow
 *   flat      no elevation, no border           (was `default`)
 *
 * Each component declares the subset it supports; the words mean the same thing in all of
 * them. `variant` survives only where the notion is a genuinely component-specific display
 * form that is neither colour nor surface — tabs (`underline | pills`), stepper
 * (`numbered | progress`), menu (`compact | expanded`), spinloader (`circle | dots |
 * pulse`), tooltip (`light | dark`). It is no longer a catch-all.
 */
export type PshAppearance = 'solid' | 'soft' | 'outline' | 'ghost' | 'elevated' | 'flat';

/** The appearances a control (button, dropdown) offers. */
export type PshControlAppearance = Extract<PshAppearance, 'solid' | 'outline' | 'ghost'>;

/** The appearances a text field (input, select, textarea) offers. */
export type PshFieldAppearance = Extract<PshAppearance, 'outline' | 'solid'>;

/** The appearances a surface (card, table, collapse, pagination) offers. */
export type PshSurfaceAppearance = Extract<PshAppearance, 'flat' | 'elevated' | 'outline'>;

/**
 * Size. Already homogeneous across all 30 components before 7.0.0 — the one axis that was
 * never inconsistent — and deliberately left alone.
 */
export type PshSize = 'small' | 'medium' | 'large';

export const PSH_SIZES: readonly PshSize[] = ['small', 'medium', 'large'] as const;

/* ------------------------------------------------------------- navigation */

/**
 * Why a navigation was refused.
 *
 * Before 7.0.0 the reason was an English sentence — `"Page 12 is out of bounds (1-9)"`,
 * `"Cannot activate step 3. Please complete previous steps first"`. A consumer who needed to
 * react differently to "out of range" and "your guard said no" had to match on that prose,
 * which is neither stable nor translatable. Branch on this instead.
 */
export type PshNavigationErrorReason =
  /** The requested page or step index is outside the valid range. */
  | 'out-of-bounds'
  /** A `beforeChange` guard returned false. */
  | 'blocked'
  /** A `beforeChange` guard threw. The error is in `cause`. */
  | 'rejected'
  /** An earlier step has not been completed. */
  | 'prerequisite-incomplete';

/**
 * Emitted when a component refuses to navigate.
 *
 * One shape for the three components that report this. `pagination` used to emit
 * `{ action, reason }` and `stepper` / `state-flow-indicator` a bare `string`, so the same
 * output name carried two incompatible payloads.
 */
export interface PshNavigationError {
  /** The navigation that was attempted. */
  action: 'goToPage' | 'goToStep';
  /** Machine-readable cause. Branch on this, never on `message`. */
  reason: PshNavigationErrorReason;
  /** The page or step index that could not be reached. */
  target: number;
  /**
   * English detail, for logs and debugging. Not a user-facing string: it is not translated
   * and its wording is not part of the public contract.
   */
  message: string;
  /**
   * For `reason: 'rejected'`, whatever the guard threw. `unknown` is the honest type —
   * JavaScript can throw anything — and it mirrors `Error.cause`.
   */
  cause?: unknown;
}
