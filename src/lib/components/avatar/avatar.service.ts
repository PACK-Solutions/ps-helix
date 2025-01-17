import { Injectable, inject } from '@angular/core';
import { AVATAR_CONFIG, AVATAR_STATUS_COLORS, AVATAR_STYLES } from './avatar.config';
import { AvatarConfig } from './avatar.types';

/**
 * Service pour la gestion des avatars
 */
@Injectable()
export class AvatarService {
  private config = inject(AVATAR_CONFIG);
  private statusColors = inject(AVATAR_STATUS_COLORS);
  private customStyles = inject(AVATAR_STYLES, { optional: true }) ?? [];

  /**
   * Récupère la configuration de l'avatar
   */
  getConfig(): Partial<AvatarConfig> {
    return this.config;
  }

  /**
   * Récupère la couleur d'un statut
   */
  getStatusColor(status: string): string {
    return this.statusColors[status] || 'var(--surface-400)';
  }

  /**
   * Récupère les styles personnalisés
   */
  getCustomStyles(): Record<string, string>[] {
    return this.customStyles;
  }

  /**
   * Génère les initiales à partir d'un nom
   */
  generateInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}