/**
 * Tailles disponibles pour l'avatar
 */
export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Formes disponibles pour l'avatar
 */
export type AvatarShape = 'circle' | 'square';

/**
 * Statuts possibles pour l'avatar
 */
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

/**
 * Configuration complète d'un avatar
 */
export interface AvatarConfig {
  /** Taille de l'avatar */
  size: AvatarSize;
  /** Forme de l'avatar */
  shape: AvatarShape;
  /** URL de l'image */
  src?: string;
  /** Texte alternatif */
  alt: string;
  /** Initiales à afficher */
  icon?: string;
  initials?: string;
  /** Icône à afficher */
  /** Statut de l'utilisateur */
  status?: AvatarStatus;
  /** Label ARIA personnalisé */
  ariaLabel?: string;
}