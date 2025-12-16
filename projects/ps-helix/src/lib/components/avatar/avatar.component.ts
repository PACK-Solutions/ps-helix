import { ChangeDetectionStrategy, Component, computed, input, model, inject } from '@angular/core';
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
  online: 'var(--success-color)',
  offline: 'var(--surface-400)',
  away: 'var(--warning-color)',
  busy: 'var(--danger-color)'
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
  size = model<AvatarSize>(DEFAULT_CONFIG.size);
  shape = model<AvatarShape>(DEFAULT_CONFIG.shape);
  src = model<string | undefined>();
  alt = model<string>(DEFAULT_CONFIG.alt);

  // Regular inputs
  initials = input('');
  icon = input<string>(DEFAULT_CONFIG.icon);
  status = input<AvatarStatus | undefined>();
  ariaLabel = input<string>();

  // Computed values
  hasImage = computed(() => !!this.src());
  hasInitials = computed(() => !!this.initials() && !this.hasImage());
  hasIcon = computed(() => !this.hasImage() && !this.hasInitials());

  computedAriaLabel = computed(() => this.ariaLabel() || this.alt());

  statusColor = computed(() => {
    const currentStatus = this.status();
    if (!currentStatus) return undefined;
    return DEFAULT_STATUS_COLORS[currentStatus];
  });

  state = computed(() => this.status() || 'default');
}