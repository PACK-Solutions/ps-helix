import { PshColor } from '../../types/semantic.types';
/**
 * Variantes visuelles disponibles pour la carte
 */
export type CardVariant = 'default' | 'elevated' | 'outlined';

/**
 * Variantes de couleur pour les cartes spéciales
 */
/**
 * @deprecated since 7.0.0 — use {@link PshColor}. Every component now shares one
 * semantic colour union, so this alias exists only to ease the migration.
 */
export type CardColorVariant = PshColor;

/**
 * Niveaux de densité pour le spacing
 */
export type CardDensity = 'compact' | 'normal' | 'spacious';

/**
 * Alignement des actions dans la zone card-actions
 */
export type CardActionsAlignment = 'left' | 'center' | 'right' | 'space-between';