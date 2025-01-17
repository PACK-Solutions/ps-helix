import { Directive, OnInit, inject } from '@angular/core';
import { LibBadgeComponent } from './badge.component';
import { BADGE_CONFIG } from './badge.config';

/**
 * Directive pour appliquer une configuration par défaut à un badge
 */
@Directive({
  selector: '[libDefaultBadge]',
  standalone: true
})
export class DefaultBadgeDirective implements OnInit {
  private config = inject(BADGE_CONFIG);
  private badge = inject(LibBadgeComponent);

  constructor() {
    // Définir immédiatement la variante requise dans le constructeur
    this.badge.variant.set(this.config.variant ?? 'primary');
  }

  ngOnInit() {
    // Appliquer le reste de la configuration par défaut
    if (this.config.size) this.badge.size.set(this.config.size);
    if (this.config.displayType) this.badge.displayType.set(this.config.displayType);
    if (this.config.max !== undefined) this.badge.max.set(this.config.max);
    if (this.config.showZero !== undefined) this.badge.showZero.set(this.config.showZero);
    if (this.config.position) this.badge.position.set(this.config.position);
  }
}