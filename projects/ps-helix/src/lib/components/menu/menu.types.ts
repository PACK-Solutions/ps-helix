/**
 * Type pour le mode d'affichage du menu
 */
export type MenuMode = 'vertical' | 'horizontal';

/**
 * Type pour les variantes du menu
 */
export type MenuVariant = 'default' | 'compact' | 'expanded';

/**
 * Interface pour un élément du menu
 */
export interface MenuItem<T = string> {
  /** Identifiant unique */
  id: string;
  /** Contenu à afficher */
  content: string;
  /** Icône Phosphor */
  icon?: string;
  /** Chemin de navigation */
  path?: string;
  /** État désactivé */
  disabled?: boolean;
  /** État actif */
  active?: boolean;
  /** Sous-menu */
  children?: MenuItem<T>[];
  /** Séparateur */
  divider?: boolean;
  /** Badge */
  badge?: string | number;
  /** Valeur associée */
  value?: T;
}

/**
 * Contexte du template d'item de menu.
 */
export interface MenuItemContext<T = unknown> {
  /** L'item rendu. */
  $implicit: MenuItem<T>;
  /** Index dans sa liste. */
  index: number;
  /** Le label est visible : faux quand le menu est replié en mode icônes. */
  withLabel: boolean;
  /** Sous-menu déplié. */
  expanded: boolean;
}

/** Application-wide defaults for `psh-menu`, provided through `MENU_CONFIG`. */
export interface MenuConfig {
  mode: MenuMode;
  variant: MenuVariant;
  collapsible: boolean;
}
