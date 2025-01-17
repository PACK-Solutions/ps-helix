import { Injectable, inject } from '@angular/core';
import { BUTTON_CONFIG, BUTTON_STYLES } from './button.config';
import { ButtonConfig } from '../../types/button.types';

/**
 * Service pour la gestion des boutons
 */
@Injectable()
export class ButtonService {
  private config = inject(BUTTON_CONFIG);
  private customStyles = inject(BUTTON_STYLES, { optional: true }) ?? [];

  /**
   * Récupère la configuration du bouton
   */
  getConfig(): Partial<ButtonConfig> {
    return this.config;
  }

  /**
   * Récupère les styles personnalisés
   */
  getCustomStyles(): Record<string, string>[] {
    return this.customStyles;
  }

  /**
   * Détermine si le bouton doit afficher un label
   */
  shouldShowLabel(iconPosition: string): boolean {
    return iconPosition !== 'only';
  }

  /**
   * Génère un label ARIA pour le bouton
   */
  generateAriaLabel(variant: string, iconPosition: string): string {
    return iconPosition === 'only' ? `Button ${variant}` : '';
  }
}