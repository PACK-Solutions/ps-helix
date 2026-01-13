import { TemplateRef } from '@angular/core';

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
  sortFn?: (a: any, b: any) => number;
}

/**
 * Interface for a row of the table
 */
export interface TableRow {
  /** Identifiant unique */
  id: string | number;
  /** Données de la ligne */
  [key: string]: any;
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
  variant: 'default' | 'outline';
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
  emptyMessage: string;
  /** Message quand recherche sans resultat */
  noResultsMessage: string;
  /** Recherche globale */
  globalSearch: boolean;
  /** Placeholder de recherche */
  globalSearchPlaceholder: string;
}