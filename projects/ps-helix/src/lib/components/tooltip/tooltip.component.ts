import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  linkedSignal,
  output,
  InjectionToken,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PshOverlayPositionService } from '../../a11y/overlay-position.service';
import { TooltipPosition, TooltipConfig, TooltipVariant } from './tooltip.types';
import { pshUniqueId } from '../../utils/unique-id';

const TOOLTIP_DEFAULTS = {
  variant: 'dark',
  position: 'top',
  showDelay: 200,
  hideDelay: 100,
  maxWidth: 200,
  autoFlip: true,
} satisfies Partial<TooltipConfig>;

export const TOOLTIP_CONFIG = new InjectionToken<Partial<TooltipConfig>>('TOOLTIP_CONFIG', {
  factory: () => TOOLTIP_DEFAULTS,
});

@Component({
  selector: 'psh-tooltip',
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
    '(keydown.escape)': 'hideImmediate()',
    '[style.display]': '"inline-block"',
    '[style.position]': '"relative"',
  }
})
export class PshTooltipComponent implements OnDestroy {
  private config = inject(TOOLTIP_CONFIG) as Required<TooltipConfig>;
  private elementRef = inject(ElementRef);
  private readonly overlayPosition = inject(PshOverlayPositionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  variant = input<TooltipVariant>(this.config.variant ?? 'dark');
  position = input<TooltipPosition>(this.config.position ?? 'top');
  showDelay = input<number>(this.config.showDelay ?? 200);
  hideDelay = input<number>(this.config.hideDelay ?? 100);
  /**
   * Any CSS length: `'200px'`, `'20rem'`, `'min(90vw, 24rem)'`.
   *
   * Was a `number` meaning implicit pixels, while `sidebar.width` and
   * `horizontal-card.sideWidth` were already strings — three treatments for one notion, and
   * this was the one that could not express a relative width.
   */
  maxWidth = input<string>(`${this.config.maxWidth ?? 200}px`);
  autoFlip = input<boolean>(this.config.autoFlip ?? true);

  content = input<string>('');
  disabled = input<boolean>(false);
  id = input<string>(this.generateUniqueId());

  opened = output<void>();
  closed = output<void>();

  isVisible = signal(false);

  /**
   * The side the tooltip is drawn on: the requested one, until collision detection moves it.
   *
   * A `linkedSignal` rather than a `signal` kept in step by an effect — it follows
   * `position()` by construction, and `updatePosition()` overwrites it when `autoFlip` has
   * something to say. The effect that used to do this was a derivation written the long way.
   */
  computedPosition = linkedSignal<TooltipPosition>(() => this.position());

  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private resizeObserver: ResizeObserver | null = null;

  tooltipId = computed(() => `${this.id()}-tooltip`);
  triggerId = computed(() => `${this.id()}-trigger`);

  constructor() {
    // ResizeObserver is a browser-only global, absent from the platform-server runtime.
    // It used to be constructed from ngAfterViewInit, which Angular also runs on the
    // server, so every SSR render of a tooltip threw. afterNextRender moves it out of the
    // render path and the explicit platform check makes the guarantee independent of how
    // render hooks are scheduled in any given environment.
    afterNextRender(() => {
      if (!this.isBrowser || !this.autoFlip()) return;

      this.resizeObserver = new ResizeObserver(() => {
        if (this.isVisible()) {
          this.updatePosition();
        }
      });
      this.resizeObserver.observe(this.elementRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    if (this.showTimeout) clearTimeout(this.showTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  show(): void {
    if (this.disabled()) return;

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (!this.isVisible() && !this.showTimeout) {
      this.showTimeout = setTimeout(() => {
        if (this.autoFlip()) {
          this.updatePosition();
        } else {
          this.computedPosition.set(this.position());
        }
        this.setVisible(true);
        this.showTimeout = null;
      }, this.showDelay());
    }
  }

  hide(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (this.isVisible() && !this.hideTimeout) {
      this.hideTimeout = setTimeout(() => {
        this.setVisible(false);
        this.hideTimeout = null;
      }, this.hideDelay());
    }
  }

  hideImmediate(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.setVisible(false);
  }

  /**
   * The one place visibility changes, and therefore the one place `opened` and `closed` are
   * emitted.
   *
   * They used to come from an effect on `isVisible`, which runs once on creation — so every
   * tooltip on the page emitted `closed` before it had ever been shown. An output is a
   * consequence of a transition, not of a state.
   */
  private setVisible(next: boolean): void {
    if (this.isVisible() === next) return;
    this.isVisible.set(next);
    if (next) this.opened.emit();
    else this.closed.emit();
  }

  private updatePosition(): void {
    // Collision detection / flip is delegated to the shared overlay-position
    // primitive (same logic, now reused by other popovers).
    this.computedPosition.set(
      this.overlayPosition.flipSide(this.elementRef.nativeElement, this.position(), {
        overlayHeight: 40,
        overlayWidth: this.maxWidthInPixels(),
        offset: 12,
      }),
    );
  }

  /**
   * The flip calculation needs a number. A relative length — `50vw`, `min(…)` — cannot be
   * resolved without layout, so it falls back to the 200px the calculation used before;
   * getting the flip slightly wrong is better than not flipping at all.
   */
  private maxWidthInPixels(): number {
    const parsed = Number.parseFloat(this.maxWidth());
    return Number.isFinite(parsed) && this.maxWidth().trim().endsWith('px')
      ? Math.min(parsed, 200)
      : 200;
  }

  private generateUniqueId(): string {
    return pshUniqueId('tooltip');
  }
}
