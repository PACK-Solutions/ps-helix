import { Directive, OnInit, inject } from '@angular/core';
import { LibButtonComponent } from './button.component';
import { BUTTON_CONFIG } from './button.config';

/**
 * Directive pour appliquer une configuration par défaut au bouton
 */
@Directive({
  selector: '[libDefaultButton]',
  standalone: true
})
export class DefaultButtonDirective implements OnInit {
  private config = inject(BUTTON_CONFIG);
  private button = inject(LibButtonComponent);

  constructor() {
    // Définir immédiatement la variante requise dans le constructeur
    this.button.variant.set(this.config.variant ?? 'primary');
  }

  ngOnInit() {
    // Appliquer le reste de la configuration par défaut
    if (this.config.size) this.button.size.set(this.config.size);
    if (this.config.iconPosition) this.button.iconPosition.set(this.config.iconPosition);
    if (this.config.disabled !== undefined) this.button.disabled.set(this.config.disabled);
    if (this.config.loading !== undefined) this.button.loading.set(this.config.loading);
    if (this.config.fullWidth !== undefined) this.button.fullWidth.set(this.config.fullWidth);
    if (this.config.showLabel !== undefined) this.button.showLabel.set(this.config.showLabel);
  }
}