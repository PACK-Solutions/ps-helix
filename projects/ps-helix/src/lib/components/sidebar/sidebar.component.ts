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
  InjectionToken,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { SidebarMode, SidebarPosition, SidebarConfig } from './sidebar.types';

export const SIDEBAR_CONFIG = new InjectionToken<Partial<SidebarConfig>>('SIDEBAR_CONFIG', {
  factory: () => ({
    mode: 'fixed',
    position: 'left',
    width: '250px',
    breakpoint: '768px',
    autoFocus: true,
    ariaLabel: 'Sidebar navigation',
    closeOnBackdrop: true,
    closeOnEscape: true
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
  private readonly config = inject(SIDEBAR_CONFIG);
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private focusedElementBeforeOpen: HTMLElement | null = null;
  private mediaQueryList: MediaQueryList | null = null;
  private mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

  open = model(false);
  mode = input<SidebarMode>(this.config.mode ?? 'fixed');
  position = input<SidebarPosition>(this.config.position ?? 'left');
  width = input<string>(this.config.width ?? '250px');
  breakpoint = input<string>(this.config.breakpoint ?? '768px');
  autoFocus = input<boolean>(this.config.autoFocus ?? true);
  ariaLabel = input<string>(this.config.ariaLabel ?? 'Sidebar navigation');
  closeOnBackdrop = input<boolean>(this.config.closeOnBackdrop ?? true);
  closeOnEscape = input<boolean>(this.config.closeOnEscape ?? true);

  toggle = output<boolean>();
  opened = output<void>();
  closed = output<void>();
  transitionStart = output<boolean>();

  private readonly mobileSignal = signal(false);
  private previousOpenState: boolean | null = null;

  isMobile = computed(() => this.mobileSignal());
  effectiveMode = computed(() => this.isMobile() ? 'overlay' : this.mode());
  state = computed(() => this.getState());

  private readonly escapeHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.closeOnEscape() && this.effectiveMode() === 'overlay') {
      this.closeSidebar();
    }
  };

  private readonly focusTrapHandler = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  };

  private getState(): string {
    if (this.isMobile()) return 'mobile';
    if (this.open()) return 'open';
    return this.mode();
  }

  constructor() {
    effect(() => {
      const bp = this.breakpoint();
      this.setupMediaQuery(bp);
    });

    effect(() => {
      const isOpen = this.open();
      const wasOpen = this.previousOpenState;
      this.previousOpenState = isOpen;

      if (wasOpen === null) return;

      if (isOpen && !wasOpen) {
        this.onSidebarOpen();
      } else if (!isOpen && wasOpen) {
        this.onSidebarClose();
      }
    });
  }

  private setupMediaQuery(breakpoint: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.cleanupMediaQuery();

    this.mediaQueryList = window.matchMedia(`(max-width: ${breakpoint})`);
    this.mobileSignal.set(this.mediaQueryList.matches);

    this.mediaQueryHandler = (e: MediaQueryListEvent) => {
      this.mobileSignal.set(e.matches);
    };

    this.mediaQueryList.addEventListener('change', this.mediaQueryHandler);
  }

  private cleanupMediaQuery(): void {
    if (this.mediaQueryList && this.mediaQueryHandler) {
      this.mediaQueryList.removeEventListener('change', this.mediaQueryHandler);
      this.mediaQueryList = null;
      this.mediaQueryHandler = null;
    }
  }

  private onSidebarOpen(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.focusedElementBeforeOpen = document.activeElement as HTMLElement;
    this.addEventListeners();

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
  }

  private onSidebarClose(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.removeEventListeners();

    if (this.focusedElementBeforeOpen) {
      this.focusedElementBeforeOpen.focus();
    }

    requestAnimationFrame(() => {
      this.closed.emit();
    });
  }

  private addEventListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.addEventListener('keydown', this.escapeHandler);
    document.addEventListener('keydown', this.focusTrapHandler);
  }

  private removeEventListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.removeEventListener('keydown', this.escapeHandler);
    document.removeEventListener('keydown', this.focusTrapHandler);
  }

  toggleSidebar(): void {
    const newState = !this.open();
    this.transitionStart.emit(newState);
    this.open.set(newState);
    this.toggle.emit(newState);
  }

  closeSidebar(): void {
    if (this.open()) {
      this.transitionStart.emit(false);
      this.open.set(false);
      this.toggle.emit(false);
    }
  }

  handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.closeSidebar();
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusableElements = this.elementRef.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (!firstFocusable || !lastFocusable) return;

    if (!isPlatformBrowser(this.platformId)) return;

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
    this.cleanupMediaQuery();
    this.removeEventListeners();
    this.focusedElementBeforeOpen = null;
  }
}
