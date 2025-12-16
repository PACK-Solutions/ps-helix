/**
 * Interface pour un élément de la barre d'onglets
 */
export interface TabBarItem {
  /** Identifiant unique */
  id: string;
  /** Label de l'onglet */
  label: string;
  /** Icône Phosphor */
  icon: string;
  /** État désactivé */
  disabled?: boolean;
  /** Badge */
  badge?: string | number;
}

/**
 * Configuration complète de la barre d'onglets
 */
export interface TabBarConfig {
  /** État désactivé */
  disabled: boolean;
  /** Position de la barre */
  position: 'bottom' | 'top';
  /** Animation activée */
  animated: boolean;
}

/**
 * Événement émis lors du changement d'onglet dans la TabBar
 */
export interface TabBarChangeEvent {
  /** Index du nouvel onglet actif */
  index: number;
  /** Item sélectionné */
  item: TabBarItem;
  /** Index précédent */
  previousIndex: number;
}