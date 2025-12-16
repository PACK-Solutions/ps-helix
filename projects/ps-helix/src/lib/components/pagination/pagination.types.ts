/**
 * Tailles disponibles pour la pagination
 */
export type PaginationSize = 'small' | 'medium' | 'large';

/**
 * Variantes visuelles de la pagination
 */
export type PaginationVariant = 'default' | 'outline';

/**
 * Configuration complète de la pagination
 */
export interface PaginationConfig {
  /** Taille de la pagination */
  size: PaginationSize;
  /** Variante visuelle */
  variant: PaginationVariant;
  /** Afficher les boutons premier/dernier */
  showFirstLast: boolean;
  /** Afficher les boutons précédent/suivant */
  showPrevNext: boolean;
  /** Nombre maximum de pages visibles */
  maxVisiblePages: number;
  /** Afficher le sélecteur d'éléments par page */
  showItemsPerPage: boolean;
  /** Options du sélecteur d'éléments par page */
  itemsPerPageOptions: number[];
}