import { InjectionToken } from '@angular/core';
import { AvatarConfig } from './avatar.types';

/**
 * Token d'injection pour la configuration globale des avatars
 */
export const AVATAR_CONFIG = new InjectionToken<Partial<AvatarConfig>>('AVATAR_CONFIG', {
  factory: () => ({
    size: 'medium',
    shape: 'circle',
    alt: 'User avatar',
    icon: 'user'
  })
});

/**
 * Token d'injection pour les couleurs des statuts
 */
export const AVATAR_STATUS_COLORS = new InjectionToken<Record<string, string>>('AVATAR_STATUS_COLORS', {
  factory: () => ({
    online: 'var(--success-color)',
    offline: 'var(--surface-400)',
    away: 'var(--warning-color)',
    busy: 'var(--danger-color)'
  })
});

/**
 * Token d'injection pour les styles personnalisés
 */
export const AVATAR_STYLES = new InjectionToken<Record<string, string>[]>('AVATAR_STYLES', {
  factory: () => []
});