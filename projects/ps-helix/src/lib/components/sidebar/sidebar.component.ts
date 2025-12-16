import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  effect,
  OnDestroy,
  InjectionToken
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMode, SidebarPosition, SidebarConfig } from './sidebar.types';

export const SIDEBAR_CONFIG = new InjectionToken<Partial<SidebarConfig>>('SIDEBAR_CONFIG', {
  factory: () => ({
    mode: 'fixed',
    position: 'left',
    width: '250px',
    breakpoint: '768px',
    autoFocus: true,
    ariaLabel: 'Sidebar navigation'
  })
});

@Component({
  selector: 'psh-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'complementary',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-hidden]': '!open()',
    '[attr.aria-expanded]': 'open()',
    '[attr.aria-modal]': 'effectiveMode() === "overlay" && open()',
    '[attr.data-state]': 'state()'
  }
})
export class PshSidebarComponent implements OnDestroy {
  private config = inject(SIDEBAR_CONFIG);
  private elementRef = inject(ElementRef);
  private focusedElementBeforeOpen: HTMLElement | null = null;

  // Model inputs with defaults from config
  open = model(false);
  mode = model<SidebarMode>(this.config.mode ?? 'fixed');
  position = model<SidebarPosition>(this.config.position ?? 'left');
  width = model<string>(this.config.width ?? '250px');
  breakpoint = model<string>(this.config.breakpoint ?? '768px');

  // Regular inputs
  autoFocus = input<boolean>(this.config.autoFocus ?? true);
  ariaLabel = input<string>(this.config.ariaLabel ?? 'Sidebar navigation');

  // Outputs
  toggle = output<boolean>();
  opened = output<void>();
  closed = output<void>();
  transitionStart = output<boolean>();

  // State
  private mobileSignal = signal(false);
  private overlayModeSignal = signal(false);

  // Computed values
  isMobile = computed(() => this.mobileSignal());
  isOverlayMode = computed(() => this.overlayModeSignal());
  effectiveMode = computed(() => 
    this.isMobile() ? 'overlay' : this.mode()
  );

  state = computed(() => this.getState());

  private getState(): string {
    if (this.isMobile()) return 'mobile';
    if (this.open()) return 'open';
    return this.mode();
  }

  constructor() {
    effect(() => {
      const mediaQuery = window.matchMedia(`(max-width: ${this.breakpoint()})`);
      const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
        this.mobileSignal.set(e.matches);
        this.overlayModeSignal.set(e.matches || this.mode() === 'overlay');
      };

      handleResize(mediaQuery);
      const listener = (e: MediaQueryListEvent) => handleResize(e);
      mediaQuery.addEventListener('change', listener);

      return () => mediaQuery.removeEventListener('change', listener);
    });

    effect(() => {
      if (this.open()) {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape' && this.isOverlayMode()) {
            this.closeSidebar();
          }
          if (event.key === 'Tab') {
            this.trapFocus(event);
          }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
      return;
    });

    effect(() => {
      if (this.open() && this.isOverlayMode()) {
        const handleClickOutside = (event: MouseEvent) => {
          if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeSidebar();
          }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
      }
      return;
    });
  }

  toggleSidebar(): void {
    const newState = !this.open();
    this.transitionStart.emit(newState);
    this.open.set(newState);
    this.toggle.emit(newState);

    if (newState) {
      this.focusedElementBeforeOpen = document.activeElement as HTMLElement;
      if (this.autoFocus()) {
        requestAnimationFrame(() => {
          const firstFocusable = this.elementRef.nativeElement.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          if (firstFocusable) {
            firstFocusable.focus();
          }
        });
      }
      requestAnimationFrame(() => {
        this.opened.emit();
      });
    } else {
      if (this.focusedElementBeforeOpen) {
        this.focusedElementBeforeOpen.focus();
      }
      requestAnimationFrame(() => {
        this.closed.emit();
      });
    }
  }

  closeSidebar(): void {
    if (this.open()) {
      this.transitionStart.emit(false);
      this.open.set(false);
      this.toggle.emit(false);
      if (this.focusedElementBeforeOpen) {
        this.focusedElementBeforeOpen.focus();
      }
      requestAnimationFrame(() => {
        this.closed.emit();
      });
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusableElements = this.elementRef.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.focusedElementBeforeOpen) {
      this.focusedElementBeforeOpen = null;
    }
  }
}