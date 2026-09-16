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

/**
 * Contexte du template d'item de tab-bar.
 */
export interface TabBarItemContext {
  /** L'item rendu. */
  $implicit: TabBarItem;
  /** Index dans la barre. */
  index: number;
  /** Onglet actif. */
  active: boolean;
  /** Désactivé, par lui-même ou par la barre entière. */
  disabled: boolean;
}
