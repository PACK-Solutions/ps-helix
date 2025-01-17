import { Directive, OnInit, inject } from '@angular/core';
import { LibAvatarComponent } from './avatar.component';
import { AVATAR_CONFIG } from './avatar.config';

/**
 * Directive pour appliquer une configuration par défaut à un avatar
 */
@Directive({
  selector: '[libDefaultAvatar]',
  standalone: true
})
export class DefaultAvatarDirective implements OnInit {
  private config = inject(AVATAR_CONFIG);
  private avatar = inject(LibAvatarComponent);

  ngOnInit() {
    // Appliquer la configuration par défaut
    this.avatar.size.set(this.config.size ?? 'medium');
    this.avatar.shape.set(this.config.shape ?? 'circle');
    this.avatar.alt.set(this.config.alt ?? '');
  }
}