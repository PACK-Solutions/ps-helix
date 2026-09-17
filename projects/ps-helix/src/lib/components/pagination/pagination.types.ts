import { PshSurfaceAppearance } from '../../types/semantic.types';
import { PshConfigValue } from '../../utils/config-value';
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
  /** Label of the "first page" control */
  firstLabel?: PshConfigValue<string>;
  /** Label of the "previous page" control */
  previousLabel?: PshConfigValue<string>;
  /** Label of the "next page" control */
  nextLabel?: PshConfigValue<string>;
  /** Label of the "last page" control */
  lastLabel?: PshConfigValue<string>;
  /** Word before a page number */
  pageLabel?: PshConfigValue<string>;
  /** Word between the current page and the total, as in "Page 2 of 7" */
  ofLabel?: PshConfigValue<string>;
  /** Word after an item count */
  itemsLabel?: PshConfigValue<string>;
  /** Label of the page-size selector */
  itemsPerPageLabel?: PshConfigValue<string>;
  /** Accessible name of the navigation landmark */
  ariaLabel?: PshConfigValue<string>;
}