import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { pshResolveConfigValue } from '../../utils/config-value';
import { isPlatformBrowser, CommonModule, DOCUMENT } from '@angular/common';
import { PshFocusTrapDirective } from '../../a11y/focus-trap.directive';
import { SidebarMode, SidebarPosition, SidebarConfig } from './sidebar.types';

const SIDEBAR_DEFAULTS = {
  mode: 'fixed',
  position: 'left',
  width: '250px',
  breakpoint: '768px',
  autoFocus: true,
  ariaLabel: 'Sidebar navigation',
  closeOnBackdrop: true,
  closeOnEscape: true
} satisfies Partial<SidebarConfig>;

export const SIDEBAR_CONFIG = new InjectionToken<Partial<SidebarConfig>>('SIDEBAR_CONFIG', {
  factory: () => SIDEBAR_DEFAULTS,
});

@Component({
  selector: 'psh-sidebar',
  imports: [CommonModule, PshFocusTrapDirective],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // `complementary` allows neither aria-expanded nor aria-modal. aria-expanded belongs
    // on the trigger outside this component; aria-modal only exists on a dialog, which is
    // exactly what an open overlay sidebar is — so the role follows the mode.
    '[attr.role]': 'effectiveMode() === "overlay" ? "dialog" : "complementary"',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-hidden]': '!open()',
    '[attr.aria-modal]': 'effectiveMode() === "overlay" && open() ? "true" : null',
    '[attr.inert]': 'open() ? null : ""',
    '[attr.data-state]': 'state()'
  }
})
export class PshSidebarComponent implements OnDestroy {
  private readonly config = inject(SIDEBAR_CONFIG);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private mediaQueryList: MediaQueryList | null = null;
  private pendingFrame: number | null = null;
  private mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

  open = model(false);
  mode = input<SidebarMode>(this.config.mode ?? 'fixed');
  position = input<SidebarPosition>(this.config.position ?? 'left');
  width = input<string>(this.config.width ?? '250px');
  breakpoint = input<string>(this.config.breakpoint ?? '768px');
  autoFocus = input<boolean>(this.config.autoFocus ?? true);
  ariaLabelInput = input<string | undefined>(undefined, { alias: 'ariaLabel' });
  ariaLabel = computed(
    () => this.ariaLabelInput() ?? pshResolveConfigValue(this.config.ariaLabel) ?? 'Sidebar navigation',
  );
  closeOnBackdrop = input<boolean>(this.config.closeOnBackdrop ?? true);
  closeOnEscape = input<boolean>(this.config.closeOnEscape ?? true);

  // Was `toggle`, the only infinitive output in the library and a native event name, which
  // needed an eslint exemption to exist. `toggled` matches collapse — same idea, same word —
  // and the clash is gone with it.
  toggled = output<boolean>();
  opened = output<void>();
  closed = output<void>();
  transitionStarted = output<boolean>();

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

    const view = this.document.defaultView;
    if (!view) return;

    this.mediaQueryList = view.matchMedia(`(max-width: ${breakpoint})`);
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
    // Focus trap + initial focus + focus restoration are handled by
    // PshFocusTrapDirective on the .sidebar element (see the template).
    this.addEventListeners();

    this.scheduleEmit(() => this.opened.emit());
  }

  private onSidebarClose(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.removeEventListeners();

    this.scheduleEmit(() => this.closed.emit());
  }

  /**
   * Defers an emit by one frame so listeners see the panel after it has been laid out.
   * The handle is kept so a pending frame cannot fire from a destroyed component.
   */
  private scheduleEmit(emit: () => void): void {
    const view = this.document.defaultView;
    if (!view) return;

    if (this.pendingFrame !== null) view.cancelAnimationFrame(this.pendingFrame);
    this.pendingFrame = view.requestAnimationFrame(() => {
      this.pendingFrame = null;
      emit();
    });
  }

  private addEventListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.document.addEventListener('keydown', this.escapeHandler);
  }

  private removeEventListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.document.removeEventListener('keydown', this.escapeHandler);
  }

  toggleSidebar(): void {
    const newState = !this.open();
    this.transitionStarted.emit(newState);
    this.open.set(newState);
    this.toggled.emit(newState);
  }

  closeSidebar(): void {
    if (this.open()) {
      this.transitionStarted.emit(false);
      this.open.set(false);
      this.toggled.emit(false);
    }
  }

  handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.closeSidebar();
    }
  }

  ngOnDestroy(): void {
    this.cleanupMediaQuery();
    this.removeEventListeners();

    if (this.pendingFrame !== null) {
      this.document.defaultView?.cancelAnimationFrame(this.pendingFrame);
      this.pendingFrame = null;
    }
  }
}
