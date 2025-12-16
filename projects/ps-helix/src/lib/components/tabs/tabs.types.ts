/**
 * Variantes disponibles pour les onglets
 */
export type TabsVariant = 'default' | 'underline' | 'pills';

/**
 * Tailles disponibles pour les onglets
 */
export type TabsSize = 'small' | 'medium' | 'large';

/**
 * Interface pour un onglet
 */
export interface Tab {
  /** Titre de l'onglet */
  header: string;
  /** Icône optionnelle */
  icon?: string;
  /** Contenu de l'onglet */
  content: string;
  /** Onglet désactivé */
  disabled?: boolean;
  /** Label ARIA personnalisé */
  ariaLabel?: string;
}

/**
 * Événement émis lors du changement d'onglet
 */
export interface TabChangeEvent {
  /** Index précédent */
  previousIndex: number;
  /** Index actuel */
  currentIndex: number;
  /** Onglet actif */
  tab: Tab;
}

/**
 * Configuration complète des onglets
 */
export interface TabsConfig {
  /** Variante visuelle */
  variant: TabsVariant;
  /** Taille des onglets */
  size: TabsSize;
  /** Index actif */
  activeIndex: number;
  /** Animation activée */
  animated: boolean;
}