/**
 * Interface pour un élément du fil d'ariane
 */
export interface BreadcrumbItem {
  /** Label à afficher */
  label: string;
  /** Chemin de navigation */
  path: string;
  /** Icône optionnelle */
  icon?: string;
  /** Label ARIA personnalisé */
  ariaLabel?: string;
}

/**
 * Tailles disponibles pour le fil d'ariane
 */
export type BreadcrumbSize = 'small' | 'medium' | 'large';

/**
 * Variantes visuelles du fil d'ariane
 */
export type BreadcrumbVariant = 'default' | 'outline';

/**
 * Configuration complète du fil d'ariane
 */
export interface BreadcrumbConfig {
  /** Liste des éléments */
  items: BreadcrumbItem[];
  /** Icône de séparation */
  separator: string;
  /** Taille du composant */
  size: BreadcrumbSize;
  /** Variante visuelle */
  variant: BreadcrumbVariant;
  /** Label ARIA personnalisé */
  ariaLabel?: string;
}