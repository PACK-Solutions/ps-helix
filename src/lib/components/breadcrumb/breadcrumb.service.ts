import { Injectable, inject } from '@angular/core';
import { BREADCRUMB_CONFIG, BREADCRUMB_STYLES } from './breadcrumb.config';
import { BreadcrumbConfig } from './breadcrumb.types';

/**
 * Service pour la gestion du fil d'ariane
 */
@Injectable()
export class BreadcrumbService {
  private config = inject(BREADCRUMB_CONFIG);
  private customStyles = inject(BREADCRUMB_STYLES, { optional: true }) ?? [];

  /**
   * Récupère la configuration du fil d'ariane
   */
  getConfig(): Partial<BreadcrumbConfig> {
    return this.config;
  }

  /**
   * Récupère les styles personnalisés
   */
  getCustomStyles(): Record<string, string>[] {
    return this.customStyles;
  }

  /**
   * Génère un label ARIA pour un élément
   */
  generateAriaLabel(label: string, isLast: boolean): string {
    return isLast ? `Page actuelle: ${label}` : label;
  }
}