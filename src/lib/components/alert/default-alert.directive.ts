import { Directive, OnInit, inject } from '@angular/core';
import { LibAlertComponent } from './alert.component';
import { ALERT_CONFIG } from './alert.config';

@Directive({
  selector: '[libDefaultAlert]',
  standalone: true
})
export class DefaultAlertDirective implements OnInit {
  private config = inject(ALERT_CONFIG);
  private alert = inject(LibAlertComponent);

  constructor() {
    // Définir immédiatement le type requis dans le constructeur
    this.alert.type.set(this.config.type ?? 'info');
  }

  ngOnInit() {
    // Appliquer le reste de la configuration par défaut
    if (this.config.iconPosition) this.alert.iconPosition.set(this.config.iconPosition);
    if (this.config.closable !== undefined) this.alert.closable.set(this.config.closable);
    if (this.config.size) this.alert.size.set(this.config.size);
    if (this.config.showIcon !== undefined) this.alert.showIcon.set(this.config.showIcon);
    if (this.config.role) this.alert.role.set(this.config.role);
  }
}