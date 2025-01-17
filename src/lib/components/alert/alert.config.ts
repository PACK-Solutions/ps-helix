import { InjectionToken } from '@angular/core';
import { AlertConfig } from './alert.types';

/**
 * Token d'injection pour la configuration globale des alertes
 */
export const ALERT_CONFIG = new InjectionToken<Partial<AlertConfig>>('ALERT_CONFIG', {
  factory: () => ({
    type: 'info',
    iconPosition: 'left',
    closable: false,
    size: 'medium',
    showIcon: true,
    role: 'alert'
  })
});

/**
 * Token d'injection pour les icônes par défaut des alertes
 */
export const ALERT_ICONS = new InjectionToken<Record<string, string>>('ALERT_ICONS', {
  factory: () => ({
    info: 'info',
    success: 'check-circle',
    warning: 'warning',
    danger: 'warning-octagon'
  })
});

/**
 * Token d'injection pour les styles personnalisés des alertes
 */
export const ALERT_STYLES = new InjectionToken<Record<string, string>[]>('ALERT_STYLES', {
  factory: () => []
});