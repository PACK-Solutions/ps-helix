import { computed, Injectable, signal } from '@angular/core';

/** A handle for a registered overlay layer. */
export interface OverlayHandle {
  /** Unique id of the layer, used to release it. */
  readonly id: number;
  /** z-index assigned to this layer (higher = on top). */
  readonly zIndex: number;
}

/**
 * Central overlay stacking authority.
 *
 * Hands out monotonically increasing z-indexes so that stacked overlays
 * (modals, dropdowns, tooltips, popovers…) always layer in open order, and
 * exposes which layer is on top. This replaces per-component, ad-hoc z-index
 * management. The counter resets once every layer is released, keeping z-index
 * values bounded.
 *
 * @example
 * ```typescript
 * private overlay = inject(PshOverlayService);
 * // on open:
 * this.handle = this.overlay.push();      // { id, zIndex }
 * // on close:
 * this.overlay.remove(this.handle.id);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class PshOverlayService {
  /** z-index of the first (bottom) overlay layer. */
  private readonly baseZIndex = 1000;
  /** z-index increment between stacked layers. */
  private readonly step = 10;

  private sequence = 0;
  private readonly stack = signal<readonly number[]>([]);

  /** Number of currently-open overlay layers. */
  readonly activeCount = computed(() => this.stack().length);

  /**
   * Registers a new topmost overlay layer.
   * @returns a handle with a unique id and the z-index to apply.
   */
  push(): OverlayHandle {
    const id = ++this.sequence;
    this.stack.update(layers => [...layers, id]);
    return { id, zIndex: this.baseZIndex + (this.sequence - 1) * this.step };
  }

  /** Releases a previously registered layer. */
  remove(id: number): void {
    this.stack.update(layers => layers.filter(layer => layer !== id));
    if (this.stack().length === 0) {
      this.sequence = 0;
    }
  }

  /** Returns true if the given layer is currently on top of the stack. */
  isTopmost(id: number): boolean {
    const layers = this.stack();
    return layers.length > 0 && layers[layers.length - 1] === id;
  }
}
