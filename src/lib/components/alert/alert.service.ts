import { Injectable, inject } from '@angular/core';
import { ALERT_CONFIG, ALERT_ICONS, ALERT_STYLES } from './alert.config';
import { AlertConfig } from './alert.types';

/**
 * Service pour la gestion des alertes
 * Fournit des méthodes utilitaires et la configuration
 */
@Injectable()
export class AlertService {
  private config = inject(ALERT_CONFIG);
  private defaultIcons = inject(ALERT_ICONS);
  private customStyles = inject(ALERT_STYLES, { optional: true }) ?? [];

  /**
   * Récupère la configuration de l'alerte
   */
  getConfig(): Partial<AlertConfig> {
    return this.config;
  }

  /**
   * Récupère l'icône par défaut pour un type d'alerte
   */
  getDefaultIcon(type: string): string {
    return this.defaultIcons[type] || 'info';
  }

  /**
   * Détermine le niveau de politesse ARIA en fonction du type
   */
  getAriaLive(type: string): 'polite' | 'assertive' {
    return ['warning', 'danger'].includes(type) ? 'assertive' : 'polite';
  }

  /**
   * Détermine le rôle ARIA en fonction du type
   */
  getAriaRole(type: string): 'alert' | 'status' {
    return ['warning', 'danger'].includes(type) ? 'alert' : 'status';
  }

  /**
   * Récupère les styles personnalisés
   */
  getCustomStyles(): Record<string, string>[] {
    return this.customStyles;
  }
}