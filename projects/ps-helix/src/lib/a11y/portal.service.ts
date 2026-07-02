import { DOCUMENT } from '@angular/common';
import { EmbeddedViewRef, Injectable, TemplateRef, ViewContainerRef, inject } from '@angular/core';

/** A handle to a teleported overlay panel. */
export interface PshPortalRef {
  /** The panel's root element — use it to position and to scope click-outside. */
  readonly panel: HTMLElement;
  /**
   * Positions the panel as `fixed` relative to `anchor`'s viewport rect, on the
   * given side with `gap` px of spacing. Bounds `max-height` to the available
   * viewport space so the panel never overflows the screen.
   */
  position(anchor: HTMLElement, side: 'top' | 'bottom', gap: number): void;
  /**
   * Positions the panel as `fixed` from `anchor`'s viewport rect for a
   * `<side>-<align>` placement (e.g. `bottom-start`, `top-end`). The panel keeps
   * its content width; the aligned edge (start/end) is anchored to the trigger.
   */
  positionByPlacement(anchor: HTMLElement, placement: string, gap: number): void;
  /** Destroys the embedded view and removes the panel from the overlay layer. */
  detach(): void;
}

/**
 * Teleports a `TemplateRef` into a single body-level overlay layer so popover
 * panels (select / dropdown / menu…) escape any ancestor `overflow`, `transform`
 * or stacking context and can layer above modals.
 *
 * A lightweight, CDK-free "manual portal": the embedded view is created from the
 * consumer's `ViewContainerRef` (so it stays in that component's change-detection
 * tree and keeps its bindings reactive), then its root nodes are moved into the
 * shared `.psh-overlay-layer`. The layer is `position: fixed; inset: 0;
 * pointer-events: none` at `z-index: var(--z-index-overlay)`; panels re-enable
 * pointer events. The layer is created lazily and removed once empty.
 */
@Injectable({ providedIn: 'root' })
export class PshPortalService {
  private readonly document = inject(DOCUMENT);
  private layer: HTMLElement | null = null;
  private count = 0;

  /** Teleports `tpl` into the overlay layer and returns a handle to control it. */
  attach(tpl: TemplateRef<unknown>, vcr: ViewContainerRef): PshPortalRef {
    const layer = this.ensureLayer();
    const viewRef = vcr.createEmbeddedView(tpl);
    viewRef.detectChanges();

    const nodes = viewRef.rootNodes as Node[];
    const panel = (nodes.find((n): n is HTMLElement => n instanceof HTMLElement) ??
      nodes[0]) as HTMLElement;
    nodes.forEach(node => layer.appendChild(node));

    this.count++;

    return {
      panel,
      position: (anchor, side, gap) => this.position(panel, anchor, side, gap),
      positionByPlacement: (anchor, placement, gap) =>
        this.positionByPlacement(panel, anchor, placement, gap),
      detach: () => this.detach(viewRef),
    };
  }

  private position(
    panel: HTMLElement,
    anchor: HTMLElement,
    side: 'top' | 'bottom',
    gap: number,
  ): void {
    const view = this.document.defaultView;
    if (!view) return;

    const rect = anchor.getBoundingClientRect();
    const style = panel.style;
    style.position = 'fixed';
    style.left = `${rect.left}px`;
    style.width = `${rect.width}px`;

    if (side === 'top') {
      const height = panel.offsetHeight;
      style.top = `${Math.max(gap, rect.top - height - gap)}px`;
      style.maxHeight = `${Math.max(0, rect.top - gap * 2)}px`;
    } else {
      style.top = `${rect.bottom + gap}px`;
      style.maxHeight = `${Math.max(0, view.innerHeight - rect.bottom - gap * 2)}px`;
    }
  }

  private positionByPlacement(
    panel: HTMLElement,
    anchor: HTMLElement,
    placement: string,
    gap: number,
  ): void {
    const view = this.document.defaultView;
    if (!view) return;

    const rect = anchor.getBoundingClientRect();
    const [side, align] = placement.split('-');
    const style = panel.style;
    style.position = 'fixed';

    if (side === 'top') {
      const height = panel.offsetHeight;
      style.top = `${Math.max(gap, rect.top - height - gap)}px`;
      style.maxHeight = `${Math.max(0, rect.top - gap * 2)}px`;
    } else {
      style.top = `${rect.bottom + gap}px`;
      style.maxHeight = `${Math.max(0, view.innerHeight - rect.bottom - gap * 2)}px`;
    }

    // Content-sized menu: anchor the start/end edge to the trigger.
    if (align === 'end') {
      style.left = `${Math.max(0, rect.right - panel.offsetWidth)}px`;
    } else {
      style.left = `${rect.left}px`;
    }
  }

  private detach(viewRef: EmbeddedViewRef<unknown>): void {
    viewRef.destroy();
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0 && this.layer) {
      this.layer.remove();
      this.layer = null;
    }
  }

  private ensureLayer(): HTMLElement {
    if (this.layer) return this.layer;
    const layer = this.document.createElement('div');
    layer.className = 'psh-overlay-layer';
    layer.style.cssText =
      'position:fixed;inset:0;z-index:var(--z-index-overlay);pointer-events:none;';
    this.document.body.appendChild(layer);
    this.layer = layer;
    return layer;
  }
}
