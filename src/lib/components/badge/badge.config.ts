import { InjectionToken } from '@angular/core';
import { BadgeConfig } from './badge.types';

// Configuration globale du badge
export const BADGE_CONFIG = new InjectionToken<Partial<BadgeConfig>>('BADGE_CONFIG', {
  factory: () => ({
    variant: 'primary',
    size: 'medium',
    displayType: 'dot',
    max: 99,
    showZero: false,
    position: 'top-right'
  })
});

// Provider pour les styles personnalisés
export const BADGE_STYLES = new InjectionToken<Record<string, string>[]>('BADGE_STYLES', {
  factory: () => []
});

// Provider pour la stratégie d'affichage des valeurs
export interface BadgeValueFormatter<T = number> {
  format: (value: T, max?: number) => string;
}

export const BADGE_VALUE_FORMATTER = new InjectionToken<BadgeValueFormatter>('BADGE_VALUE_FORMATTER', {
  factory: () => ({
    format: (value: number, max: number = 99) => value > max ? `${max}+` : `${value}`
  })
});