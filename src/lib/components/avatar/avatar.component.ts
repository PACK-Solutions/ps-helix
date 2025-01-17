import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarSize, AvatarShape, AvatarStatus } from './avatar.types';
import { AvatarService } from './avatar.service';
import { AVATAR_CONFIG } from './avatar.config';

@Component({
  selector: 'lib-avatar',
  standalone: true,
    imports: [CommonModule, TranslateModule, NgOptimizedImage],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AvatarService]
})
export class LibAvatarComponent {
  private avatarService = inject(AvatarService);
  private config = inject(AVATAR_CONFIG);
  
  // Model inputs with defaults from config
  size = model<AvatarSize>(this.config.size ?? 'medium'); 
  shape = model<AvatarShape>(this.config.shape ?? 'circle'); 
  src = model<string | undefined>();
  alt = model<string>(this.config.alt ?? '');

  // Regular inputs
  initials = input('');
  icon = input<string>('user');
  status = input<AvatarStatus>();
  ariaLabel = input<string>();

  // Outputs
  sizeChange = output<AvatarSize>();
  shapeChange = output<AvatarShape>();

  // Computed values using service
  hasImage = computed(() => !!this.src());
  hasInitials = computed(() => !!this.initials() && !this.hasImage());
  hasIcon = computed(() => !this.hasImage() && !this.hasInitials());

  computedAriaLabel = computed(() => 
    this.ariaLabel() || this.alt() || 'User avatar'
  );

  statusColor = computed(() => 
    this.status() ? this.avatarService.getStatusColor(this.status()!) : undefined
  );

  customStyles = computed(() => {
    const styles = this.avatarService.getCustomStyles();
    return Object.assign({}, ...styles);
  });
}