import { Directive, OnInit, inject } from '@angular/core';
import { LibBreadcrumbComponent } from './breadcrumb.component';
import { BREADCRUMB_CONFIG } from './breadcrumb.config';

/**
 * Directive pour appliquer une configuration par défaut au fil d'ariane
 */
@Directive({
  selector: '[libDefaultBreadcrumb]',
  standalone: true
})
export class DefaultBreadcrumbDirective implements OnInit {
  private config = inject(BREADCRUMB_CONFIG);
  private breadcrumb = inject(LibBreadcrumbComponent);

  ngOnInit() {
    // Appliquer la configuration par défaut
    if (this.config.separator) this.breadcrumb.separator.set(this.config.separator);
    if (this.config.size) this.breadcrumb.size.set(this.config.size);
    if (this.config.variant) this.breadcrumb.variant.set(this.config.variant);
  }
}