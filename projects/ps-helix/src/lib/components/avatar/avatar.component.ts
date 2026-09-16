import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSize, AvatarShape, AvatarStatus } from './avatar.types';

// Default configuration
const DEFAULT_CONFIG = {
  size: 'medium' as AvatarSize,
  shape: 'circle' as AvatarShape,
  alt: 'User avatar',
  icon: 'user'
};

// Default status colors
const DEFAULT_STATUS_COLORS: Record<AvatarStatus, string> = {
  online: 'var(--psh-success-color)',
  offline: 'var(--psh-surface-400)',
  away: 'var(--psh-warning-color)',
  busy: 'var(--psh-danger-color)'
};

@Component({
  selector: 'psh-avatar',
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshAvatarComponent {

  // Model inputs with defaults
  size = input<AvatarSize>(DEFAULT_CONFIG.size);
  shape = input<AvatarShape>(DEFAULT_CONFIG.shape);
  src = input<string | undefined>();
  alt = input<string>(DEFAULT_CONFIG.alt);

  // Regular inputs
  initials = input('');
  icon = input<string>(DEFAULT_CONFIG.icon);
  status = input<AvatarStatus | undefined>();
  ariaLabel = input<string>();
  /** Makes the avatar interactive: adds a button role, a tab stop and a focus ring. */
  interactive = input(false);

  /**
   * Emitted on click or Enter/Space, but only when `interactive` is set.
   *
   * Every other clickable component in the library had one — card, stat-card, info-card,
   * horizontal-card, tag, button — and the avatar did not, so a clickable user avatar, which
   * is most of them, had to be wrapped in something else.
   */
  readonly clicked = output<MouseEvent | KeyboardEvent>();

  /**
   * Emitted when the image fails to load, just before the fallback takes over.
   *
   * Named `imageFailed`, not `error`: `error` is a native DOM event name — lint catches it,
   * and rightly, since `sidebar.toggle` needed a standing exemption for the same reason until
   * 7.0.0 — and `error` already means "the validation message" on every form control here.
   * `copyFailed` on info-card set the precedent.
   */
  readonly imageFailed = output<Event>();

  /**
   * Whether the image failed.
   *
   * The initials/icon fallback existed but could never run: the `<img>` had no `(error)`
   * handler, so a 404 left a broken image icon where a name should be. Reset by `effect`
   * when `src` changes, or a new URL would inherit the previous one's failure.
   */
  private readonly loadFailed = signal(false);

  constructor() {
    effect(() => {
      this.src();
      this.loadFailed.set(false);
    });
  }

  // Computed values
  hasImage = computed(() => !!this.src() && !this.loadFailed());
  hasInitials = computed(() => !!this.initials() && !this.hasImage());
  hasIcon = computed(() => !this.hasImage() && !this.hasInitials());

  protected handleImageError(event: Event): void {
    this.loadFailed.set(true);
    this.imageFailed.emit(event);
  }

  protected handleClick(event: MouseEvent): void {
    if (this.interactive()) this.clicked.emit(event);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (!this.interactive()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.clicked.emit(event);
    }
  }

  computedAriaLabel = computed(() => this.ariaLabel() || this.alt());

  statusColor = computed(() => {
    const currentStatus = this.status();
    if (!currentStatus) return undefined;
    return DEFAULT_STATUS_COLORS[currentStatus];
  });

  state = computed(() => this.status() || 'default');
}