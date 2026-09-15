import { PshSurfaceAppearance } from '../../types/semantic.types';
/**
 * Tailles disponibles pour la pagination
 */
export type PaginationSize = 'small' | 'medium' | 'large';

/**
 * Variantes visuelles de la pagination
 */
/**
 * @deprecated since 7.0.0 — use {@link PshSurfaceAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type PaginationVariant = PshSurfaceAppearance;

/**
 * Configuration complète de la pagination
 */
export interface PaginationConfig {
  /** Taille de la pagination */
  size: PaginationSize;
  /** Variante visuelle */
  appearance: PaginationVariant;
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