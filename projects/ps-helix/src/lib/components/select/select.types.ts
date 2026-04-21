/**
 * Interface pour une option du select
 */
export interface SelectOption<T> {
  /** Label à afficher */
  label: string;
  /** Valeur associée */
  value: T;
  /** Icône Phosphor */
  icon?: string;
  /** État désactivé */
  disabled?: boolean;
  /** Description additionnelle */
  ariaLabel?: string;
  description?: string;
  /** Métadonnées personnalisées */
  metadata?: any;
  /** Classes CSS personnalisées */
  class?: string;
}

/**
 * Interface pour un groupe d'options
 */
export interface SelectOptionGroup<T> {
  /** Label du groupe */
  label: string;
  /** Options du groupe */
  options: SelectOption<T>[];
  /** État désactivé */
  disabled?: boolean;
}

/**
 * Tailles disponibles pour le select
 */
export type SelectSize = 'small' | 'medium' | 'large';

/**
 * Configuration de la recherche
 */
export interface SearchConfig {
  /** Délai avant recherche */
  debounceTime: number;
  /** Placeholder de recherche */
  placeholder: string;
  /** Minimum de caractères */
  minLength: number;
}

/**
 * Configuration du scroll virtuel
 */
export interface VirtualScrollConfig {
  /** Taille des éléments */
  itemSize: number;
  /** Buffer */
  buffer: number;
}

/**
 * Configuration complète du select
 */
export interface SelectConfig<T> {
  /** Valeur sélectionnée */
  value: T | T[];
  /** Options disponibles */
  options: (SelectOption<T> | SelectOptionGroup<T>)[];
  /** Taille du select */
  size: SelectSize;
  /** Sélection multiple */
  multiple: boolean;
  /** Recherche activée */
  searchable: boolean;
  /** Configuration de la recherche */
  searchConfig: SearchConfig;
  /** Scroll virtuel activé */
  virtualScroll: boolean;
  /** Configuration du scroll virtuel */
  virtualScrollConfig: VirtualScrollConfig;
  /** Nombre maximum de sélections */
  maxSelections?: number;
  /** Nombre minimum de sélections */
  minSelections?: number;
  /** Fonction de comparaison */
  compareWith?: (a: T, b: T) => boolean;
}