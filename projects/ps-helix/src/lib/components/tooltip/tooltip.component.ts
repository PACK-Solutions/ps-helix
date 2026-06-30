import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  output,
  effect,
  InjectionToken,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { PshOverlayPositionService } from '../../a11y/overlay-position.service';
import { TooltipPosition, TooltipConfig, TooltipVariant } from './tooltip.types';

export const TOOLTIP_CONFIG = new InjectionToken<Partial<TooltipConfig>>('TOOLTIP_CONFIG', {
  factory: () => ({
    variant: 'dark',
    position: 'top',
    showDelay: 200,
    hideDelay: 100,
    maxWidth: 200,
    autoFlip: true,
  })
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
export class PshTooltipComponent implements AfterViewInit, OnDestroy {
  private config = inject(TOOLTIP_CONFIG) as Required<TooltipConfig>;
  private elementRef = inject(ElementRef);
  private readonly overlayPosition = inject(PshOverlayPositionService);

  variant = input<TooltipVariant>(this.config.variant ?? 'dark');
  position = input<TooltipPosition>(this.config.position ?? 'top');
  showDelay = input<number>(this.config.showDelay ?? 200);
  hideDelay = input<number>(this.config.hideDelay ?? 100);
  maxWidth = input<number>(this.config.maxWidth ?? 200);
  autoFlip = input<boolean>(this.config.autoFlip ?? true);

  content = input.required<string>();
  disabled = input<boolean>(false);
  id = input<string>(this.generateUniqueId());

  shown = output<void>();
  hidden = output<void>();

  isVisible = signal(false);
  computedPosition = signal<TooltipPosition>('top');

  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private resizeObserver: ResizeObserver | null = null;

  tooltipId = computed(() => `${this.id()}-tooltip`);
  triggerId = computed(() => `${this.id()}-trigger`);

  constructor() {
    effect(() => {
      if (this.isVisible()) {
        this.shown.emit();
      } else {
        this.hidden.emit();
      }
    });

    effect(() => {
      const pos = this.position();
      if (!this.autoFlip()) {
        this.computedPosition.set(pos);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.autoFlip()) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isVisible()) {
          this.updatePosition();
        }
      });
      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
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
        this.isVisible.set(true);
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
        this.isVisible.set(false);
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
    this.isVisible.set(false);
  }

  private updatePosition(): void {
    // Collision detection / flip is delegated to the shared overlay-position
    // primitive (same logic, now reused by other popovers).
    this.computedPosition.set(
      this.overlayPosition.flipSide(this.elementRef.nativeElement, this.position(), {
        overlayHeight: 40,
        overlayWidth: Math.min(this.maxWidth(), 200),
        offset: 12,
      }),
    );
  }

  private generateUniqueId(): string {
    return `psh-tooltip-${Math.random().toString(36).substr(2, 9)}`;
  }
}
