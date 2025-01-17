import { InjectionToken } from '@angular/core';
import { ButtonConfig } from '../../types/button.types';

/**
 * Token d'injection pour la configuration globale des boutons
 */
export const BUTTON_CONFIG = new InjectionToken<Partial<ButtonConfig>>('BUTTON_CONFIG', {
  factory: () => ({
    variant: 'primary',
    size: 'medium',
    iconPosition: 'left',
    disabled: false,
    loading: false,
    fullWidth: false,
    showLabel: false
  })
});

/**
 * Token d'injection pour les styles personnalisés
 */
export const BUTTON_STYLES = new InjectionToken<Record<string, string>[]>('BUTTON_STYLES', {
  factory: () => []
});