import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** A cardinal side an overlay can be placed on, relative to its anchor. */
export type OverlaySide = 'top' | 'bottom' | 'left' | 'right';

/** Options describing the (estimated) overlay size and the gap to the anchor. */
export interface OverlayPositionOptions {
  /** Estimated overlay width in px (used for left/right flipping and align flipping). */
  overlayWidth?: number;
  /** Estimated overlay height in px (used for top/bottom flipping). */
  overlayHeight?: number;
  /** Minimum gap between anchor and overlay in px. */
  offset?: number;
}

/**
 * Shared anchored-positioning primitive with viewport collision detection.
 *
 * Computes whether an overlay (tooltip, dropdown, select panel, menu…) fits on
 * its preferred side of an anchor element and flips it to the opposite side
 * when there is not enough room and the opposite side has more. Based on
 * `getBoundingClientRect`, so it must be called when the anchor is laid out
 * (i.e. in the browser, on open / scroll / resize).
 *
 * This generalises the collision logic that previously lived only inside the
 * tooltip, so dropdown / select / menu popovers can stop overflowing too.
 */
@Injectable({ providedIn: 'root' })
export class PshOverlayPositionService {
  private readonly document = inject(DOCUMENT);

  /**
   * Resolves the best cardinal side for an overlay, flipping `preferred` to its
   * opposite when it would overflow the viewport and the opposite has more room.
   */
  flipSide(
    anchor: HTMLElement,
    preferred: OverlaySide,
    options: OverlayPositionOptions = {},
  ): OverlaySide {
    const view = this.document.defaultView;
    if (!view) return preferred;

    const rect = anchor.getBoundingClientRect();
    const offset = options.offset ?? 8;
    const estH = options.overlayHeight ?? 0;
    const estW = options.overlayWidth ?? 0;

    const space = {
      top: rect.top,
      bottom: view.innerHeight - rect.bottom,
      left: rect.left,
      right: view.innerWidth - rect.right,
    };

    switch (preferred) {
      case 'top':
        return space.top < estH + offset && space.bottom > space.top ? 'bottom' : 'top';
      case 'bottom':
        return space.bottom < estH + offset && space.top > space.bottom ? 'top' : 'bottom';
      case 'left':
        return space.left < estW + offset && space.right > space.left ? 'right' : 'left';
      case 'right':
        return space.right < estW + offset && space.left > space.right ? 'left' : 'right';
    }
  }

  /**
   * Resolves a `"<side>"` or `"<side>-<align>"` placement string (e.g. `top`,
   * `bottom-start`, `top-end`), flipping the side to fit the viewport while
   * preserving the alignment. Unknown placements are returned unchanged.
   *
   * @example
   * ```typescript
   * // Near the bottom of the viewport with no room below:
   * positions.flipPlacement(trigger, 'bottom-start', { overlayHeight: 240 });
   * // => 'top-start'
   * ```
   */
  flipPlacement(
    anchor: HTMLElement,
    preferred: string,
    options: OverlayPositionOptions = {},
  ): string {
    const [sideStr, align] = preferred.split('-');
    if (!this.isSide(sideStr)) return preferred;

    const resolvedSide = this.flipSide(anchor, sideStr, options);
    return align ? `${resolvedSide}-${align}` : resolvedSide;
  }

  private isSide(value: string | undefined): value is OverlaySide {
    return value === 'top' || value === 'bottom' || value === 'left' || value === 'right';
  }
}
