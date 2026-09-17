import { TemplateRef } from '@angular/core';
import { PshConfigValue } from '../../utils/config-value';

/**
 * Contexte pour les templates personnalisés de cellule
 */
export interface TableCellContext<T = TableRow> {
  /** Données de la ligne */
  $implicit: T;
  /** Configuration de la colonne */
  column: TableColumn;
}

/**
 * Interface for a column of the table
 */
export interface TableColumn {
  /** Clé unique de la colonne */
  key: string;
  /** Label traduit */
  label: string;
  /** Chemin d'accès à la valeur (pour les objets imbriqués) */
  path?: string;
  /** Largeur optionnelle */
  width?: string;
  /** Colonne triable */
  sortable?: boolean;
  /** Template personnalisé */
  template?: TemplateRef<TableCellContext>;
  /** Fonction de tri personnalisée */
  sortFn?: (a: TableRow, b: TableRow) => number;
}

/**
 * Interface for a row of the table
 */
export interface TableRow {
  /** Identifiant unique */
  id: string | number;
  /** Lignes enfants (un seul niveau) */
  children?: TableRow[];
  /** Données de la ligne (valeurs arbitraires — l'appelant restreint le type) */
  [key: string]: unknown;
}

export interface TableRowExpandEvent {
  id: string | number;
  row: TableRow;
  expanded: boolean;
}

export interface TableExpandedRowContext {
  $implicit: TableRow;
}

/**
 * Contexte du template d'en-tête de colonne.
 *
 * L'en-tête était figé avant la 7.0.0 : `{{ column.label }}` plus l'icône de tri, sans point
 * d'extension — la cellule de corps était templatable, l'en-tête non. Un filtre par colonne
 * ou un libellé à deux niveaux imposait `::ng-deep`.
 */
export interface TableHeaderContext {
  /** La colonne rendue. */
  $implicit: TableColumn;
  /** Tri courant sur cette colonne, ou `null`. */
  sort: 'asc' | 'desc' | null;
  /** Déclenche le tri sur cette colonne. Le composant garde l'accessibilité clavier. */
  toggleSort: () => void;
}

/**
 * Contexte du template d'état vide.
 *
 * `emptyMessage` et `noResultsMessage` étaient des `string` : ni illustration, ni action.
 */
export interface TableEmptyContext {
  /** Le message qui aurait été affiché, déjà résolu entre « vide » et « aucun résultat ». */
  $implicit: string;
  /** Terme de recherche courant, s'il y en a un — l'état est « aucun résultat », pas « vide ». */
  searchTerm: string;
}

/**
 * Interface for row click event
 */
export interface TableRowClickEvent {
  /** Identifiant de la ligne */
  id: string | number;
  /** Données complètes de la ligne */
  row: TableRow;
}

/**
 * Type for sorting
 */
export interface TableSort {
  /** Clé de la colonne */
  key: string;
  /** Direction du tri */
  direction: 'asc' | 'desc';
}

/**
 * Configuration complète de la table
 */
export interface TableConfig {
  /** Style de la table */
  appearance: 'flat' | 'outline';
  /** Taille de la table */
  size: 'small' | 'medium' | 'large';
  /** Lignes alternées */
  striped: boolean;
  /** Effet au survol */
  hoverable: boolean;
  /** Bordures */
  bordered: boolean;
  /** État de chargement */
  loading: boolean;
  /** Message quand vide */
  emptyMessage: PshConfigValue<string>;
  /** Message quand recherche sans resultat */
  noResultsMessage: PshConfigValue<string>;
  /** Recherche globale */
  globalSearch: boolean;
  /** Placeholder de recherche */
  globalSearchPlaceholder: PshConfigValue<string>;
  /** Table layout (auto or fixed for percentage widths) */
  tableLayout: 'auto' | 'fixed';
  /** Truncate text with ellipsis */
  truncateText: boolean;
  /** Full width mode */
  fullWidth: boolean;
  /** Lignes extensibles */
  expandable: boolean;
  /** Mode accordéon (une seule ligne ouverte à la fois) */
  singleExpand: boolean;
}