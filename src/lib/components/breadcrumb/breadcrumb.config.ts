import { InjectionToken } from '@angular/core';
import { BreadcrumbConfig } from './breadcrumb.types';

/**
 * Token d'injection pour la configuration globale du fil d'ariane
 */
export const BREADCRUMB_CONFIG = new InjectionToken<Partial<BreadcrumbConfig>>('BREADCRUMB_CONFIG', {
  factory: () => ({
    separator: 'caret-right',
    size: 'medium',
    variant: 'default'
  })
});

/**
 * Token d'injection pour les styles personnalisés
 */
export const BREADCRUMB_STYLES = new InjectionToken<Record<string, string>[]>('BREADCRUMB_STYLES', {
  factory: () => []
});